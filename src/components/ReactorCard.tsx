import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { SimpleChart } from "./SimpleChart";
import { ReactorDetails } from "./ReactorDetails";
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
import "./ReactorCard.css";

interface ReactorCardProps {
  id: string;
  name: string;
}

export function ReactorCard({ id, name }: ReactorCardProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [showDetails, setShowDetails] = useState(false);
  const [reactorName, setReactorNameState] = useState(name);
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

  // Load data
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

        // Add to history
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
    const interval = setInterval(loadData, 5000); // Update every 5 seconds
    return () => {
      mounted = false;
      clearInterval(interval);
    };
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
    <>
      {showDetails && (
        <ReactorDetails
          id={id}
          name={reactorName}
          onClose={() => setShowDetails(false)}
          initialTempHistory={tempHistory}
        />
      )}
      <div className="reactor-card">
        <div className="card-header">
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
            <h3 onClick={() => setEditing(true)} className="reactor-name">
              {reactorName}
            </h3>
          )}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowDetails(true)}
            sx={{ ml: "auto" }}
          >
            Details
          </Button>
        </div>

        <div style={{ height: "80px", margin: "1rem 0" }}>
          <SimpleChart data={tempHistory} color="#E0FF4F" />
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-label">Temperature:</span>
            <span className="stat-value">{(temperature ?? 0).toFixed(1)}°</span>
          </div>
          <div className="stat">
            <span className="stat-label">Output:</span>
            <span className="stat-value">{(output ?? 0).toFixed(1)} MW</span>
          </div>
          <div className="stat">
            <span className="stat-label">Fuel:</span>
            <span className="stat-value">{(fuel ?? 0).toFixed(1)}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">State:</span>
            <span className="stat-value">{state}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Rods:</span>
            <span className="stat-value">{rodState}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Coolant:</span>
            <span className="stat-value">{coolant}</span>
          </div>
        </div>

        <div className="controls">
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
          <Button variant="contained" onClick={handleCoolantToggle} fullWidth>
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
            Shutdown
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              handleAction(() => emergencyShutdown(id), "Emergency shutdown!")
            }
            fullWidth
          >
            E-Stop
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              handleAction(() => startReactor(id), "Reactor started")
            }
            fullWidth
          >
            Start
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              handleAction(() => maintenanceMode(id), "Maintenance mode")
            }
            fullWidth
          >
            Maintenance
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
    </>
  );
}
