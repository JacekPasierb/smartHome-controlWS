import "./App.css";
import SensorCard from "./components/SensorCard";

function App() {
  const sensors = [
    {
      id: 1,
      name: "Lodówka",
      value: 6,
      unit: "°C",
      lastSeen: new Date(),
      online: true,
    },
    {
      id: 2,
      name: "Balkon",
      value: 20,
      unit: "°C",
      lastSeen: new Date(),
      online: true,
    },
    {
      id: 3,
      name: "Pokój",
      value: 21.3,
      unit: "°C",
      lastSeen: new Date(),
      online: true,
    },
    {
      id: 4,
      name: "Wilgotność",
      value: 45,
      unit: "%",
      lastSeen: new Date(),
      online: true,
    },
    {
      id: 5,
      name: "Pobór mocy",
      value: 374.8,
      unit: "W",
      lastSeen: new Date(),
      online: true,
    },
  ];
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
            {sensors.map((sensor) => (
              <SensorCard sensor={sensor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
