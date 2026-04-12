import type {Sensor} from "../../../types/home";

type SensorCardProps = {
  sensor: Sensor;
};

const SensorCard = ({sensor}: SensorCardProps) => {
  return (
    <div className="card">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h3 style={{margin: 0, fontSize: "1.1em"}}>{sensor.name}</h3>

        <span
          className="muted"
          aria-label={sensor.online ? "Online" : "Offline"}
          title={sensor.online ? "Online" : "Offline"}
          style={{display: "flex", alignItems: "center"}}
        >
          {sensor.online ? "🟢" : "🔴"}
          <span style={{marginLeft: 4}}>
            {sensor.online ? "Online" : "Offline"}
          </span>
        </span>
      </header>

      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          marginTop: 6,
        }}
        role="presentation"
        aria-label={`Wartość: ${sensor.value}${sensor.unit}`}
      >
        {sensor.value} {sensor.unit}
      </div>

      <footer>
        <div className="muted" style={{fontSize: 12, marginTop: 6}}>
          lastSeen: {new Date(sensor.lastSeen).toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
};

export default SensorCard;
