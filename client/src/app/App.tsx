import {authStorage} from "../features/auth/storage/authStorage";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

function App() {
  const token = authStorage.getToken();
  const user = authStorage.getUser();

  const isAuthed = Boolean(token && user);

  return isAuthed ? <DashboardPage /> : <LoginPage />;
}

export default App;
