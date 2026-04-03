type Sensor = {
  name: string;
  value: number;
  unit: string;
  online: boolean;
  lastSeen: number;
};

type SensorKey =
  | "temp_fridge"
  | "temp_balcony"
  | "temp_room"
  | "humidity_room"
  | "power_total";

type Sensors = Record<SensorKey, Sensor>;

type Door = {
  name: string;
  state: "open" | "closed";
  online: boolean;
  lastSeen: number;
};

type Alarm = {
  armed: boolean;
  triggered: boolean;
};

type HomeState = {
  homeId: string;
  updatedAt: number;
  sensors: Sensors;
  security: {
    door_main: Door;
    alarm: Alarm;
  };
  alerts: Alert[];
};

export type Alert = {
  id: string;
  type: "TEMP_FRIDGE_HIGH" | "DOOR_OPEN_TOO_LONG";
  message: string;
  severity: "info" | "warning" | "critical";
  createdAt: number;
};

const now = () => Date.now();

function createHomeState(homeId: string): HomeState {
  const ts = now();
  return {
    homeId,
    updatedAt: ts,
    sensors: {
      temp_fridge: {
        name: "Lodówka",
        value: 4.2,
        unit: "°C",
        online: true,
        lastSeen: ts,
      },
      temp_balcony: {
        name: "Balkon",
        value: 18.5,
        unit: "°C",
        online: true,
        lastSeen: ts,
      },
      temp_room: {
        name: "Pokój",
        value: 21.2,
        unit: "°C",
        online: true,
        lastSeen: ts,
      },
      humidity_room: {
        name: "Wilgotność",
        value: 45.3,
        unit: "%",
        online: true,
        lastSeen: ts,
      },
      power_total: {
        name: "Pobór mocy",
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
      alarm: {armed: false, triggered: false},
    },
    alerts: [],
  };
}
// dwa domy na start
const homes: Record<string, HomeState> = {
  "123": createHomeState("123"),
  "456": createHomeState("456"),
};

const defaultHomeState = homes["123"]!;

export const getHomeState = (homeId: string): HomeState => {
  return homes[homeId] ?? defaultHomeState;
};

export function setAlarmArmed(homeId: string, armed: boolean) {
  const home = homes[homeId] ?? defaultHomeState;
  home.security.alarm.armed = armed;
  if (!armed) home.security.alarm.triggered = false;
  home.updatedAt = now();
  return home;
}

// helper function to generate random number between min and max
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
// helper function to generate unique id
function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

// helper function to push alert to home state and limit to 20 alerts
function pushAlert(home:HomeState,alert: Alert) {
  home.alerts.unshift(alert);
  home.alerts = home.alerts.slice(0, 20);
}

// helper function to update home state and call onUpdate callback
function updated(home:HomeState,onUpdate?: (homeId: string) => void) {
  home.updatedAt = now();
  onUpdate?.(home.homeId);
}

const doorOpenedAt: Record<string, number | null> = {};

export function startSimulator(
  onUpdate?: (homeId: string) => void,
  onAlert?: (homeId: string, alert: Alert) => void
) {
  setInterval(() => {
    Object.values(homes).forEach((home) => {
      const t = home.sensors;
      t.temp_fridge.value = Number(rand(2, 10).toFixed(1));
      t.temp_fridge.lastSeen = now();
      // temperatura lodówki za ciepła
      if (home.sensors.temp_fridge.value > 8) {
        const alert: Alert = {
          id: uid(),
          type: "TEMP_FRIDGE_HIGH",
          message: `Temperatura lodówki za ciepła: ${home.sensors.temp_fridge.value}°C`,
          severity: "warning",
          createdAt: now(),
        };
        pushAlert(home,alert);
        onAlert?.(home.homeId, alert);
      }

      t.temp_balcony.value = Number(rand(2, 8).toFixed(1));
      t.temp_balcony.lastSeen = now();

      t.temp_room.value = Number(rand(2, 8).toFixed(1));
      t.temp_room.lastSeen = now();

      t.humidity_room.value = Number(rand(40, 60).toFixed(1));
      t.humidity_room.lastSeen = now();

      t.power_total.value = Number(rand(0, 1000).toFixed(1));
      t.power_total.lastSeen = now();

      // wywołanie callback kiedy stan domu się zmienia (wysyłanie snapshotu do klienta)
      updated(home,onUpdate);
    });
  }, 3000);

  // drzwi czasem się otwierają i zamykają
  setInterval(() => {
    Object.values(homes).forEach((home) => {
      const door = home.security.door_main;
      if (Math.random() < 0.3) {
        door.state = door.state === "open" ? "closed" : "open";
        door.lastSeen = now();
        if (door.state === "open") {
          doorOpenedAt[home.homeId] = now();
        } else {
          doorOpenedAt[home.homeId] = null;
        }
      
        // wywołanie callback kiedy stan domu się zmienia (wysyłanie snapshotu do klienta)
        updated(home,onUpdate);
      }
    });
  }, 5000);

  // sprawdzenie czy drzwi są otwarte zbyt długo i wygenerowanie alertu
  setInterval(() => {
    Object.values(homes).forEach((home) => {
      const door = home.security.door_main;

      if (door.state === "open") {
        const openedAt = doorOpenedAt[home.homeId];
        if (!openedAt) {
          doorOpenedAt[home.homeId] = now();
          return
        }

        const secondsOpen = (now() - openedAt) / 1000;
        if (secondsOpen > 10) {
          const alert: Alert = {
            id: uid(),
            type: "DOOR_OPEN_TOO_LONG",
            message: `Drzwi otwarte zbyt długo: ${Math.floor(secondsOpen)} s`,
            severity: "critical",
            createdAt: now(),
          };
          pushAlert(home,alert);
          onAlert?.(home.homeId, alert);

          doorOpenedAt[home.homeId] = now();
        }
      } else {
        doorOpenedAt[home.homeId] = null;
      }
    });
  }, 1000);

  // alarm czasem uzbrojenie i rozbrojenie
  setInterval(() => {
    Object.values(homes).forEach((home) => {
      const alarm = home.security.alarm;
      const door = home.security.door_main;

      if (Math.random() < 0.35) {
        alarm.armed = !alarm.armed;

        if (!alarm.armed) alarm.triggered = false;
      }
      // jeśli alarm uzbrojony i drzwi open => czasem triggeer
      if (alarm.armed && door.state === "open" && Math.random() < 0.5) {
        alarm.triggered = true;
      }

      home.updatedAt = now();
      onUpdate?.(home.homeId);
    });
  }, 8000);
}
