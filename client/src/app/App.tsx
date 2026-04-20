import {authStorage} from "../features/auth/storage/authStorage";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import {useEffect, useState} from "react";
import {getMe} from "../features/auth/api/authApi";
import type {AuthUser} from "../types/auth";

function App() {
  const [user, setUser] = useState<AuthUser | null>(authStorage.getUser());
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    
    async function bootstrapSession() {
      try {
        const response = await getMe();
        authStorage.setUser(response.user);
        setUser(response.user);
      } catch {
        authStorage.clear();
        setUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    }

    bootstrapSession();
  }, []);

  if (isCheckingSession) {
    return <div style={{padding: 24}}>Checking session...</div>;
  }
  return user ? <DashboardPage /> : <LoginPage />;
}

export default App;
