import {useReducer} from "react";
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

type Props = {
  title: string;
  value: number;
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString();
}

type Action = {type: "push"; value: number};

function reducer(state: Point[], action: Action): Point[] {
  if (action.type !== "push") return state;

  const ts = Date.now();
  const next = [...state, {t: ts, time: formatTime(ts), value: action.value}];
  return next.filter((p)=>ts-p.t<=60_000)
}

export function LiveChart({title, value}: Props) {
  const [data, dispatch] = useReducer(reducer, []);

  const last = data[data.length - 1]?.value;

  const values = data.map((p) => p.value);
  const min = values.length ? Math.min(...values) : value;
  const max = values.length ? Math.max(...values) : value;

  if (last !== value) {
    dispatch({type: "push", value});
  }

  return (
    <div className="card">
      <div style={{display: "flex", justifyContent: "space-between", gap: 10}}>
        <strong>{title}</strong>
        <span className="muted">min {min.toFixed(1)} • max {max.toFixed(1)}</span>
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
