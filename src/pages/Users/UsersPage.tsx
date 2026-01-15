import { useEffect, useState } from "react";
import type { Auth, User } from "../../types";
import { useDebounce } from "./useDebounce";
import { useUsersQuery } from "./useUsersQuery";
import { UsersToolbar } from "./UsersToolbar";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";
import { UsersPagination } from "./UsersPagination";
import { AddTodoModal } from "./AddTodoModal";
import { ViewTodosModal } from "./ViewTodosModal";


type Props = {
  auth: Auth;
  onLogout: () => void;
};

export default function UsersPage({ auth, onLogout }: Props) {
  const token = auth.token;

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q.trim(), 300);

  const [gender, setGender] = useState<"all" | "male" | "female">("all");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");

  const [sortBy, setSortBy] = useState<keyof User>("firstName");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [addTodoUser, setAddTodoUser] = useState<User | null>(null);
  const [viewTodosUser, setViewTodosUser] = useState<User | null>(null);

  // reset page when controls change
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, gender, ageMin, ageMax, sortBy, order, limit]);

  const { processed, totalPages, loading, error } = useUsersQuery({
    token,
    q: debouncedQ,
    gender,
    ageMin,
    ageMax,
    sortBy,
    order,
    page,
    limit,
  });

  function toggleSort(field: keyof User) {
    const sortable: Array<keyof User> = ["firstName", "lastName", "email", "age", "username"];
    if (!sortable.includes(field)) return;
    if (sortBy === field) setOrder((o) => (o === "ASC" ? "DESC" : "ASC"));
    else {
      setSortBy(field);
      setOrder("ASC");
    }
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <UsersToolbar auth={auth} onLogout={onLogout} />

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <UsersFilters
          q={q}
          setQ={setQ}
          gender={gender}
          setGender={setGender}
          ageMin={ageMin}
          setAgeMin={setAgeMin}
          ageMax={ageMax}
          setAgeMax={setAgeMax}
          limit={limit}
          setLimit={setLimit}
          sortBy={sortBy}
          order={order}
          page={page}
          totalPages={totalPages}
          total={processed.total}
          loading={loading}
          error={error}
        />

        <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm space-y-4">
          <UsersTable
            users={processed.list}
            loading={loading}
            sortBy={sortBy}
            order={order}
            toggleSort={toggleSort}
            onAddTodo={(u) => setAddTodoUser(u)}
            onViewTodos={(u) => setViewTodosUser(u)}
          />

          <UsersPagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>

      {addTodoUser ? (
        <AddTodoModal token={token} user={addTodoUser} onClose={() => setAddTodoUser(null)} />
      ) : null}

      {viewTodosUser ? (
        <ViewTodosModal token={token} user={viewTodosUser} onClose={() => setViewTodosUser(null)} />
      ) : null}
    </div>
  );
}
