import { useState, useEffect } from "react";
import { Shell } from "../components/Shell";
import { getLogs } from "../api/reactors.api";
import "./LogsPage.css";

export function LogsPage() {
  const [plantName, setPlantName] = useState(
    localStorage.getItem("plantName") || "Nuclear Power Simulator"
  );
  const [unit, setUnit] = useState<"F" | "C">(
    (localStorage.getItem("tempUnit") as "F" | "C") || "F"
  );
  const [logs, setLogs] = useState<Array<{ time: string; message: string }>>(
    []
  );

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await getLogs();

        // Convert logs object to array
        const logArray = Object.entries(data.logs || {}).map(
          ([time, message]) => ({
            time,
            message: String(message),
          })
        );

        // Sort by time (newest first)
        logArray.sort((a, b) => b.time.localeCompare(a.time));

        setLogs(logArray);
      } catch (error) {
        console.error("Failed to load logs:", error);
      }
    };

    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Shell
      plantName={plantName}
      onPlantNameChange={setPlantName}
      unit={unit}
      onUnitChange={setUnit}
    >
      <div className="logs-page">
        <h1>System Logs</h1>
        <div className="logs-container">
          {logs.length === 0 ? (
            <div className="no-logs">No logs available</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="log-entry">
                <span className="log-time">{log.time}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}
