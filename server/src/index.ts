import "dotenv/config";
import http from "http";
import {Server} from "socket.io";
import app from "./app";
import {getHomeState, startSimulator} from "./home/homeStore";
import {setupSocket} from "./ws/setupSocket";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://smarthome-frontend.netlify.app/",
  },
});

setupSocket(io, {
  onSubscribe: (socket, homeId) => {
    socket.emit("home:update", getHomeState(homeId));
  },
});

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
