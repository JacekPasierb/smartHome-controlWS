export type Sensor = {
  name: string;
  value: number;
  unit: string;
  online: boolean;
  lastSeen: number;
};

export type SensorKey =
  | "temp_fridge"
  | "temp_balcony"
  | "temp_room"
  | "humidity_room"
  | "power_total";

export type Sensors = Record<SensorKey, Sensor>;

export type Door = {
  name: string;
  state: "open" | "closed";
  online: boolean;
  lastSeen: number;
};

export type Alarm = {
  armed: boolean;
  triggered: boolean;
};

export type Alert = {
  id: string;
  type: "TEMP_FRIDGE_HIGH" | "DOOR_OPEN_TOO_LONG";
  message: string;
  severity: "info" | "warning" | "critical";
  createdAt: number;
};

export type HomeState = {
  homeId: string;
  updatedAt: number;
  sensors: Sensors;
  security: {
    door_main: Door;
    alarm: Alarm;
  };
  alerts: Alert[];
};
