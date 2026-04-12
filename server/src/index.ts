import http from "http";
import app from "./app";
import {getHomeState, startSimulator} from "./store/homeStore";
import {Server} from "socket.io";
import {setupSocket} from "./ws/setupSocket";
import "dotenv/config";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});
setupSocket(io, {
  onSubscribe: (socket, homeId) => {
    // wysłanie snapshot zaraz po subskrypcji
    socket.emit("home:update", getHomeState(homeId));
  },
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
