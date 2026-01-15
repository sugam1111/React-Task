import type { User } from "../../types";
import { UI } from "./ui";

const SORT_FIELDS: Array<keyof User> = ["firstName", "lastName", "email", "age", "username"];

export function UsersTable(props: {
  users: User[];
  loading: boolean;
  sortBy: keyof User;
  order: "ASC" | "DESC";
  toggleSort: (f: keyof User) => void;
  onAddTodo: (u: User) => void;
  onViewTodos: (u: User) => void;
}) {
  const { users, loading, sortBy, order, toggleSort, onAddTodo, onViewTodos } = props;

  function SortTh({ field, label }: { field: keyof User; label: string }) {
    if (!SORT_FIELDS.includes(field)) return <th className="p-3 text-xs font-semibold uppercase tracking-wide">{label}</th>;
    return (
      <th
        className="p-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none"
        onClick={() => toggleSort(field)}
      >
        {label}{" "}
        <span className="text-slate-400">{sortBy === field ? (order === "ASC" ? "▲" : "▼") : ""}</span>
      </th>
    );
  }

  return (
    <div className="overflow-auto border border-sky-100 rounded-2xl bg-white">
      <table className="w-full text-sm">
        <thead className="bg-sky-50">
          <tr className="text-left text-slate-700">
            <th className="p-3 text-xs font-semibold uppercase tracking-wide">ID</th>
            <SortTh field="firstName" label="First Name" />
            <SortTh field="lastName" label="Last Name" />
            <SortTh field="email" label="Email" />
            <SortTh field="age" label="Age" />
            <th className="p-3 text-xs font-semibold uppercase tracking-wide">Gender</th>
            <SortTh field="username" label="Username" />
            <th className="p-3 text-xs font-semibold uppercase tracking-wide">Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading && users.length === 0 ? (
            <tr>
              <td className="p-6 text-center text-slate-500" colSpan={8}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-t border-sky-100 hover:bg-sky-50">
                <td className="p-3 text-slate-700">{u.id}</td>
                <td className="p-3 text-slate-800 font-medium">{u.firstName}</td>
                <td className="p-3 text-slate-700">{u.lastName}</td>
                <td className="p-3 text-slate-700">{u.email}</td>
                <td className="p-3 text-slate-700">{u.age}</td>
                <td className="p-3 text-slate-700">{u.gender}</td>
                <td className="p-3 text-slate-700">{u.username}</td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    <button className={UI.btnSmall} onClick={() => onAddTodo(u)} type="button">
                      Add Todo
                    </button>
                    <button className={UI.btnSmall} onClick={() => onViewTodos(u)} type="button">
                      View Todos
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
