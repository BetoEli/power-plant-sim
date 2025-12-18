import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { Shell } from "../components/Shell";
import { SimpleChart } from "../components/SimpleChart";
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
} from "../api/reactors.api";
import "./ReactorPage.css";

export function ReactorPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams<{ id: string }>();
  const [plantName, setPlantName] = useState(
    localStorage.getItem("plantName") || "Nuclear Power Simulator"
  );
  const [unit, setUnit] = useState<"F" | "C">(
    (localStorage.getItem("tempUnit") as "F" | "C") || "F"
  );
  const [reactorName, setReactorNameState] = useState(`Reactor ${id}`);
  const [temperature, setTemperature] = useState(0);
  const [tempHistory, setTempHistory] = useState<
    Array<{ time: string; value: number }>
  >([]);
  const [coolant, setCoolant] = useState("unknown");
  const [output, setOutput] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [state, setState] = useState("unknown");
  const [rodState, setRodState] = useState("unknown");
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(reactorName);

  useEffect(() => {
    if (!id) return;

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
    return () => clearInterval(interval);
  }, [id]);

  const handleSaveName = async () => {
    if (!id) return;
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
    if (!id) return;
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

  if (!id) {
    return <div>Reactor not found</div>;
  }

  return (
    <Shell
      plantName={plantName}
      onPlantNameChange={setPlantName}
      unit={unit}
      onUnitChange={setUnit}
    >
      <div className="reactor-page">
        <div className="reactor-header">
          {editing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              autoFocus
              className="reactor-name-input-large"
            />
          ) : (
            <h1 onClick={() => setEditing(true)} className="reactor-title">
              {reactorName}
            </h1>
          )}
        </div>

        <div className="reactor-content">
          <div className="chart-section">
            <h2>Temperature History</h2>
            <div style={{ height: "200px" }}>
              <SimpleChart data={tempHistory} color="#E0FF4F" />
            </div>
          </div>

          <div className="stats-section">
            <h2>Status</h2>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Temperature:</span>
                <span className="stat-value">
                  {(temperature ?? 0).toFixed(1)}°{unit}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Output:</span>
                <span className="stat-value">
                  {(output ?? 0).toFixed(1)} MW
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Fuel Level:</span>
                <span className="stat-value">{(fuel ?? 0).toFixed(1)}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Reactor State:</span>
                <span className="stat-value">{state}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Rod State:</span>
                <span className="stat-value">{rodState}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Coolant:</span>
                <span className="stat-value">{coolant}</span>
              </div>
            </div>
          </div>

          <div className="controls-section">
            <h2>Controls</h2>
            <div className="controls-grid">
              <Button
                variant="contained"
                onClick={() => handleAction(() => raiseRod(id), "Rod raised")}
                fullWidth
              >
                Raise Rod
              </Button>
              <Button
                variant="contained"
                onClick={() => handleAction(() => dropRod(id), "Rod dropped")}
                fullWidth
              >
                Drop Rod
              </Button>
              <Button
                variant="contained"
                onClick={handleCoolantToggle}
                fullWidth
              >
                Coolant {coolant === "on" ? "Off" : "On"}
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
                fullWidth
              >
                Controlled Shutdown
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  handleAction(
                    () => emergencyShutdown(id),
                    "Emergency shutdown!"
                  )
                }
                fullWidth
              >
                Emergency Shutdown
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  handleAction(() => startReactor(id), "Reactor started")
                }
                fullWidth
              >
                Start Reactor
              </Button>
              <Button
                variant="contained"
                onClick={() =>
                  handleAction(() => maintenanceMode(id), "Maintenance mode")
                }
                fullWidth
              >
                Maintenance Mode
              </Button>
              <Button
                variant="contained"
                onClick={() =>
                  handleAction(() => refuelReactor(id), "Refueling...")
                }
                fullWidth
              >
                Refuel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
