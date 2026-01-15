type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white border border-sky-100 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-sky-100 bg-sky-50/60 rounded-t-2xl">
          <div className="font-semibold text-slate-800">{title}</div>
          <button
            className="h-9 px-3 rounded-xl border border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
