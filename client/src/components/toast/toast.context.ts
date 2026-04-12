import {createContext} from "react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

export type ToastContextValue = {
  showToast: (toast: Omit<ToastItem, "id">) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
