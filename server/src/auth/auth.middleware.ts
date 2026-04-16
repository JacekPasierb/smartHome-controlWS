import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import type {Role} from "./homeAccess";
import { AUTH_COOKIE_NAME } from "./auth.constants";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export const authRequired = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization || "";
   const [, bearerToken] = header.split(" ");
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
  const token = cookieToken || bearerToken;
  
  if (!token) {
    return res.status(401).json({message: "Missing token"});
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
      role: Role;
    };

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    return next();
  } catch {
    return res.status(401).json({message: "Invalid token"});
  }
};
