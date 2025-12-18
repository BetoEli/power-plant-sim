import { useState } from "react";
import { useSnackbar } from "notistack";
import { setTemperatureUnit, setPlantName } from "../api/reactors.api";
import "./TopBar.css";

interface TopBarProps {
  plantName: string;
  onPlantNameChange: (name: string) => void;
  unit: "F" | "C";
  onUnitChange: (unit: "F" | "C") => void;
}

export function TopBar({
  plantName,
  onPlantNameChange,
  unit,
  onUnitChange,
}: TopBarProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(plantName);

  const handleSaveName = async () => {
    try {
      await setPlantName(tempName);
      onPlantNameChange(tempName);
      setEditing(false);
      localStorage.setItem("plantName", tempName);
    } catch (error) {
      enqueueSnackbar("Failed to save plant name", { variant: "error" });
    }
  };

  const handleToggleUnit = async () => {
    const newUnit = unit === "F" ? "C" : "F";
    try {
      await setTemperatureUnit(newUnit === "F" ? "fahrenheit" : "celsius");
      onUnitChange(newUnit);
      localStorage.setItem("tempUnit", newUnit);
    } catch (error) {
      enqueueSnackbar("Failed to change temperature unit", {
        variant: "error",
      });
    }
  };

  return (
    <nav className="topbar">
      <div className="topbar-center">
        {editing ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
            autoFocus
            className="plant-name-input"
          />
        ) : (
          <h1 className="plant-name" onClick={() => setEditing(true)}>
            {plantName}
          </h1>
        )}
      </div>

      <div className="topbar-right">
        <button onClick={handleToggleUnit} className="unit-toggle">
          °{unit}
        </button>
      </div>
    </nav>
  );
}
