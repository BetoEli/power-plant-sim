import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { Shell } from "../components/Shell";
import { SimpleChart } from "../components/SimpleChart";
import { ReactorCard } from "../components/ReactorCard";
import {
  getReactors,
  getReactorTemperature,
  getReactorOutput,
  setReactorCoolant,
  emergencyShutdown,
  resetAll,
} from "../api/reactors.api";
import "./DashboardPage.css";

export function DashboardPage() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const reactorList = await getReactors();
        if (!mounted) return;

        setReactors(reactorList.reactors);

        // Get temperature and output for all reactors
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

        // Add to history
        const now = new Date().toLocaleTimeString();
        setTempHistory((prev) => [
          ...prev.slice(-19),
          { time: now, value: avgTemperature },
        ]);

        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        if (!mounted) return;
        setError(
          error instanceof Error ? error.message : "Failed to load data"
        );
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

  const handleGlobalCoolant = async (state: "on" | "off") => {
    try {
      await Promise.all(reactors.map((r) => setReactorCoolant(r.id, state)));
      enqueueSnackbar(`All coolant systems ${state}`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to change coolant state", { variant: "error" });
    }
  };

  const handleGlobalShutdown = async () => {
    if (!confirm("Emergency shutdown all reactors?")) return;
    try {
      await Promise.all(reactors.map((r) => emergencyShutdown(r.id)));
      enqueueSnackbar("All reactors shut down", { variant: "success" });
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

  if (loading) {
    return (
      <Shell
        plantName={plantName}
        onPlantNameChange={setPlantName}
        unit={unit}
        onUnitChange={setUnit}
      >
        <div className="loading">Loading dashboard...</div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell
        plantName={plantName}
        onPlantNameChange={setPlantName}
        unit={unit}
        onUnitChange={setUnit}
      >
        <div className="error">Error: {error}</div>
      </Shell>
    );
  }

  return (
    <Shell
      plantName={plantName}
      onPlantNameChange={setPlantName}
      unit={unit}
      onUnitChange={setUnit}
    >
      <div className="dashboard">
        <div className="global-stats">
          <h2>Global Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Average Temperature</div>
              <div className="stat-value">
                {(avgTemp ?? 0).toFixed(1)}°{unit}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Output</div>
              <div className="stat-value">
                {((totalOutput ?? 0) / 1000).toFixed(2)} GW
              </div>
            </div>
          </div>
          <div style={{ height: "200px", marginTop: "1rem" }}>
            <SimpleChart data={tempHistory} color="#E0FF4F" />
          </div>

          <div className="global-controls">
            <Button
              variant="contained"
              onClick={() => handleGlobalCoolant("on")}
              fullWidth
            >
              Enable All Coolant
            </Button>
            <Button
              variant="contained"
              onClick={() => handleGlobalCoolant("off")}
              fullWidth
            >
              Disable All Coolant
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleGlobalShutdown}
              fullWidth
            >
              Emergency Shutdown All
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleReset}
              fullWidth
            >
              Global Reset
            </Button>
          </div>
        </div>

        <h2>Reactors</h2>
        <div className="reactors-grid">
          {reactors.map((reactor) => (
            <ReactorCard key={reactor.id} id={reactor.id} name={reactor.name} />
          ))}
        </div>
      </div>
    </Shell>
  );
}
