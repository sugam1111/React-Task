import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Users from "./pages/Users/UsersPage";
import { getStoredAuth, clearStoredAuth } from "./api";
import type { Auth } from "./types";

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
    setAuth(null);
  };

  // show login if not logged in
  if (auth === null) {
    return <Login onLoggedIn={setAuth} />;
  }

  // show users if logged in
  return <Users auth={auth} onLogout={onLogout} />;
}
