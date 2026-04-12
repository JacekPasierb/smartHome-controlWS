import {env} from "../../../lib/env";
import {http} from "../../../lib/http";
import type {HomeState} from "../../../types/home";

export async function fetchHomeState(homeId: string): Promise<HomeState> {
  return http<HomeState>(`${env.apiUrl}/api/home/${homeId}/state`);
}

export async function setAlarm(
  homeId: string,
  armed: boolean
): Promise<HomeState> {
  return http<HomeState>(`${env.apiUrl}/api/home/${homeId}/security/alarm`, {
    method: "PATCH",
    body: JSON.stringify({armed}),
  });
}
