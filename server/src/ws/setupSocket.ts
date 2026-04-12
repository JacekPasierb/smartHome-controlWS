import type {Server, Socket} from "socket.io";
import {canAccessHome} from "../auth/homeAccess";
import {SocketUser, verifySocketToken} from "./socketAuth";

type AuthedSocket = Socket & {user?: SocketUser};

export function setupSocket(
  io: Server,
  opts?: {
    onSubscribe?: (socket: AuthedSocket, homeId: string) => void;
    onUnsubscribe?: (socket: AuthedSocket, homeId: string) => void;
  }
) {
  io.use((socket: AuthedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      socket.user = verifySocketToken(token);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: AuthedSocket) => {
    socket.on("subscribe:home", (homeId: string) => {
      if (!socket.user || !canAccessHome(socket.user, String(homeId))) {
        socket.emit("error: forbidden", {homeId});
        return;
      }
      socket.join(`home:${homeId}`);
      opts?.onSubscribe?.(socket, homeId);
      socket.emit("subscribed:home", {homeId});
    });

    socket.on("unsubscribe:home", (homeId: string) => {
      socket.leave(`home:${homeId}`);
      opts?.onUnsubscribe?.(socket, homeId);
      socket.emit("unsubscribed:home", {homeId});
    });
  });
}
