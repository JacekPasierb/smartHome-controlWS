import { env } from "../../../lib/env";
import {http} from "../../../lib/http";
import type {LoginRequest, LoginResponse} from "../../../types/auth";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return http<LoginResponse>(`${env.apiUrl}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
