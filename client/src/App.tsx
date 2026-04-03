import {useEffect, useRef, useState} from "react";
import "./App.css";
import SensorCard from "./components/SensorCard";
import type {HomeState} from "./types/home.type";
import {SecurityCard} from "./components/SecurityCard";
import {AlertsFeed} from "./components/AlertsFeed";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchHomeState, setAlarm} from "./api/homeApi";
import {LiveChart} from "./components/LiveCharts";
import {useHomeSocket} from "./hooks/useHomeSocket";

const HOMES = [
  {id: "123", label: "Home A (123)"},
  {id: "456", label: "Home B (456)"},
] as const;

type HomeId = (typeof HOMES)[number]["id"];
type ChartSensorId = "temp_fridge" | "temp_balcony" | "temp_room";

function App() {
  const queryClient = useQueryClient();

  const [homeId, setHomeId] = useState<HomeId>("123");
  const [chartSensorId, setChartSensorId] =
    useState<ChartSensorId>("temp_fridge");

  const { wsStatus } = useHomeSocket(homeId, queryClient);
  const wsStatusColor = wsStatus === "online" ? "green" : wsStatus === "connecting" ? "gold" : "red";
  const wsStatusText = wsStatus === "online" ? "Realtime: Connected" : wsStatus === "connecting" ? "Realtime: Connecting..." : "Realtime:Disconnected";
  
  

  // audio
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevTriggeredRef = useRef<boolean>(false);

  const {
    data: home,
    isLoading,
    isError,
  } = useQuery<HomeState>({
    queryKey: ["homeState", homeId],
    queryFn: () => fetchHomeState(homeId),
  });

  // init audio once
  useEffect(() => {
    audioRef.current = new Audio("/alarm.wav");
    audioRef.current.loop = false;
    audioRef.current.volume = 0.6;
  }, []);

  // play sound only on false => true
  useEffect(() => {
    if (!home) return;
    const triggered = home.security.alarm.triggered;
    const wasTriggered = prevTriggeredRef.current;

    if (soundEnabled && !wasTriggered && triggered) {
      audioRef.current?.play().catch(() => {});
    }
    prevTriggeredRef.current = triggered;
  }, [home, soundEnabled]);

  const alarmMutation = useMutation({
    mutationFn: (armed: boolean) => setAlarm(homeId, armed),

    onMutate: async (armed) => {
      await queryClient.cancelQueries({queryKey: ["homeState", homeId]});
      const prev = queryClient.getQueryData<HomeState>(["homeState", homeId]);

      if (prev) {
        queryClient.setQueryData<HomeState>(["homeState", homeId], {
          ...prev,
          security: {
            ...prev.security,
            alarm: {
              ...prev.security.alarm,
              armed,
              triggered: armed ? prev.security.alarm.triggered : false,
            },
          },
        });
      }
      return {prev};
    },
    onError: (_error, _armed, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData<HomeState>(["homeState", homeId], ctx.prev);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<HomeState>(["homeState", homeId], data);
    },
  });

  if (isLoading) return <div style={{padding: 24}}>Loading...</div>;
  if (isError || !home)
    return <div style={{padding: 24}}>Error loading data</div>;

  return (
    <div className="container">
      <div className="header" >
        <div>
          <h1 className="h1">SmartHome Control Center</h1>

          <p className="sub">
            Realtime IoT Dashboard • WebSocket • React Query
          </p>
        </div>
        

        <div style={{display: "flex", gap: 10, alignItems: "center"}}>
          <button
            className="btn-small"
            onClick={() => setSoundEnabled((v) => !v)}
            title="Enable sound alerts"
          >
            {soundEnabled ? "🔔 Sound ON" : "🔕 Sound OFF"}
          </button>

          <button
            className="btn-small"
            onClick={() => audioRef.current?.play()}
            disabled={!soundEnabled}
            title="Play test alarm sound"
          >
            🔊 Test Alarm
          </button>
          <select
            className="select"
            value={homeId}
            onChange={(e) => setHomeId(e.target.value as HomeId)}
            title="Choose home"
          >
            {HOMES.map((home) => (
              <option key={home.id} value={home.id}>
                {home.label}
              </option>
            ))}
          </select>
          <div className="badge">
            <span
              className={`dot-${
                wsStatus === "online"
                  ? "dot-online"
                  : wsStatus === "connecting"
                  ? "dot-connecting"
                  : "dot-offline"
              }`}
            />
            {wsStatusColor === "green" ? "🟢" : wsStatusColor === "gold" ? "🟡" : "🔴"} {wsStatusText}
          </div>
        </div>
      </div>
      {home.security.alarm.triggered ? (
        <div className="alarm-banner">
          🚨 Alarm triggered! Check door sensors and security status.
        </div>
      ) : (
        <div className="alarm-banner-ok">Brak zagrożeń krytycznych</div>
      )}
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
            <h2 className="panelTitle">Live Chart</h2>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn"
                onClick={() => setChartSensorId("temp_fridge")}
              >
                Lodówka
              </button>
              <button
                className="btn"
                onClick={() => setChartSensorId("temp_balcony")}
              >
                Balkon
              </button>
              <button
                className="btn"
                onClick={() => setChartSensorId("temp_room")}
              >
                Pokój
              </button>
            </div>
            <LiveChart
              title={`Temperature • ${home.sensors[chartSensorId].name}`}
              value={home.sensors[chartSensorId].value}
            />
          </div>
          <div className="panel">
            <h2 className="panelTitle">Security</h2>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn"
                onClick={() => alarmMutation.mutate(true)}
                disabled={alarmMutation.isPending || home.security.alarm.armed}
                title={
                  home.security.alarm.armed
                    ? " Alarm already armed"
                    : "Arm Alarm"
                }
              >
                ⚱️ Arm
              </button>
              <button
                className="btn"
                onClick={() => alarmMutation.mutate(false)}
                disabled={alarmMutation.isPending || !home.security.alarm.armed}
                title={
                  !home.security.alarm.armed
                    ? " Alarm already disarmed"
                    : "Disarm alarm"
                }
              >
                🔴 Disarm
              </button>
              {alarmMutation.isPending && (
                <span className="muted">⏳ Saving...</span>
              )}
            </div>
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
