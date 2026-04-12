import {authStorage} from "../features/auth/storage/authStorage";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

function App() {
  const isAuthed = Boolean(authStorage.getToken());

  return isAuthed ? <DashboardPage /> : <LoginPage />;
}

export default App;
