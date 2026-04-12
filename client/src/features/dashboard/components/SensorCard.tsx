import {
  Activity,
  Refrigerator,
  Thermometer,
  Droplets,
  Zap,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import type {Sensor} from "../../../types/home";

type SensorCardProps = {
  sensor: Sensor;
};

function renderSensorIcon(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("lodówka")) {
    return <Refrigerator size={18} />;
  }

  if (normalized.includes("wilgot")) {
    return <Droplets size={18} />;
  }

  if (normalized.includes("mocy") || normalized.includes("power")) {
    return <Zap size={18} />;
  }

  if (normalized.includes("balkon") || normalized.includes("pokój")) {
    return <Thermometer size={18} />;
  }

  return <Activity size={18} />;
}

const SensorCard = ({sensor}: SensorCardProps) => {
  const isAlert =
    sensor.unit === "°C" &&
    typeof sensor.value === "number" &&
    sensor.value > 30;

  return (
    <div className={`card sensorCard ${isAlert ? "sensorCardAlert" : ""}`}>
      <header className="sensorCardHeader">
        <div className="sensorCardTitleWrap">
          <div className="sensorCardIcon">{renderSensorIcon(sensor.name)}</div>

          <div>
            <h3 className="sensorCardTitle">{sensor.name}</h3>
            <div className="sensorCardMeta">
              {sensor.online ? (
                <>
                  <Wifi size={13} />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff size={13} />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        {isAlert && (
          <div className="sensorAlertBadge">
            <AlertTriangle size={14} />
            <span>Alert</span>
          </div>
        )}
      </header>

      <div
        className="sensorValue"
        role="presentation"
        aria-label={`Wartość: ${sensor.value}${sensor.unit}`}
      >
        {sensor.value} <span>{sensor.unit}</span>
      </div>

      <footer className="sensorFooter">
        <span className="muted">
          Last seen: {new Date(sensor.lastSeen).toLocaleTimeString()}
        </span>
      </footer>
    </div>
  );
};

export default SensorCard;
