import jwt from "jsonwebtoken";
import type {Role} from "../auth/homeAccess";
import {AUTH_COOKIE_NAME} from "../auth/auth.constants";

export type SocketUser = {
  id: string;
  role: Role;
};

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((part) => part.trim());

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return rest.join("=");
    }
  }

  return undefined;
}

export function verifySocketTokenFromCookie(cookieHeader?: string): SocketUser {
  const token = getCookieValue(cookieHeader, AUTH_COOKIE_NAME);

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
    sub: string;
    role: Role;
  };

  return {
    id: payload.sub,
    role: payload.role,
  };
}
