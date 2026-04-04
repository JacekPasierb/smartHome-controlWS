import express from "express";
import cors from "cors";

import {homeRouter} from "./routes/home.routes";
import authRouter from "./auth/auth.routes";

const app = express();

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({status: "ok"});
});
app.use("/api/auth", authRouter);
app.use("/api/home", homeRouter);

export default app;
