import { useEffect, useRef, useState } from 'react';

function createToastId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef({});

  const dismissToast = (toastId) => {
    if (timeoutsRef.current[toastId]) {
      window.clearTimeout(timeoutsRef.current[toastId]);
      delete timeoutsRef.current[toastId];
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  };

  const pushToast = (message, tone = 'success') => {
    const toastId = createToastId();

    setToasts((currentToasts) => [
      ...currentToasts,
      { id: toastId, message, tone },
    ]);

    timeoutsRef.current[toastId] = window.setTimeout(() => {
      dismissToast(toastId);
    }, 4200);
  };

  useEffect(() => {
    const currentTimeouts = timeoutsRef.current;

    return () => {
      Object.values(currentTimeouts).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  return {
    toasts,
    pushToast,
    dismissToast,
  };
}
