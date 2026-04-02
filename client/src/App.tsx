import {useEffect} from "react";
import "./App.css";
import SensorCard from "./components/SensorCard";
import type {Alert, HomeState} from "./types/home.type";
import {io} from "socket.io-client";
import {SecurityCard} from "./components/SecurityCard";
import {AlertsFeed} from "./components/AlertsFeed";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchHomeState} from "./api/homeApi";

const API_URL = import.meta.env.VITE_API_URL as string;
const WS_URL = (import.meta.env.VITE_WS_URL as string) || API_URL;

function App() {
  const queryClient = useQueryClient();

  const homeId = "123";

  const {
    data: home,
    isLoading,
    isError,
  } = useQuery<HomeState>({
    queryKey: ["homeState", homeId],
    queryFn: () => fetchHomeState(homeId),
  });

  useEffect(() => {
    const socket = io(WS_URL);
    // subskrypcja na aktualizację stanu domu
    socket.emit("subscribe:home", homeId);
    // nasłuchiwanie na aktualizację stanu domu
    socket.on("home:update", (data: HomeState) => {
      queryClient.setQueryData<HomeState>(["homeState", homeId], data);
    });
    // nasłuchiwanie na nowe alerty
    socket.on("alert:new", (alert: Alert) => {
      queryClient.setQueryData<HomeState>(["homeState", homeId], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          alerts: [alert, ...prev.alerts].slice(0, 20),
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, homeId]);

  if (isLoading) return <div style={{padding: 24}}>Loading...</div>;
  if (isError || !home)
    return <div style={{padding: 24}}>Error loading data</div>;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">SmartHome Control Center</h1>
          <p className="sub">
            Realtime IoT Dashboard • WebSocket • React Query
          </p>
        </div>
      </div>
      {home.security.alarm.triggered ? (
        <div className="alarm-banner">
          🚨 Alarm triggered! Check door sensors and security status.
        </div>
      ) : <div className="alarm-banner-ok">Brak zagrożeń krytycznych</div>}
      <div className="grid">
        <div className="panel">
          <h2 className="panelTitle">Sensors</h2>
          <div className="cardsGrid">
            {Object.entries(home.sensors).map(([id, sensor]) => (
              <SensorCard key={id} sensor={sensor} />
            ))}
          </div>
        </div>
        <div style={{display: "grid", gap: 16}}>
          <div className="panel">
            <h2 className="panelTitle">Security</h2>
            <SecurityCard
              door={home.security.door_main}
              alarm={home.security.alarm}
            />
          </div>
          <div className="panel">
            <h2 className="panelTitle">Alerts</h2>
            <AlertsFeed alerts={home.alerts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
