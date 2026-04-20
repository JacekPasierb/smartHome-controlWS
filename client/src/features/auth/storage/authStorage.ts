import type {AuthUser} from "../../../types/auth";


const USER_KEY = "shcc_user";

export const authStorage = {


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
    localStorage.removeItem(USER_KEY);
  },
};
