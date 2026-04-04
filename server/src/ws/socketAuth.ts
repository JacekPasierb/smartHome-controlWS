import jwt from "jsonwebtoken";
import { Role } from "../auth/homeAccess";

export type SocketUser = { id: string, role: Role };

export function verifySocketToken(token?: string): SocketUser {
    if (!token) {
        throw new Error("UNAUTHORIZED");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
        sub: string;
        role: Role;
    };
    return { id: payload.sub, role: payload.role };
}