import express from "express";
import cors from "cors";
import authRouter from "./auth/auth.routes";
import {homeRouter} from "./home/home.routes";
import { settingsRouter } from "./settings/settings.routes";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({status: "ok"});
});

app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);
app.use("/api/home", settingsRouter);

export default app;
