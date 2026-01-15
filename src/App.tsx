import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Users from "./pages/Users/UsersPage";
import { getStoredAuth, clearStoredAuth } from "./api";
import type { Auth } from "./types";
import { clearLocalTodos } from "./todosLocal";

export default function App() {
  const [auth, setAuth] = useState<Auth | null>(null);

  // load saved login once
  useEffect(() => {
    const saved = getStoredAuth();
    setAuth(saved);
  }, []);

  // logout
  const onLogout = () => {
    clearStoredAuth();
    clearLocalTodos(); // clears local todos when logout
    setAuth(null);
  };

  // show login if not logged in
  if (auth === null) {
    return <Login onLoggedIn={setAuth} />;
  }

  // show users if logged in
  return <Users auth={auth} onLogout={onLogout} />;
}
