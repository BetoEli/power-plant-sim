import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SimpleChartProps {
  data: Array<{ time: string; value: number }>;
  color?: string;
}

export function SimpleChart({ data, color = "#E0FF4F" }: SimpleChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#BFD7EA" }}>
        No data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#BFD7EA" opacity={0.3} />
        <XAxis dataKey="time" stroke="#BFD7EA" tick={{ fontSize: 12 }} />
        <YAxis stroke="#BFD7EA" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0b3954",
            border: "1px solid #BFD7EA",
            borderRadius: "4px",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
