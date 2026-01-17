import { useEffect, useState } from "react";
import type { Todo, TodosResponse, User } from "../../types";
import { request } from "../../api";
import Modal from "../../components/Modal";
import { getLocalTodos } from "../../todosLocal";

export function ViewTodosModal({
  token,
  user,
  onClose,
}: {
  token: string | null;
  user: User;
  onClose: () => void;
}) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setErr("");
      setLoading(true);

      try {
        const local = getLocalTodos(user.id);
        const data = await request<TodosResponse>(`/todos/user/${user.id}`, { token });
        if (cancelled) return;

        const apiTodos = data.todos || [];
        setTodos([...(local || []), ...apiTodos]);
      } catch (e: any) {
        if (cancelled) return;

        const local = getLocalTodos(user.id);
        setTodos([...(local || [])]);
        setErr(e?.message || "Failed to load todos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token, user.id]);

  return (
    <Modal title={`Todos (User #${user.id})`} onClose={onClose}>
      {loading ? (
        <div className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-600">
          Loading...
        </div>
      ) : null}

      {err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      {!loading && todos.length === 0 ? (
        <div className="text-sm text-slate-500">No todos</div>
      ) : null}

      {!loading && todos.length > 0 ? (
        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t.id}
              className="border border-sky-100 rounded-2xl p-3 bg-white flex items-center justify-between gap-3"
            >
              <span className="text-slate-800">{t.todo}</span>
              <span
                className={
                  "text-xs rounded-full px-2.5 py-1 border " +
                  (t.completed
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-sky-50 text-sky-700 border-sky-200")
                }
              >
                {t.completed ? "Done" : "Open"}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </Modal>
  );
}
