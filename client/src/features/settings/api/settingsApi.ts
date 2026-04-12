import {env} from "../../../lib/env";
import {http} from "../../../lib/http";
import type {HomeSettings} from "../../../types/settings";

export async function fetchHomeSettings(homeId: string): Promise<HomeSettings> {
  return http<HomeSettings>(`${env.apiUrl}/api/home/${homeId}/settings`);
}

export async function updateHomeSettings(
  homeId: string,
  payload: Partial<HomeSettings>
): Promise<HomeSettings> {
  return http<HomeSettings>(`${env.apiUrl}/api/home/${homeId}/settings`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
