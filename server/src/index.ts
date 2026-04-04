import http from "http";
import app from "./app";
import {getHomeState, startSimulator} from "./store/homeStore";
import {Server} from "socket.io";
import {setupSocket} from "./ws/setupSocket";
import jwt from "jsonwebtoken";
import type {Role} from "./auth/homeAccess";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});
// setupSocket(io);
// io.use mamy tez w ws/setupSocket.ts - do rozwiązania duplikat kodu
io.use((socket, next) => {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) return next(new Error("Unauthorized"));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
      role: Role;
    };
    (socket as any).user = {id: payload.sub, role: payload.role};
    return next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.on("subscribe:home", (homeId: string) => {
    socket.join(`home:${homeId}`);

    // wysłanie snapshot zaraz po  subskrypcji
    socket.emit("home:update", getHomeState(homeId));
  });
  socket.on("unsubscribe:home", (homeId: string) => {
    socket.leave(`home:${homeId}`);
  });
});

// start simulator przyjmuje callback który jest wywoływany kiedy stan domu się zmienia
startSimulator(
  (homeId) => {
    io.to(`home:${homeId}`).emit("home:update", getHomeState(homeId));
  },
  (homeId, alert) => {
    io.to(`home:${homeId}`).emit("alert:new", {homeId, alert});
  }
);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
