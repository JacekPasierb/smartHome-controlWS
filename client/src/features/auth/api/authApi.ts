import {env} from "../../../lib/env";
import {http} from "../../../lib/http";
import type {LoginRequest, LoginResponse, MeResponse} from "../../../types/auth";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return http<LoginResponse>(`${env.apiUrl}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe(): Promise<MeResponse> {
  return http<MeResponse>(`${env.apiUrl}/api/auth/me`);
}

export async function logout(): Promise<{success: true}> {
  return http<{success: true}>(`${env.apiUrl}/api/auth/logout`, {
    method: "POST",
  });
}