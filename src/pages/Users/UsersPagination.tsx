import { UI } from "./ui";

export function UsersPagination(props: {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}) {
  const { page, totalPages, setPage } = props;

  return (
    <div className="flex items-center justify-between gap-3">
      <button className={UI.btnSecondary} disabled={page <= 1} onClick={() => setPage(page - 1)} type="button">
        Prev
      </button>

      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
          const start = Math.max(1, Math.min(page - 3, totalPages - 6));
          const p = start + i;
          if (p > totalPages) return null;

          const cls =
            p === page
              ? "rounded-xl bg-sky-600 px-3 py-2 text-white font-medium"
              : "rounded-xl border border-sky-200 bg-white px-3 py-2 text-sky-700 font-medium hover:bg-sky-50";

          return (
            <button key={p} className={cls} onClick={() => setPage(p)} type="button">
              {p}
            </button>
          );
        })}
      </div>

      <button className={UI.btnSecondary} disabled={page >= totalPages} onClick={() => setPage(page + 1)} type="button">
        Next
      </button>
    </div>
  );
}
