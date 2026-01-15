import { useState } from "react";
import type { User } from "../../types";
import { request } from "../../api";
import Modal from "../../components/Modal";
import { UI } from "./ui";
import { addLocalTodo } from "../../todosLocal";

export function AddTodoModal({
  token,
  user,
  onClose,
}: {
  token: string | null;
  user: User;
  onClose: () => void;
}) {
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function submit() {
    setErr("");
    setOk("");

    const trimmed = todo.trim();
    if (!trimmed) {
      setErr("Todo is required");
      return;
    }

    setLoading(true);
    try {
      // Call API (mock). Even if it doesn't persist, we still save locally.
      await request("/todos/add", {
        method: "POST",
        token,
        body: { todo: trimmed, completed: false, userId: user.id },
      });

      // Save locally so it stays until logout
      addLocalTodo(user.id, trimmed);

      setOk("Todo added");
      setTodo("");
    } catch (e: any) {
      setErr(e?.message || "Failed to add todo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={`Add Todo (User #${user.id})`} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-slate-700">Todo</label>
          <input
            className={UI.input}
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Write a new todo..."
          />
        </div>

        {err ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {ok ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {ok}
          </div>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          <button className={UI.btnSecondary} onClick={onClose} type="button">
            Close
          </button>
          <button
            className={UI.btnPrimary}
            onClick={submit}
            disabled={loading}
            type="button"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
