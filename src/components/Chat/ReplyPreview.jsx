import React from 'react';
import { X, Reply } from 'lucide-react';

export const ReplyPreview = ({ replyTarget, onCancel }) => {
  if (!replyTarget) return null;

  const isUser = replyTarget.position === 'right';
  const senderTitle = isUser ? 'You' : replyTarget.senderName || 'Contact';

  return (
    <div className="wa-reply-bar-container">
      <div className="wa-reply-bar-accent" />
      <div className="wa-reply-bar-content">
        <div className="wa-reply-bar-header">
          <Reply size={13} className="text-emerald-600 inline mr-1" />
          <span className="wa-reply-bar-author">{senderTitle}</span>
        </div>
        <p className="wa-reply-bar-text">
          {replyTarget.type === 'photo' ? '📷 Photo' : replyTarget.text}
        </p>
      </div>
      <button
        onClick={onCancel}
        className="wa-reply-bar-close"
        title="Cancel reply"
        type="button"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ReplyPreview;

