import {useCallback, useMemo, useState, type ReactNode} from "react";
import {ToastContext, type ToastItem} from "./toast.context";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function ToastProvider({children}: {children: ReactNode}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = uid();
    const nextToast: ToastItem = {id, ...toast};

    setToasts((prev) => [...prev, nextToast]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toastViewport">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.variant}`}
            role="status"
            aria-live="polite"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <strong>{toast.title}</strong>
              <button
                className="toastClose"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>

            {toast.description && (
              <div className="toastDescription">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
