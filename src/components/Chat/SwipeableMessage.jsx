import React from 'react';
import { Reply, ChevronDown } from 'lucide-react';
import { useBubbleInteraction } from '../../hooks/useBubbleInteraction';
import { formatTime } from '../../utils/dateUtils';
import StatusTick from '../Common/StatusTick';
import { renderRichText } from '../../utils/richText';

export const SwipeableMessage = ({
  message,
  onReply,
  onLongPress,
  onContextMenu,
  onImageClick,
  isSelected
}) => {
  const { offsetX, isThresholdReached, isSwiping, interactionProps } =
    useBubbleInteraction({
      onSwipeReply: () => onReply(message),
      onLongPress: (e, coords) => onLongPress(message, coords),
      onClick: () => {
        if (message.type === 'photo' && onImageClick) {
          onImageClick(message);
        }
      },
      threshold: 42,
      maxOffset: 75,
      enabled: !message.deleted
    });

  const isUser = message.position === 'right';
  const isDeleted = message.deleted || message.deletedForEveryone;

  return (
    <div
      className={`wa-message-row ${isUser ? 'wa-message-outgoing' : 'wa-message-incoming'} ${
        isSelected ? 'wa-message-selected' : ''
      }`}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(message, { x: e.clientX, y: e.clientY });
      }}
    >
      {/* Swipe to reply reveal icon */}
      <div
        className={`wa-swipe-indicator ${isThresholdReached ? 'wa-swipe-active' : ''}`}
        style={{
          opacity: Math.min(offsetX / 30, 1),
          transform: `translateY(-50%) scale(${Math.min(0.65 + offsetX / 65, 1.15)})`
        }}
      >
        <div className="wa-swipe-icon-circle">
          <Reply size={16} />
        </div>
      </div>

      {/* Draggable Message Bubble */}
      <div
        className="wa-message-bubble-wrapper"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isSwiping
            ? 'none'
            : 'transform 0.28s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          cursor: isSwiping ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
        {...interactionProps}
      >
        <div className={`wa-bubble ${isUser ? 'wa-bubble-out' : 'wa-bubble-in'}`}>
          {/* Group / Department sender title */}
          {!isUser && message.senderName && (
            <div className="wa-bubble-sender">
              <span>{message.senderName}</span>
              {message.senderRole && (
                <span className="wa-bubble-sender-role"> • {message.senderRole}</span>
              )}
            </div>
          )}

          {/* Quoted Reply inside bubble */}
          {message.replyTo && !isDeleted && (
            <div className="wa-bubble-quoted">
              <div className="wa-quoted-accent" />
              <div className="wa-quoted-body">
                <span className="wa-quoted-author">
                  {message.replyTo.senderName ||
                    (message.replyTo.position === 'right' ? 'You' : 'Member')}
                </span>
                <span className="wa-quoted-snippet">
                  {message.replyTo.text || '📷 Attachment'}
                </span>
              </div>
            </div>
          )}

          {/* Message Content */}
          {isDeleted ? (
            <div className="wa-bubble-deleted">
              <span className="italic text-gray-400">🚫 This message was deleted</span>
            </div>
          ) : message.type === 'photo' ? (
            <div className="wa-bubble-photo-content">
              <img
                src={message.data?.uri || message.text}
                alt="Attachment"
                className="wa-bubble-img"
                loading="lazy"
              />
              {message.text && message.text !== message.data?.uri && (
                <p className="wa-bubble-caption">{message.text}</p>
              )}
            </div>
          ) : message.type === 'audio' ? (
            <div className="wa-bubble-audio-content">
              <div className="wa-audio-avatar">
                <img
                  src={
                    isUser
                      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                  }
                  alt="avatar"
                />
              </div>
              <div className="wa-audio-controls">
                <button
                  type="button"
                  className="wa-audio-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Audio voice note playback simulated! 🎵');
                  }}
                >
                  ▶
                </button>
                <div className="wa-audio-waveform">
                  <div className="wa-waveform-bar" style={{ height: '35%' }} />
                  <div className="wa-waveform-bar" style={{ height: '70%' }} />
                  <div className="wa-waveform-bar" style={{ height: '100%' }} />
                  <div className="wa-waveform-bar" style={{ height: '60%' }} />
                  <div className="wa-waveform-bar" style={{ height: '40%' }} />
                  <div className="wa-waveform-bar" style={{ height: '80%' }} />
                  <div className="wa-waveform-bar" style={{ height: '90%' }} />
                  <div className="wa-waveform-bar" style={{ height: '50%' }} />
                  <div className="wa-waveform-bar" style={{ height: '30%' }} />
                </div>
                <span className="wa-audio-time">0:14</span>
              </div>
            </div>
          ) : (
            <div className="wa-bubble-text-content">
              {isDeleted ? (
                <span>{message.text}</span>
              ) : (
                renderRichText(message.text)
              )}
            </div>
          )}

          {/* Meta footer: time and status ticks */}
          <div className="wa-bubble-meta">
            <span className="wa-bubble-time">{formatTime(message.date)}</span>
            {isUser && !isDeleted && <StatusTick status={message.status || 'read'} />}
          </div>

          {/* Hover action dropdown arrow */}
          <button
            type="button"
            className="wa-bubble-dropdown-trigger"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              onContextMenu(message, { x: rect.right - 180, y: rect.bottom + 5 });
            }}
            title="Message options"
          >
            <ChevronDown size={14} />
          </button>

          {/* Reaction badges */}
          {message.reactions && message.reactions.length > 0 && !isDeleted && (
            <div
              className={`wa-bubble-reactions ${
                isUser ? 'wa-reactions-right' : 'wa-reactions-left'
              }`}
            >
              {message.reactions.map((r, i) => (
                <span key={i} className="wa-reaction-pill">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeableMessage;
