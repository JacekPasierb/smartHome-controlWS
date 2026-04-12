export type SensorSettings = {
  name: string;
  min?: number;
  max?: number;
};

export type SecuritySettings = {
  doorOpenTooLongSeconds: number;
};

export type SimulatorSettings = {
  telemetryIntervalMs: number;
  doorToggleIntervalMs: number;
  alarmIntervalMs: number;
};

export type HomeSettings = {
  homeId: string;
  sensors: {
    temp_fridge: SensorSettings;
    temp_balcony: SensorSettings;
    temp_room: SensorSettings;
    humidity_room: SensorSettings;
    power_total: SensorSettings;
  };
  security: SecuritySettings;
  simulator: SimulatorSettings;
};
