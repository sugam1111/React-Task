import type { Auth } from "../../types";
import { UI } from "./ui";

export function UsersToolbar({ auth, onLogout }: { auth: Auth; onLogout: () => void }) {
  return (
    <div className="border-b border-sky-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-slate-800">Users</div>
          <div className="text-sm text-slate-500">
            Logged in as <span className="font-medium text-slate-700">{auth.user?.username}</span>
          </div>
        </div>
        <button className={UI.btnSecondary} onClick={onLogout} type="button">
          Logout
        </button>
      </div>
    </div>
  );
}
