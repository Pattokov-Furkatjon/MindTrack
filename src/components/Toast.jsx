import React from 'react';

function Toast({ items, onDismiss }) {
  return (
    <div className='toast-container'>
      {items.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div>{toast.message}</div>
          <button className='toast-close' onClick={() => onDismiss(toast.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;
