import {useEffect, useRef, useState} from "react";
import type {QueryClient} from "@tanstack/react-query";
import {io} from "socket.io-client";
import type {Alert, HomeState} from "../types/home.type";

const API_URL = import.meta.env.VITE_API_URL as string;
const WS_URL = (import.meta.env.VITE_WS_URL as string) || API_URL;

export type WsStatus = "connecting" | "online" | "offline";

export function useHomeSocket(homeId: string, queryClient: QueryClient) {
  const [wsStatus, setWsStatus] = useState<WsStatus>("connecting");
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const prevHomeIdRef = useRef(homeId);

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 700,
    });

    socketRef.current = socket;

    const subscribe = (id: string) => socket.emit("subscribe:home", id);

    const onConnect = () => {
      setWsStatus("online");
      subscribe(prevHomeIdRef.current);
    };

    const onDisconnect = () => setWsStatus("offline");

    const onConnectError = () => setWsStatus("offline");

    const onHomeUpdate = (data: HomeState) => {
      queryClient.setQueryData<HomeState>(["homeState", data.homeId], data);
    };

    const onAlert = (payload: {homeId: string; alert: Alert}) => {
      queryClient.setQueryData<HomeState>(
        ["homeState", payload.homeId],
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            alerts: [payload.alert, ...prev.alerts].slice(0, 20),
          };
        }
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("home:update", onHomeUpdate);
    socket.on("alert:new", onAlert);

    const onReconnectAttempt = () => setWsStatus("connecting");

    const onReconnect = () => {
      setWsStatus("online");
      subscribe(prevHomeIdRef.current);
    };

    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.io.on("reconnect", onReconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("home:update", onHomeUpdate);
      socket.off("alert:new", onAlert);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.io.off("reconnect", onReconnect);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ["homeState", homeId]});
    const socket = socketRef.current;
    const prevHomeId = prevHomeIdRef.current;

    if (socket?.connected) {
      if (prevHomeId !== homeId) {
        socket.emit("unsubscribe:home", prevHomeId);
      }
      socket.emit("subscribe:home", homeId);
    }

    prevHomeIdRef.current = homeId;
  }, [homeId, queryClient]);

  return {wsStatus};
}
