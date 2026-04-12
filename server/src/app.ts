import express from "express";
import cors from "cors";
import authRouter from "./auth/auth.routes";
import {homeRouter} from "./home/home.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({status: "ok"});
});

app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);

export default app;
