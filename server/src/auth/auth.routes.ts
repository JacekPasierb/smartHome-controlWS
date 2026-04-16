import {Response, Router} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {Role} from "./homeAccess";
import { AUTH_COOKIE_NAME } from "./auth.constants";
import { AuthRequest, authRequired } from "./auth.middleware";

const router = Router();

type User = {
  id: string;
  login: string;
  passHash: string;
  role: Role;
  homes: string[];
};

// MVP users (ETAP 3 -> DB)
const USERS: User[] = [
  {
    id: "u1",
    login: "user",
    passHash: "$2b$10$MLNNFRito7Nwuf7YTMItBuCz4xKMUqmGj2kYRAkVZQBgnYdYYd/FG",
    role: "user",
    homes: ["123"],
  },
  {
    id: "a1",
    login: "admin",
    passHash: "$2b$10$LFV7UbIr14ntlPoSGFxcJ.Kajkgmtqw9lUp13r4MQD5nMGeMw4PIm",
    role: "admin",
    homes: ["123", "456"],
  },
];

function getCookieOptions() {
  

  return {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
    maxAge: 2 * 60 * 60 * 1000,
  };
}

router.post("/login", async (req, res) => {
  const {login, password} = req.body;
  if (!login || !password)
    return res.status(400).json({message: "Missing login or password"});

  const user = USERS.find((u) => u.login === login);

  if (!user) return res.status(401).json({message: "Invalid credentials"});

  const ok = await bcrypt.compare(password, user.passHash);
  if (!ok) return res.status(401).json({message: "Invalid credentials"});

  const accessToken = jwt.sign(
    {sub: user.id, role: user.role as Role},
    process.env.JWT_SECRET as string,
    {expiresIn: "2h"}
  );

   res.cookie(AUTH_COOKIE_NAME, accessToken, getCookieOptions());

  return res.json({
    user: {
      id: user.id,
      role: user.role,
      homes: user.homes,
    },
  });
});


router.get("/me", authRequired, (req: AuthRequest, res: Response) => {
  const currentUser = USERS.find((user) => user.id === req.user?.id);

  if (!currentUser) {
    return res.status(404).json({message: "User not found"});
  }

  return res.json({
    user: {
      id: currentUser.id,
      role: currentUser.role,
      homes: currentUser.homes,
    },
  });
});

router.post("/logout", (_req, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
  });

  return res.json({success: true});
});

export default router;
