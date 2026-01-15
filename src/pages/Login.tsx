import { useState } from "react";
import { request, setStoredAuth } from "../api";
import type { Auth } from "../types";

type Props = {
  onLoggedIn: (auth: Auth) => void;
};

export default function Login({ onLoggedIn }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "mt-1 w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none";

  const primaryBtn =
    "w-full rounded-xl bg-sky-600 px-3 py-2.5 text-white font-medium hover:bg-sky-700 disabled:opacity-60";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await request<any>("/auth/login", {
        method: "POST",
        body: { username, password },
      });

      const token = data.token || data.accessToken || null;
      const auth: Auth = { token, user: data };

      setStoredAuth(auth);
      onLoggedIn(auth);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold text-slate-800">User Portal</div>
          <div className="text-sm text-slate-500">Sign in to continue</div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-slate-700">Username</label>
            <input
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button className={primaryBtn} disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-xs text-slate-500">
            Test: <span className="font-medium text-slate-700">emilys</span> /{" "}
            <span className="font-medium text-slate-700">emilyspass</span>
          </div>
        </form>

        <div className="mt-4 text-center text-xs text-slate-500">
          API: <span className="font-medium text-slate-700">dummyjson.com</span>
        </div>
      </div>
    </div>
  );
}
