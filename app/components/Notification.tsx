"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";

type NotificationType = "success" | "error" | "info";

interface NotificationContextType {
  notification: string | null;
  notificationType: NotificationType;
  showNotification: (
    message: string,
    type?: NotificationType,
    duration?: number,
  ) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  notificationType: "success",
  showNotification: () => {},
  clearNotification: () => {},
});

function NotificationSearchParamsListener({
  onNotify,
}: {
  onNotify: (msg: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const notifyParam = searchParams.get("notify");
    if (notifyParam) {
      onNotify(notifyParam);
      // Clean up URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("notify");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  }, [searchParams, onNotify]);

  return null;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] =
    useState<NotificationType>("success");

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showNotification = useCallback(
    (
      message: string,
      type: NotificationType = "success",
      duration: number = 5000,
    ) => {
      setNotification(message);
      setNotificationType(type);
      try {
        sessionStorage.setItem("app_notification", message);
        sessionStorage.setItem("app_notification_type", type);
      } catch {}

      if (duration > 0) {
        setTimeout(() => {
          setNotification((curr) => (curr === message ? null : curr));
        }, duration);
      }
    },
    [],
  );

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("app_notification");
      const storedType = (sessionStorage.getItem("app_notification_type") as NotificationType) || "success";
      if (stored) {
        setNotification(stored);
        setNotificationType(storedType);
        sessionStorage.removeItem("app_notification");
        sessionStorage.removeItem("app_notification_type");
        setTimeout(() => {
          setNotification((curr) => (curr === stored ? null : curr));
        }, 5000);
      }
    } catch {}
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        notificationType,
        showNotification,
        clearNotification,
      }}
    >
      <Suspense fallback={null}>
        <NotificationSearchParamsListener onNotify={(msg) => showNotification(msg)} />
      </Suspense>
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full px-4 animate-fade-in">
          <div
            data-testid="notification"
            className={`p-4 rounded-lg shadow-lg border text-sm font-medium transition-all ${
              notificationType === "error"
                ? "bg-red-50 border-red-300 text-red-800"
                : notificationType === "info"
                ? "bg-blue-50 border-blue-300 text-blue-800"
                : "bg-green-50 border-green-300 text-green-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{notification}</span>
              <button
                type="button"
                onClick={clearNotification}
                className="ml-3 text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
