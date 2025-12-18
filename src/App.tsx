import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { Shell } from "./components/Shell";
import { SimpleChart } from "./components/SimpleChart";
import { ReactorCard } from "./components/ReactorCard";
import {
  getReactors,
  getReactorTemperature,
  getReactorOutput,
  setReactorCoolant,
  emergencyShutdown,
  controlledShutdown,
  resetAll,
  getLogs,
} from "./api/reactors.api";
import "./App.css";

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const [plantName, setPlantName] = useState(
    localStorage.getItem("plantName") || "Nuclear Power Simulator"
  );
  const [unit, setUnit] = useState<"F" | "C">(
    (localStorage.getItem("tempUnit") as "F" | "C") || "F"
  );
  const [reactors, setReactors] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [avgTemp, setAvgTemp] = useState(0);
  const [totalOutput, setTotalOutput] = useState(0);
  const [tempHistory, setTempHistory] = useState<
    Array<{ time: string; value: number }>
  >([]);
  const [logs, setLogs] = useState<Array<{ time: string; message: string }>>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Load reactor data
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const reactorList = await getReactors();
        if (!mounted) return;

        setReactors(reactorList.reactors);

        const temps = await Promise.all(
          reactorList.reactors.map((r) => getReactorTemperature(r.id))
        );
        const outputs = await Promise.all(
          reactorList.reactors.map((r) => getReactorOutput(r.id))
        );

        const avgTemperature =
          temps.reduce(
            (sum, t) => sum + (Number(t.temperature.amount) || 0),
            0
          ) / temps.length;
        const totalPower = outputs.reduce(
          (sum, o) => sum + (Number(o.output.amount) || 0),
          0
        );

        setAvgTemp(avgTemperature);
        setTotalOutput(totalPower);

        const now = new Date().toLocaleTimeString();
        setTempHistory((prev) => [
          ...prev.slice(-19),
          { time: now, value: avgTemperature },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Load logs
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await getLogs();
        console.log("Raw logs data:", data);
        // API returns array of objects, each with reactor ID as key
        const logArray: Array<{ time: string; message: string }> = [];

        data.forEach((reactorLogs) => {
          Object.entries(reactorLogs).forEach(([reactorId, messages]) => {
            messages.forEach((msg) => {
              // Extract timestamp from message (format: "2025-12-18T02:02:21.075Z: message")
              const match = msg.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z):\s*(.+)$/);
              if (match) {
                logArray.push({
                  time: match[1],
                  message: match[2],
                });
              } else {
                console.log("Could not parse log:", msg);
              }
            });
          });
        });

        logArray.sort((a, b) => b.time.localeCompare(a.time));
        console.log("Parsed log count:", logArray.length);
        setLogs(logArray);
      } catch (error) {
        console.error("Failed to load logs:", error);
      }
    };

    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGlobalCoolant = async (state: "on" | "off") => {
    try {
      await Promise.all(reactors.map((r) => setReactorCoolant(r.id, state)));
      enqueueSnackbar(`All coolant systems ${state}`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to change coolant state", { variant: "error" });
    }
  };

  const handleGlobalEmergencyShutdown = async () => {
    if (!confirm("Emergency shutdown all reactors?")) return;
    try {
      await Promise.all(reactors.map((r) => emergencyShutdown(r.id)));
      enqueueSnackbar("All reactors emergency shutdown", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Failed to shutdown reactors", { variant: "error" });
    }
  };

  const handleGlobalControlledShutdown = async () => {
    if (!confirm("Controlled shutdown all reactors?")) return;
    try {
      await Promise.all(reactors.map((r) => controlledShutdown(r.id)));
      enqueueSnackbar("All reactors controlled shutdown", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Failed to shutdown reactors", { variant: "error" });
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset all systems?")) return;
    try {
      await resetAll();
      enqueueSnackbar("System reset", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to reset", { variant: "error" });
    }
  };

  return (
    <Shell
      plantName={plantName}
      onPlantNameChange={setPlantName}
      unit={unit}
      onUnitChange={setUnit}
    >
      <div className="dashboard">
        <section className="global-stats">
          <h2>Global Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Average Temperature</h3>
              <p className="stat-value">
                {avgTemp.toFixed(1)}°{unit}
              </p>
            </div>
            <div className="stat-card">
              <h3>Total Output</h3>
              <p className="stat-value">{totalOutput.toFixed(0)} MW</p>
            </div>
            <div className="stat-card">
              <h3>Active Reactors</h3>
              <p className="stat-value">{reactors.length}</p>
            </div>
          </div>

          <div className="temp-chart">
            <h3>Average Temperature History</h3>
            <div style={{ height: "250px" }}>
              <SimpleChart data={tempHistory} color="#E0FF4F" />
            </div>
          </div>

          <div className="global-controls">
            <Button
              variant="contained"
              color="success"
              onClick={() => handleGlobalCoolant("on")}
            >
              Enable All Coolant
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleGlobalCoolant("off")}
            >
              Disable All Coolant
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleGlobalControlledShutdown}
            >
              Controlled Shutdown All
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleGlobalEmergencyShutdown}
            >
              Emergency Shutdown All
            </Button>
            <Button variant="contained" onClick={handleReset}>
              Reset System
            </Button>
          </div>
        </section>

        <section className="reactors-section">
          <h2>Reactors</h2>
          {loading && <p>Loading reactors...</p>}
          <div className="reactors-grid">
            {reactors.map((r) => (
              <ReactorCard
                key={r.id}
                id={r.id}
                name={localStorage.getItem(`reactor-${r.id}-name`) || r.name}
              />
            ))}
          </div>
        </section>

        <section className="logs-section">
          <h2>System Logs (All {logs.length} Events)</h2>
          <div className="logs-container">
            {logs.length === 0 ? (
              <p className="no-logs">No logs available</p>
            ) : (
              <div className="logs-list">
                {logs.map((log, idx) => (
                  <div key={idx} className="log-entry">
                    <span className="log-time">
                      {new Date(log.time).toLocaleString()}
                    </span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}

export default App;
