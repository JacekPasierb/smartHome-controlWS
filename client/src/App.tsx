import {useEffect, useState} from "react";
import "./App.css";
import SensorCard from "./components/SensorCard";
import type {HomeState} from "./types/home.type";

const API_URL = import.meta.env.VITE_API_URL as string;
function App() {
  const [home, setHome] = useState<HomeState | null>(null);

  useEffect(() => {
    const fetchHome = async () => {
      const response = await fetch(`${API_URL}/api/home/123/state`);

      const data = await response.json();

      setHome(data);
    };

    fetchHome();
  }, []);

  if (!home) return <div>Loading...</div>;
  return (
    <div className="container">
      <div className="header">
        <h1 className="h1">SmartHome Control Center</h1>
        <p className="sub">Realtime IoT Dashboard • WebSocket • React Query</p>
      </div>

      <div className="grid">
        <div className="panel">
          <h2 className="panelTitle">Sensors</h2>
          <div className="cardsGrid">
            {Object.entries(home.sensors).map(([id, sensor]) => (
              <SensorCard key={id} sensor={sensor} />
            ))}
          </div>
          <h2 className="panelTitle">Security</h2>
          <div style={{border: "1px solid #ddd", padding: 12, borderRadius: 8}}>
            <div>
              <strong>{home.security.door_main.name}</strong>
            </div>
            <div>
              {home.security.door_main.state === "open"
                ? "🚪 Open"
                : "🔒 Closed"}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <strong>Alarm</strong>
            <div>{home.security.alarm.armed ? "⚱️ Armed" : "🔴 Disarmed"}</div>
            {home.security.alarm.triggered && <div style={{color:"red"}}>🚨 Alarm triggered</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
