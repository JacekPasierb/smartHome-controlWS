import {useEffect, useMemo, useState} from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = {
  t: number;
  time: string;
  value: number;
};

type LiveChartProps = {
  title: string;
  value: number;
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString();
}

export function LiveChart({title, value}: LiveChartProps) {
  const [data, setData] = useState<Point[]>([]);

  useEffect(() => {
    const ts = Date.now();

    setData((prev) => {
      const next = [...prev, {t: ts, time: formatTime(ts), value}];
      return next.filter((point) => ts - point.t <= 60_000);
    });
  }, [value]);

  const {min, max} = useMemo(() => {
    const values = data.map((point) => point.value);

    return {
      min: values.length ? Math.min(...values) : value,
      max: values.length ? Math.max(...values) : value,
    };
  }, [data, value]);

  return (
    <div className="card">
      <div style={{display: "flex", justifyContent: "space-between", gap: 10}}>
        <strong>{title}</strong>
        <span className="muted">
          min {min.toFixed(1)} • max {max.toFixed(1)}
        </span>
      </div>

      <div style={{height: 220, marginTop: 12}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis
              width={40}
              tick={{fill: "rgba(255,255,255,0.6)", fontSize: 12}}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: 10,
                color: "rgba(255,255,255,0.9)",
              }}
              labelStyle={{color: "rgba(255,255,255,0.6)"}}
            />
            <Line
              type="monotone"
              dataKey="value"
              dot={false}
              strokeWidth={2}
              stroke="rgba(99,102,241,0.9)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
