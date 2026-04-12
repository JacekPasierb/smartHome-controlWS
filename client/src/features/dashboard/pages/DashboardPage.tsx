import {useEffect, useMemo, useRef, useState} from "react";
import {useToast} from "../../../components/toast/useToast";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchHomeState, setAlarm} from "../api/homeApi";
import SensorCard from "../components/SensorCard";
import {SecurityCard} from "../components/SecurityCard";
import {AlertsFeed} from "../components/AlertsFeed";
import {useHomeSocket} from "../hooks/useHomeSocket";
import {useAlarmAudio} from "../hooks/useAlarmAudio";
import {authStorage} from "../../auth/storage/authStorage";
import type {HomeState} from "../../../types/home";
import {queryKeys} from "../../../lib/queryKeys";
import {LiveChart} from "../components/LiveChart";
import {SettingsPanel} from "../../settings/components/SettingsPanel";
import { Bell, BellOff, LogOut, Shield, Radio } from "lucide-react";
import { DashboardSkeleton } from "../components/DashboardSkeleton";

const ALL_HOMES = [
  {id: "123", label: "Home A (123)"},
  {id: "456", label: "Home B (456)"},
] as const;

type ChartSensorId = "temp_fridge" | "temp_balcony" | "temp_room";

const getWsStatusText = (status: "connecting" | "online" | "offline") => {
  if (status === "online") return "Realtime: Connected";
  if (status === "connecting") return "Realtime: Connecting...";
  return "Realtime: Disconnected";
};

function DashboardPage() {
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  const lastAlertIdRef = useRef<string | null>(null);
  const user = authStorage.getUser();

  
  const availableHomes = useMemo(() => {
    if (!user) return [];
    return ALL_HOMES.filter((home) => user.homes.includes(home.id));
  }, [user]);

  const [selectedHomeId, setSelectedHomeId] = useState<string>("");
  const [chartSensorId, setChartSensorId] =
    useState<ChartSensorId>("temp_fridge");

  const homeId = useMemo(() => {
    if (!availableHomes.length) return "";

    const hasAccess = availableHomes.some((home) => home.id === selectedHomeId);

    if (hasAccess) {
      return selectedHomeId;
    }

    return availableHomes[0].id;
  }, [availableHomes, selectedHomeId]);

  const {wsStatus} = useHomeSocket(homeId, queryClient);

  const {
    data: home,
    isLoading,
    isError,
  } = useQuery<HomeState>({
    queryKey: queryKeys.homeState(homeId),
    queryFn: () => fetchHomeState(homeId),
    enabled: Boolean(user && homeId),
  });

  const triggered = Boolean(home?.security.alarm.triggered);
  const {soundEnabled, toggleSound, playTest} = useAlarmAudio(triggered);

  const alarmMutation = useMutation({
    mutationFn: (armed: boolean) => setAlarm(homeId, armed),

    onMutate: async (armed) => {
      await queryClient.cancelQueries({queryKey: queryKeys.homeState(homeId)});

      const prev = queryClient.getQueryData<HomeState>(
        queryKeys.homeState(homeId)
      );

      if (prev) {
        queryClient.setQueryData<HomeState>(queryKeys.homeState(homeId), {
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

    onError: (_error, _armed, context) => {
      if (context?.prev) {
        queryClient.setQueryData<HomeState>(
          queryKeys.homeState(homeId),
          context.prev
        );
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData<HomeState>(queryKeys.homeState(homeId), data);
    },
  });

  const handleLogout = () => {
    authStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const latestAlert = home?.alerts[0];

    if (!latestAlert) return;

    if (lastAlertIdRef.current === latestAlert.id) return;

    if (lastAlertIdRef.current !== null) {
      showToast({
        variant:
          latestAlert.severity === "critical"
            ? "error"
            : latestAlert.severity === "warning"
            ? "warning"
            : "info",
        title: latestAlert.type,
        description: latestAlert.message,
      });
    }

    lastAlertIdRef.current = latestAlert.id;
  }, [home?.alerts, showToast]);

  if (!user) {
    return <div style={{padding: 24}}>Missing user session</div>;
  }

  if (!availableHomes.length) {
    return <div style={{padding: 24}}>No homes assigned to this account</div>;
  }

 if (isLoading) {
   return <DashboardSkeleton />;
 }

  if (isError || !home) {
    return <div style={{padding: 24}}>Error loading data</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">SmartHome Control Center</h1>
          <p className="sub">
            Realtime IoT Dashboard • WebSocket • React Query
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-small btnIcon"
            onClick={toggleSound}
            title="Enable sound alerts"
          >
            {soundEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            <span>{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
          </button>

          <button
            className="btn-small"
            onClick={playTest}
            disabled={!soundEnabled}
            title="Play test alarm sound"
          >
            🔊 Test Alarm
          </button>

          <select
            className="select"
            value={homeId}
            onChange={(e) => setSelectedHomeId(e.target.value)}
            title="Choose home"
          >
            {availableHomes.map((homeOption) => (
              <option key={homeOption.id} value={homeOption.id}>
                {homeOption.label}
              </option>
            ))}
          </select>

          <button className="btn-small btnIcon" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          <div className={`badge realtimeBadge realtime-${wsStatus}`}>
            <Radio size={15} />
            <span>{getWsStatusText(wsStatus)}</span>
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
                    ? "Alarm already armed"
                    : "Arm Alarm"
                }
              >
                <>
                  <Shield size={16} />
                  <span>Arm</span>
                </>
              </button>

              <button
                className="btn"
                onClick={() => alarmMutation.mutate(false)}
                disabled={alarmMutation.isPending || !home.security.alarm.armed}
                title={
                  !home.security.alarm.armed
                    ? "Alarm already disarmed"
                    : "Disarm alarm"
                }
              >
                <>
                  <Shield size={16} />
                  <span>Disarm</span>
                </>
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
          {user.role === "admin" && <SettingsPanel homeId={homeId} />}
          <div className="panel">
            <h2 className="panelTitle">Alerts</h2>
            <AlertsFeed alerts={home.alerts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
