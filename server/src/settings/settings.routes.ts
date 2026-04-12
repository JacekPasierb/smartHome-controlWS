import {Router, Response, NextFunction} from "express";
import {authRequired, AuthRequest} from "../auth/auth.middleware";
import {canAccessHome} from "../auth/homeAccess";
import {getHomeSettings, updateHomeSettings} from "./settingsStore";
import type {HomeSettings} from "./settingsTypes";

export const settingsRouter = Router();

const homeAccessGuard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const homeId = req.params.homeId as string;

  if (!req.user || !canAccessHome(req.user, homeId)) {
    return res.status(403).json({error: "Forbidden"});
  }

  return next();
};

const adminOnlyGuard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({error: "Admin only"});
  }

  return next();
};

settingsRouter.get(
  "/:homeId/settings",
  authRequired,
  homeAccessGuard,
  (req: AuthRequest, res: Response) => {
    const homeId = req.params.homeId as string;
    res.json(getHomeSettings(homeId));
  }
);

settingsRouter.patch(
  "/:homeId/settings",
  authRequired,
  homeAccessGuard,
  adminOnlyGuard,
  (req: AuthRequest, res: Response) => {
    const homeId = req.params.homeId as string;
    const patch = req.body as Partial<HomeSettings>;

    const next = updateHomeSettings(homeId, patch);
    res.json(next);
  }
);
