import express from "express";
import cors from "cors";
import authRouter from "./auth/auth.routes";
import {homeRouter} from "./home/home.routes";
import { settingsRouter } from "./settings/settings.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://smarthome-frontend.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({status: "ok"});
});

app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);
app.use("/api/home", settingsRouter);

export default app;
