import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchHomeSettings, updateHomeSettings} from "../api/settingsApi";
import {
  settingsSchema,
  type SettingsFormValues,
} from "../schemas/settingsSchema";
import {queryKeys} from "../../../lib/queryKeys";
import type {HomeState} from "../../../types/home";
import type {HomeSettings} from "../../../types/settings";
import {useToast} from "../../../components/toast/useToast";
import { SettingsPanelSkeleton } from "./SettingsPanelSkeleton";

type SettingsPanelProps = {
  homeId: string;
};

export function SettingsPanel({homeId}: SettingsPanelProps) {
  const queryClient = useQueryClient();
  const {showToast} = useToast();

  const {
    data: settings,
    isLoading,
    isError,
  } = useQuery<HomeSettings>({
    queryKey: ["homeSettings", homeId],
    queryFn: () => fetchHomeSettings(homeId),
    enabled: Boolean(homeId),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isDirty},
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      sensors: {
        temp_fridge: {
          name: "",
          max: 8,
        },
        temp_balcony: {
          name: "",
        },
        temp_room: {
          name: "",
        },
        humidity_room: {
          name: "",
        },
        power_total: {
          name: "",
        },
      },
      security: {
        doorOpenTooLongSeconds: 10,
      },
    },
  });

  useEffect(() => {
    if (!settings) return;

    reset({
      sensors: {
        temp_fridge: {
          name: settings.sensors.temp_fridge.name,
          max: settings.sensors.temp_fridge.max ?? 8,
        },
        temp_balcony: {
          name: settings.sensors.temp_balcony.name,
        },
        temp_room: {
          name: settings.sensors.temp_room.name,
        },
        humidity_room: {
          name: settings.sensors.humidity_room.name,
        },
        power_total: {
          name: settings.sensors.power_total.name,
        },
      },
      security: {
        doorOpenTooLongSeconds: settings.security.doorOpenTooLongSeconds,
      },
    });
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: (values: SettingsFormValues) =>
      updateHomeSettings(homeId, values),

    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["homeSettings", homeId], updatedSettings);

      queryClient.setQueryData<HomeState>(
        queryKeys.homeState(homeId),
        (prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            sensors: {
              ...prev.sensors,
              temp_fridge: {
                ...prev.sensors.temp_fridge,
                name: updatedSettings.sensors.temp_fridge.name,
              },
              temp_balcony: {
                ...prev.sensors.temp_balcony,
                name: updatedSettings.sensors.temp_balcony.name,
              },
              temp_room: {
                ...prev.sensors.temp_room,
                name: updatedSettings.sensors.temp_room.name,
              },
              humidity_room: {
                ...prev.sensors.humidity_room,
                name: updatedSettings.sensors.humidity_room.name,
              },
              power_total: {
                ...prev.sensors.power_total,
                name: updatedSettings.sensors.power_total.name,
              },
            },
          };
        }
      );

      reset({
        sensors: {
          temp_fridge: {
            name: updatedSettings.sensors.temp_fridge.name,
            max: updatedSettings.sensors.temp_fridge.max ?? 8,
          },
          temp_balcony: {
            name: updatedSettings.sensors.temp_balcony.name,
          },
          temp_room: {
            name: updatedSettings.sensors.temp_room.name,
          },
          humidity_room: {
            name: updatedSettings.sensors.humidity_room.name,
          },
          power_total: {
            name: updatedSettings.sensors.power_total.name,
          },
        },
        security: {
          doorOpenTooLongSeconds:
            updatedSettings.security.doorOpenTooLongSeconds,
        },
      });

      showToast({
        variant: "success",
        title: "Settings saved",
        description: `Configuration for home ${homeId} has been updated.`,
      });
    },

    onError: () => {
      showToast({
        variant: "error",
        title: "Save failed",
        description: "Could not update settings. Please try again.",
      });
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return <SettingsPanelSkeleton />;
  }

  if (isError || !settings) {
    return <div className="card">Error loading settings</div>;
  }

  return (
    <div className="panel">
      <h2 className="panelTitle">Admin Settings</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{display: "grid", gap: 14}}
      >
        <div className="card" style={{display: "grid", gap: 12}}>
          <strong>Sensor names</strong>

          <label style={{display: "grid", gap: 6}}>
            <span>Lodówka</span>
            <input
              className="input"
              {...register("sensors.temp_fridge.name")}
            />
            {errors.sensors?.temp_fridge?.name && (
              <span className="loginError">
                {errors.sensors.temp_fridge.name.message}
              </span>
            )}
          </label>

          <label style={{display: "grid", gap: 6}}>
            <span>Balkon</span>
            <input
              className="input"
              {...register("sensors.temp_balcony.name")}
            />
            {errors.sensors?.temp_balcony?.name && (
              <span className="loginError">
                {errors.sensors.temp_balcony.name.message}
              </span>
            )}
          </label>

          <label style={{display: "grid", gap: 6}}>
            <span>Pokój</span>
            <input className="input" {...register("sensors.temp_room.name")} />
            {errors.sensors?.temp_room?.name && (
              <span className="loginError">
                {errors.sensors.temp_room.name.message}
              </span>
            )}
          </label>

          <label style={{display: "grid", gap: 6}}>
            <span>Wilgotność</span>
            <input
              className="input"
              {...register("sensors.humidity_room.name")}
            />
            {errors.sensors?.humidity_room?.name && (
              <span className="loginError">
                {errors.sensors.humidity_room.name.message}
              </span>
            )}
          </label>

          <label style={{display: "grid", gap: 6}}>
            <span>Pobór mocy</span>
            <input
              className="input"
              {...register("sensors.power_total.name")}
            />
            {errors.sensors?.power_total?.name && (
              <span className="loginError">
                {errors.sensors.power_total.name.message}
              </span>
            )}
          </label>
        </div>

        <div className="card" style={{display: "grid", gap: 12}}>
          <strong>Alert thresholds</strong>

          <label style={{display: "grid", gap: 6}}>
            <span>Maks. temperatura lodówki (°C)</span>
            <input
              className="input"
              type="number"
              {...register("sensors.temp_fridge.max")}
            />
            {errors.sensors?.temp_fridge?.max && (
              <span className="loginError">
                {errors.sensors.temp_fridge.max.message}
              </span>
            )}
          </label>

          <label style={{display: "grid", gap: 6}}>
            <span>Drzwi otwarte dłużej niż (sekundy)</span>
            <input
              className="input"
              type="number"
              {...register("security.doorOpenTooLongSeconds")}
            />
            {errors.security?.doorOpenTooLongSeconds && (
              <span className="loginError">
                {errors.security.doorOpenTooLongSeconds.message}
              </span>
            )}
          </label>
        </div>

        <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
          <button
            className="btn"
            type="submit"
            disabled={mutation.isPending || !isDirty}
          >
            {mutation.isPending ? "Saving..." : "Save settings"}
          </button>
          <button
            className="btn-small"
            type="button"
            onClick={() =>
              settings &&
              reset({
                sensors: {
                  temp_fridge: {
                    name: settings.sensors.temp_fridge.name,
                    max: settings.sensors.temp_fridge.max ?? 8,
                  },
                  temp_balcony: {
                    name: settings.sensors.temp_balcony.name,
                  },
                  temp_room: {
                    name: settings.sensors.temp_room.name,
                  },
                  humidity_room: {
                    name: settings.sensors.humidity_room.name,
                  },
                  power_total: {
                    name: settings.sensors.power_total.name,
                  },
                },
                security: {
                  doorOpenTooLongSeconds:
                    settings.security.doorOpenTooLongSeconds,
                },
              })
            }
            disabled={mutation.isPending || !isDirty}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
