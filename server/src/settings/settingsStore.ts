import type {HomeSettings} from "./settingsTypes";

function createDefaultSettings(homeId: string): HomeSettings {
  return {
    homeId,
    sensors: {
      temp_fridge: {
        name: "Lodówka",
        min: 2,
        max: 8,
      },
      temp_balcony: {
        name: "Balkon",
      },
      temp_room: {
        name: "Pokój",
        min: 18,
        max: 28,
      },
      humidity_room: {
        name: "Wilgotność",
        min: 35,
        max: 65,
      },
      power_total: {
        name: "Pobór mocy",
        max: 900,
      },
    },
    security: {
      doorOpenTooLongSeconds: 10,
    },
    simulator: {
      telemetryIntervalMs: 3000,
      doorToggleIntervalMs: 5000,
      alarmIntervalMs: 8000,
    },
  };
}

const settingsByHome: Record<string, HomeSettings> = {
  "123": createDefaultSettings("123"),
  "456": createDefaultSettings("456"),
};

const defaultSettings = settingsByHome["123"]!;

export function getHomeSettings(homeId: string): HomeSettings {
  return settingsByHome[homeId] ?? defaultSettings;
}

export function updateHomeSettings(
  homeId: string,
  patch: Partial<HomeSettings>
): HomeSettings {
  const current = getHomeSettings(homeId);

  const next: HomeSettings = {
    ...current,
    ...patch,
    sensors: {
      temp_fridge: {
        ...current.sensors.temp_fridge,
        ...(patch.sensors?.temp_fridge ?? {}),
      },
      temp_balcony: {
        ...current.sensors.temp_balcony,
        ...(patch.sensors?.temp_balcony ?? {}),
      },
      temp_room: {
        ...current.sensors.temp_room,
        ...(patch.sensors?.temp_room ?? {}),
      },
      humidity_room: {
        ...current.sensors.humidity_room,
        ...(patch.sensors?.humidity_room ?? {}),
      },
      power_total: {
        ...current.sensors.power_total,
        ...(patch.sensors?.power_total ?? {}),
      },
    },
    security: {
      ...current.security,
      ...(patch.security ?? {}),
    },
    simulator: {
      ...current.simulator,
      ...(patch.simulator ?? {}),
    },
  };

  settingsByHome[homeId] = next;
  return next;
}
