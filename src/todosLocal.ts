import type { Todo } from "./types";

const KEY = "local_todos_v1";

type Store = Record<string, Todo[]>; // userId -> todos

function readStore(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getLocalTodos(userId: number): Todo[] {
  const store = readStore();
  return store[String(userId)] || [];
}

export function addLocalTodo(userId: number, todoText: string): Todo {
  const store = readStore();
  const id = Date.now(); // simple unique id
  const newTodo: Todo = { id, todo: todoText, completed: false, userId };

  const list = store[String(userId)] || [];
  store[String(userId)] = [newTodo, ...list];

  writeStore(store);
  return newTodo;
}

export function clearLocalTodos() {
  localStorage.removeItem(KEY);
}
