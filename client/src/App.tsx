import "./App.css";
import SensorCard from "./components/SensorCard";
import { sensors } from "./data";

function App() {
 
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
