import type { User } from "../../types";
import { UI } from "./ui";
import type { Gender, SortOrder } from "./useUsersQuery";

export function UsersFilters(props: {
  q: string;
  setQ: (v: string) => void;
  gender: Gender;
  setGender: (v: Gender) => void;
  ageMin: string;
  setAgeMin: (v: string) => void;
  ageMax: string;
  setAgeMax: (v: string) => void;
  limit: number;
  setLimit: (n: number) => void;

  sortBy: keyof User;
  order: SortOrder;
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  error: string;
}) {
  const {
    q, setQ, gender, setGender, ageMin, setAgeMin, ageMax, setAgeMax, limit, setLimit,
    page, totalPages, total, loading, error,
  } = props;

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <label className="text-sm font-medium text-slate-700">Search</label>
          <input className={UI.input} placeholder="name / email / username" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Gender</label>
          <select className={UI.select} value={gender} onChange={(e) => setGender(e.target.value as any)}>
            <option value="all">All</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Age min</label>
          <input className={UI.input} value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder="e.g. 18" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Age max</label>
          <input className={UI.input} value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder="e.g. 60" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Items / page</label>
          <select className={UI.select} value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-600">Loading...</div>
      ) : null}

      <div className="text-sm text-slate-600">
        Total: <b className="text-slate-800">{total}</b> | Page <b className="text-slate-800">{page}</b> /{" "}
        <b className="text-slate-800">{totalPages}</b>
      </div>
    </div>
  );
}
