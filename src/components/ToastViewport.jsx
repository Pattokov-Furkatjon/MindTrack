function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => onDismiss(toast.id)}>
            Close
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;
