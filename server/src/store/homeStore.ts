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
  alerts: any[];
};

const now = () => Date.now();

let homeState: HomeState = {
  homeId: "123",
  updatedAt: now(),
  sensors: {
    temp_fridge: {
      name: "Lodówka",
      value: 6,
      unit: "°C",
      online: true,
      lastSeen: now(),
    },
    temp_balcony: {
      name: "Balkon",
      value: 20,
      unit: "°C",
      online: true,
      lastSeen: now(),
    },
    temp_room: {
      name: "Pokój",
      value: 21.3,
      unit: "°C",
      online: true,
      lastSeen: now(),
    },
    humidity_room: {
      name: "Wilgotność",
      value: 45,
      unit: "%",
      online: true,
      lastSeen: now(),
    },
    power_total: {
      name: "Pobór mocy",
      value: 374.8,
      unit: "W",
      online: true,
      lastSeen: now(),
    },
  },
  security: {
    door_main: {
      name: "Drzwi wejściowe",
      state: "closed",
      online: true,
      lastSeen: now(),
    },
    alarm: {
      armed: false,
      triggered: false,
    },
  },
  alerts: [],
};

export const getHomeState = (homeId: string): HomeState => {
  return homeState;
};

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function updated(onUpdate?: (homeId: string) => void) {
  homeState.updatedAt = now();
  onUpdate?.(homeState.homeId);
}

export function startSimulator(onUpdate?: (homeId: string) => void) {
  setInterval(() => {
    const t = homeState.sensors;
    t.temp_fridge.value = Number(rand(2, 8).toFixed(1));
    t.temp_fridge.lastSeen = now();

    t.temp_balcony.value = Number(rand(2, 8).toFixed(1));
    t.temp_balcony.lastSeen = now();

    t.temp_room.value = Number(rand(2, 8).toFixed(1));
    t.temp_room.lastSeen = now();

    t.humidity_room.value = Number(rand(40, 60).toFixed(1));
    t.humidity_room.lastSeen = now();

    t.power_total.value = Number(rand(0, 1000).toFixed(1));
    t.power_total.lastSeen = now();

      // wywołanie callback kiedy stan domu się zmienia (wysyłanie snapshotu do klienta)
    updated(onUpdate);
  }, 3000);

  // drzwi czasem się otwierają i zamykają
  setInterval(() => {
    const door = homeState.security.door_main;
    if (Math.random() < 0.3) {
      door.state = door.state === "open" ? "closed" : "open";

        door.lastSeen = now();
        // wywołanie callback kiedy stan domu się zmienia (wysyłanie snapshotu do klienta)
      updated(onUpdate);
    }
  }, 5000);

  // alarm czasem uzbrojenie i rozbrojenie
  setInterval(() => {
    const alarm = homeState.security.alarm;
    if (Math.random() < 0.15) {
      alarm.armed = !alarm.armed;
        if (alarm.armed) alarm.triggered = false;
        // wywołanie callback kiedy stan domu się zmienia (wysyłanie snapshotu do klienta)
      updated(onUpdate);
    }
  }, 8000);
}
