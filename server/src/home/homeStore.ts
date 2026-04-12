import type {Alert, HomeState} from "./homeTypes";
import {getHomeSettings} from "../settings/settingsStore";

const now = () => Date.now();

function createHomeState(homeId: string): HomeState {
  const settings = getHomeSettings(homeId);
  const ts = now();

  return {
    homeId,
    updatedAt: ts,
    sensors: {
      temp_fridge: {
        name: settings.sensors.temp_fridge.name,
        value: 4.2,
        unit: "°C",
        online: true,
        lastSeen: ts,
      },
      temp_balcony: {
        name: settings.sensors.temp_balcony.name,
        value: 18.5,
        unit: "°C",
        online: true,
        lastSeen: ts,
      },
      temp_room: {
        name: settings.sensors.temp_room.name,
        value: 21.2,
        unit: "°C",
        online: true,
        lastSeen: ts,
      },
      humidity_room: {
        name: settings.sensors.humidity_room.name,
        value: 45.3,
        unit: "%",
        online: true,
        lastSeen: ts,
      },
      power_total: {
        name: settings.sensors.power_total.name,
        value: 320,
        unit: "W",
        online: true,
        lastSeen: ts,
      },
    },
    security: {
      door_main: {
        name: "Drzwi wejściowe",
        state: "closed",
        online: true,
        lastSeen: ts,
      },
      alarm: {
        armed: false,
        triggered: false,
      },
    },
    alerts: [],
  };
}

const homes: Record<string, HomeState> = {
  "123": createHomeState("123"),
  "456": createHomeState("456"),
};

const defaultHomeState = homes["123"]!;

export function getHomeState(homeId: string): HomeState {
  return homes[homeId] ?? defaultHomeState;
}

export function getAllHomes(): Record<string, HomeState> {
  return homes;
}

export function setAlarmArmed(homeId: string, armed: boolean): HomeState {
  const home = homes[homeId] ?? defaultHomeState;

  home.security.alarm.armed = armed;

  if (!armed) {
    home.security.alarm.triggered = false;
  }

  home.updatedAt = now();

  return home;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function uid(): string {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function pushAlert(home: HomeState, alert: Alert) {
  home.alerts.unshift(alert);
  home.alerts = home.alerts.slice(0, 20);
}

function markUpdated(home: HomeState, onUpdate?: (homeId: string) => void) {
  home.updatedAt = now();
  onUpdate?.(home.homeId);
}

function syncSensorNamesWithSettings(home: HomeState) {
  const settings = getHomeSettings(home.homeId);

  home.sensors.temp_fridge.name = settings.sensors.temp_fridge.name;
  home.sensors.temp_balcony.name = settings.sensors.temp_balcony.name;
  home.sensors.temp_room.name = settings.sensors.temp_room.name;
  home.sensors.humidity_room.name = settings.sensors.humidity_room.name;
  home.sensors.power_total.name = settings.sensors.power_total.name;
}

const doorOpenedAt: Record<string, number | null> = {};

export function startSimulator(
  onUpdate?: (homeId: string) => void,
  onAlert?: (homeId: string, alert: Alert) => void
) {
  setInterval(() => {
    Object.values(homes).forEach((home) => {
      syncSensorNamesWithSettings(home);
      const settings = getHomeSettings(home.homeId);
      const sensors = home.sensors;
     

      sensors.temp_fridge.value = Number(rand(2, 10).toFixed(1));
      sensors.temp_fridge.lastSeen = now();

      
      const fridgeMax = settings.sensors.temp_fridge.max;
      if (
        typeof fridgeMax === "number" &&
        sensors.temp_fridge.value > fridgeMax
      ) {
        const alert: Alert = {
          id: uid(),
          type: "TEMP_FRIDGE_HIGH",
          message: `Temperatura lodówki za ciepła: ${sensors.temp_fridge.value}°C`,
          severity: "warning",
          createdAt: now(),
        };

        pushAlert(home, alert);
        onAlert?.(home.homeId, alert);
      }

      sensors.temp_balcony.value = Number(rand(2, 8).toFixed(1));
      sensors.temp_balcony.lastSeen = now();

      sensors.temp_room.value = Number(rand(2, 8).toFixed(1));
      sensors.temp_room.lastSeen = now();

      sensors.humidity_room.value = Number(rand(40, 60).toFixed(1));
      sensors.humidity_room.lastSeen = now();

      sensors.power_total.value = Number(rand(0, 1000).toFixed(1));
      sensors.power_total.lastSeen = now();

      markUpdated(home, onUpdate);
    });
  }, 3000);

  setInterval(() => {
    Object.values(homes).forEach((home) => {
      syncSensorNamesWithSettings(home);
      const door = home.security.door_main;

      if (Math.random() < 0.3) {
        door.state = door.state === "open" ? "closed" : "open";
        door.lastSeen = now();

        if (door.state === "open") {
          doorOpenedAt[home.homeId] = now();
        } else {
          doorOpenedAt[home.homeId] = null;
        }

        markUpdated(home, onUpdate);
      }
    });
  }, 5000);

  setInterval(() => {
    Object.values(homes).forEach((home) => {
      syncSensorNamesWithSettings(home);
      const door = home.security.door_main;

      if (door.state === "open") {
        const openedAt = doorOpenedAt[home.homeId];

        if (!openedAt) {
          doorOpenedAt[home.homeId] = now();
          return;
        }

        const secondsOpen = (now() - openedAt) / 1000;

        const settings = getHomeSettings(home.homeId);
        const maxDoorOpenSeconds = settings.security.doorOpenTooLongSeconds;

        if (secondsOpen > maxDoorOpenSeconds) {
          const alert: Alert = {
            id: uid(),
            type: "DOOR_OPEN_TOO_LONG",
            message: `Drzwi otwarte zbyt długo: ${Math.floor(secondsOpen)} s`,
            severity: "critical",
            createdAt: now(),
          };

          pushAlert(home, alert);
          onAlert?.(home.homeId, alert);
          doorOpenedAt[home.homeId] = now();
        }
      } else {
        doorOpenedAt[home.homeId] = null;
      }
    });
  }, 1000);

  setInterval(() => {
    Object.values(homes).forEach((home) => {
      syncSensorNamesWithSettings(home);
      const alarm = home.security.alarm;
      const door = home.security.door_main;

      if (Math.random() < 0.35) {
        alarm.armed = !alarm.armed;

        if (!alarm.armed) {
          alarm.triggered = false;
        }
      }

      if (alarm.armed && door.state === "open" && Math.random() < 0.5) {
        alarm.triggered = true;
      }

      home.updatedAt = now();
      onUpdate?.(home.homeId);
    });
  }, 8000);
}
