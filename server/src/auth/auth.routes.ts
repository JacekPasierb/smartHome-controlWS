import {Router} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {Role} from "./homeAccess";

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

  return res.json({
    accessToken,
    user: {
      id: user.id,
      role: user.role,
      homes: user.homes,
    },
  });
});

export default router;
