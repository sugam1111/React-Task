import { useEffect, useMemo, useState } from "react";
import type { User, UsersResponse } from "../../types";
import { request } from "../../api";

export type Gender = "all" | "male" | "female";
export type SortOrder = "ASC" | "DESC";

export function useUsersQuery(params: {
  token: string | null;
  q: string;
  gender: Gender;
  ageMin: string;
  ageMax: string;
  sortBy: keyof User;
  order: SortOrder;
  page: number;
  limit: number;
}) {
  const { token, q, gender, ageMin, ageMax, sortBy, order, page, limit } = params;

  const [rawUsers, setRawUsers] = useState<User[]>([]);
  const [rawTotal, setRawTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError("");
      setLoading(true);
      try {
        if (q) {
          const data = await request<UsersResponse>(`/users/search?q=${encodeURIComponent(q)}`, { token });
          if (cancelled) return;
          setRawUsers(data.users || []);
          setRawTotal(data.total ?? data.users?.length ?? 0);
          return;
        }

        if (gender !== "all") {
          const data = await request<UsersResponse>(
            `/users/filter?key=gender&value=${encodeURIComponent(gender)}&limit=200&skip=0`,
            { token }
          );
          if (cancelled) return;
          setRawUsers(data.users || []);
          setRawTotal(data.total ?? data.users?.length ?? 0);
          return;
        }

        const skip = (page - 1) * limit;
        const data = await request<UsersResponse>(
          `/users?limit=${limit}&skip=${skip}&sortBy=${String(sortBy)}&order=${order}`,
          { token }
        );
        if (cancelled) return;
        setRawUsers(data.users || []);
        setRawTotal(data.total ?? 0);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token, q, gender, page, limit, sortBy, order]);

  const processed = useMemo(() => {
    let list = rawUsers.slice();

    const min = ageMin === "" ? null : Number(ageMin);
    const max = ageMax === "" ? null : Number(ageMax);

    if (min !== null && !Number.isNaN(min)) list = list.filter((u) => u.age >= min);
    if (max !== null && !Number.isNaN(max)) list = list.filter((u) => u.age <= max);

    const localMode = Boolean(q) || gender !== "all";

    if (localMode) {
      list.sort((a, b) => {
        const av = a[sortBy] as any;
        const bv = b[sortBy] as any;

        if (typeof av === "number" && typeof bv === "number") {
          return order === "ASC" ? av - bv : bv - av;
        }
        return order === "ASC"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });

      const total = list.length;
      const start = (page - 1) * limit;
      return { list: list.slice(start, start + limit), total };
    }

    return { list, total: rawTotal };
  }, [rawUsers, rawTotal, ageMin, ageMax, q, gender, sortBy, order, page, limit]);

  const totalPages = Math.max(1, Math.ceil(processed.total / limit));

  return { processed, totalPages, loading, error };
}
