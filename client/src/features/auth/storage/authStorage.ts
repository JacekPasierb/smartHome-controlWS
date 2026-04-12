import type {AuthUser} from "../../../types/auth";

const TOKEN_KEY = "shcc_token";
const USER_KEY = "shcc_user";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),

  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setUser: (user: AuthUser) =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
