import React, { useEffect } from 'react';
import { CheckCircle2, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="wa-toast-container">
      <div className="wa-toast-box">
        {type === 'success' ? (
          <CheckCircle2 size={16} className="text-emerald-400 mr-2 flex-shrink-0" />
        ) : (
          <Info size={16} className="text-blue-400 mr-2 flex-shrink-0" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;

