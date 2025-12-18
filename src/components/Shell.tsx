import { TopBar } from "./TopBar";
import "./Shell.css";

interface ShellProps {
  children: React.ReactNode;
  plantName: string;
  onPlantNameChange: (name: string) => void;
  unit: "F" | "C";
  onUnitChange: (unit: "F" | "C") => void;
}

export function Shell({
  children,
  plantName,
  onPlantNameChange,
  unit,
  onUnitChange,
}: ShellProps) {
  return (
    <div className="shell">
      <TopBar
        plantName={plantName}
        onPlantNameChange={onPlantNameChange}
        unit={unit}
        onUnitChange={onUnitChange}
      />
      <main className="shell-content">{children}</main>
    </div>
  );
}
