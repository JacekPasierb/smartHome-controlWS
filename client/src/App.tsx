import {useEffect, useState} from "react";
import "./App.css";
import SensorCard from "./components/SensorCard";
import type {Alert, HomeState} from "./types/home.type";
import {io} from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL as string;
const WS_URL = (import.meta.env.VITE_WS_URL as string) || API_URL;

function App() {
  const [home, setHome] = useState<HomeState | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchHome = async () => {
      const response = await fetch(`${API_URL}/api/home/123/state`);
      const data = await response.json();
      setHome(data);
    };

    fetchHome();
  }, []);

  useEffect(() => {
    const socket = io(WS_URL);
    // subskrypcja na aktualizację stanu domu
    socket.emit("subscribe:home", "123");
    // nasłuchiwanie na aktualizację stanu domu
    socket.on("home:update", (data: HomeState) => {
      setHome(data);
      setAlerts(data.alerts ?? []);
    });
    // nasłuchiwanie na nowe alerty
    socket.on("alert:new", (alert: Alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
    });

    return () => {
      socket.disconnect();
    };
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

          <h2 className="panelTitle">Alerts</h2>
          <div style={{display: "grid", gap: 8}}>
            {alerts.length === 0 ? (
              <div style={{opacity: 0.7}}>Brak alertów</div>
            ) : (
              alerts.map((a) => (
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <div style={{fontWeight: 600}}>
                    {a.severity === "critical"
                      ? "🚨"
                      : a.severity === "warning"
                      ? "⚠️"
                      : "ℹ️"}
                    {""}
                    {a.message}
                  </div>
                  <div style={{fontSize: 12, opacity: 0.7}}>
                    {new Date(a.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
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
            {home.security.alarm.triggered && (
              <div style={{color: "red"}}>🚨 Alarm triggered</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
