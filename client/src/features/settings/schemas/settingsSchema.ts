import {z} from "zod";

export const settingsSchema = z.object({
  sensors: z.object({
    temp_fridge: z.object({
      name: z.string().min(1, "Nazwa lodówki jest wymagana"),
      max: z.coerce.number().min(-50).max(100),
    }),
    temp_balcony: z.object({
      name: z.string().min(1, "Nazwa balkonu jest wymagana"),
    }),
    temp_room: z.object({
      name: z.string().min(1, "Nazwa pokoju jest wymagana"),
    }),
    humidity_room: z.object({
      name: z.string().min(1, "Nazwa wilgotności jest wymagana"),
    }),
    power_total: z.object({
      name: z.string().min(1, "Nazwa poboru mocy jest wymagana"),
    }),
  }),
  security: z.object({
    doorOpenTooLongSeconds: z.coerce.number().min(1).max(600),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
