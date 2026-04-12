export type Role = "user" | "admin";

export type AuthUser = {
  id: string;
  role: Role;
  homes: string[];
};

export type LoginRequest = {
  login: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};
