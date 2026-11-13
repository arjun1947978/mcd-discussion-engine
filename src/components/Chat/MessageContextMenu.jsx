import React, { useEffect, useRef } from 'react';
import { Reply, Copy, Trash2, Star, Forward, CheckCheck, Smile } from 'lucide-react';
import { QUICK_REACTIONS } from '../../data/emojiData';

export const MessageContextMenu = ({
  targetMessage,
  position,
  onClose,
  onReply,
  onCopy,
  onDelete,
  onReact
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!targetMessage) return null;

  // Calculate smart coordinates so menu doesn't overflow screen
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const menuWidth = 220;
  const menuHeight = 240;

  let left = position?.x || screenW / 2;
  let top = position?.y || screenH / 2;

  if (left + menuWidth > screenW - 16) {
    left = screenW - menuWidth - 16;
  }
  if (left < 16) left = 16;

  if (top + menuHeight > screenH - 20) {
    top = top - menuHeight - 10;
  }
  if (top < 60) top = 60;

  const isUserMessage = targetMessage.position === 'right';

  return (
    <div className="wa-context-overlay">
      <div
        ref={menuRef}
        className="wa-context-menu"
        style={{
          top: `${top}px`,
          left: `${left}px`
        }}
      >
        {/* Quick Reaction Bar */}
        <div className="wa-reactions-bar">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              className="wa-reaction-btn"
              onClick={() => {
                onReact(targetMessage.id, emoji);
                onClose();
              }}
              title={`React ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="wa-menu-divider" />

        {/* Menu Items */}
        <div className="wa-menu-items">
          <button
            className="wa-menu-item"
            onClick={() => {
              onReply(targetMessage);
              onClose();
            }}
          >
            <Reply size={17} className="wa-menu-icon" />
            <span>Reply</span>
          </button>

          <button
            className="wa-menu-item"
            onClick={() => {
              onCopy(targetMessage.text || '');
              onClose();
            }}
          >
            <Copy size={17} className="wa-menu-icon" />
            <span>Copy Text</span>
          </button>

          <button
            className="wa-menu-item"
            onClick={() => {
              onReact(targetMessage.id, '⭐');
              onClose();
            }}
          >
            <Star size={17} className="wa-menu-icon" />
            <span>Star message</span>
          </button>

          <button
            className="wa-menu-item"
            onClick={() => {
              onReply(targetMessage);
              onClose();
            }}
          >
            <Forward size={17} className="wa-menu-icon" />
            <span>Forward</span>
          </button>

          <div className="wa-menu-divider" />

          <button
            className="wa-menu-item wa-menu-item-danger"
            onClick={() => {
              onDelete(targetMessage.id, isUserMessage);
              onClose();
            }}
          >
            <Trash2 size={17} className="wa-menu-icon text-red-500" />
            <span className="text-red-500">
              {isUserMessage ? 'Delete for everyone' : 'Delete for me'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageContextMenu;

