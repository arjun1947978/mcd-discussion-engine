import React from 'react';
import { ChevronDown } from 'lucide-react';

export const ScrollToBottomButton = ({ visible, unreadCount, onClick }) => {
  if (!visible) return null;

  return (
    <button
      type="button"
      className="wa-scroll-bottom-btn"
      onClick={onClick}
      title="Scroll to bottom"
      aria-label="Scroll to bottom"
    >
      <ChevronDown size={20} className="wa-scroll-icon" />
      {unreadCount > 0 && (
        <span className="wa-scroll-badge">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default ScrollToBottomButton;

