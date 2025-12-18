import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { SimpleChart } from "./SimpleChart";
import {
  getReactorTemperature,
  getReactorCoolant,
  getReactorOutput,
  getFuelLevel,
  getReactorState,
  getRodState,
  setReactorCoolant,
  raiseRod,
  dropRod,
  emergencyShutdown,
  controlledShutdown,
  startReactor,
  maintenanceMode,
  refuelReactor,
  setReactorName,
  getLogs,
} from "../api/reactors.api";
import "./ReactorDetails.css";

interface ReactorDetailsProps {
  id: string;
  name: string;
  onClose: () => void;
  initialTempHistory?: Array<{ time: string; value: number }>;
}

export function ReactorDetails({
  id,
  name,
  onClose,
  initialTempHistory = [],
}: ReactorDetailsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [reactorName, setReactorNameState] = useState(name);
  const [temperature, setTemperature] = useState(0);
  const [tempHistory, setTempHistory] =
    useState<Array<{ time: string; value: number }>>(initialTempHistory);
  const [coolant, setCoolant] = useState("unknown");
  const [output, setOutput] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [state, setState] = useState("unknown");
  const [rodState, setRodState] = useState("unknown");
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(reactorName);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [
          tempData,
          coolantData,
          outputData,
          fuelData,
          stateData,
          rodData,
        ] = await Promise.all([
          getReactorTemperature(id),
          getReactorCoolant(id),
          getReactorOutput(id),
          getFuelLevel(id),
          getReactorState(id),
          getRodState(id),
        ]);

        if (!mounted) return;

        setTemperature(Number(tempData.temperature.amount) || 0);
        setCoolant(coolantData.coolant);
        setOutput(Number(outputData.output.amount) || 0);
        setFuel(Number(fuelData.fuel.percentage) || 0);
        setState(stateData.state);
        setRodState(
          `${rodData.control_rods.in} in / ${rodData.control_rods.out} out`
        );

        const now = new Date().toLocaleTimeString();
        setTempHistory((prev) => [
          ...prev.slice(-19),
          { time: now, value: Number(tempData.temperature.amount) || 0 },
        ]);
      } catch (error) {
        console.error("Failed to load reactor data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [id]);

  // Load logs
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await getLogs();
        // Find logs for this specific reactor
        const reactorLogs: string[] = [];
        data.forEach((reactorLogsObj) => {
          if (reactorLogsObj[id]) {
            reactorLogs.push(...reactorLogsObj[id]);
          }
        });
        setLogs(reactorLogs.reverse());
      } catch (error) {
        console.error("Failed to load reactor logs:", error);
      }
    };

    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSaveName = async () => {
    try {
      await setReactorName(id, tempName);
      setReactorNameState(tempName);
      setEditing(false);
      localStorage.setItem(`reactor-${id}-name`, tempName);
    } catch (error) {
      enqueueSnackbar("Failed to save reactor name", { variant: "error" });
    }
  };

  const handleCoolantToggle = async () => {
    try {
      const newState = coolant === "on" ? "off" : "on";
      await setReactorCoolant(id, newState);
      setCoolant(newState);
    } catch (error) {
      enqueueSnackbar("Failed to toggle coolant", { variant: "error" });
    }
  };

  const handleAction = async (
    action: () => Promise<any>,
    successMsg: string
  ) => {
    try {
      await action();
      enqueueSnackbar(successMsg, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Action failed: ${error}`, { variant: "error" });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {editing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              autoFocus
              className="reactor-name-input"
            />
          ) : (
            <h2 onClick={() => setEditing(true)} className="reactor-name">
              {reactorName}
            </h2>
          )}
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="details-section">
            <h3>Temperature History</h3>
            <div style={{ height: "200px" }}>
              <SimpleChart data={tempHistory} color="#E0FF4F" />
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-card">
              <span className="detail-label">Temperature</span>
              <span className="detail-value">
                {(temperature ?? 0).toFixed(1)}°
              </span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Coolant</span>
              <span className="detail-value">{coolant}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Output</span>
              <span className="detail-value">
                {(output ?? 0).toFixed(0)} MW
              </span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Fuel</span>
              <span className="detail-value">{(fuel ?? 0).toFixed(1)}%</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">State</span>
              <span className="detail-value">{state}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Control Rods</span>
              <span className="detail-value">{rodState}</span>
            </div>
          </div>

          <div className="controls-section">
            <h3>Controls</h3>
            <div className="controls-grid">
              <Button
                variant="contained"
                color={coolant === "on" ? "warning" : "success"}
                onClick={handleCoolantToggle}
              >
                {coolant === "on" ? "Disable" : "Enable"} Coolant
              </Button>
              <Button
                variant="contained"
                onClick={() => handleAction(() => raiseRod(id), "Rod raised")}
              >
                Raise Rod
              </Button>
              <Button
                variant="contained"
                onClick={() => handleAction(() => dropRod(id), "Rod dropped")}
              >
                Drop Rod
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  handleAction(() => startReactor(id), "Reactor started")
                }
              >
                Start Reactor
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() =>
                  handleAction(
                    () => controlledShutdown(id),
                    "Controlled shutdown initiated"
                  )
                }
              >
                Controlled Shutdown
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  handleAction(
                    () => emergencyShutdown(id),
                    "Emergency shutdown activated"
                  )
                }
              >
                Emergency Shutdown
              </Button>
              <Button
                variant="contained"
                onClick={() =>
                  handleAction(() => maintenanceMode(id), "Maintenance mode")
                }
              >
                Maintenance
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  handleAction(() => refuelReactor(id), "Refueling started")
                }
              >
                Refuel
              </Button>
            </div>
          </div>

          <div className="logs-section">
            <h3>Reactor Activity Log</h3>
            <div className="logs-list">
              {logs.length === 0 ? (
                <p className="no-logs">No activity logged</p>
              ) : (
                logs.map((log, idx) => {
                  const match = log.match(/^([^:]+): (.+)$/);
                  const time = match ? match[1] : "";
                  const message = match ? match[2] : log;
                  return (
                    <div key={idx} className="log-entry">
                      <span className="log-time">
                        {time ? new Date(time).toLocaleString() : ""}
                      </span>
                      <span className="log-message">{message}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
