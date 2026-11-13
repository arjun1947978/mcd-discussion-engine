import React, { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import DateSeparator from './DateSeparator';
import SwipeableMessage from './SwipeableMessage';
import ScrollToBottomButton from './ScrollToBottomButton';
import MessageContextMenu from './MessageContextMenu';
import { isSameDay } from '../../utils/dateUtils';

export const ChatArea = ({
  messages,
  currentChat,
  onReply,
  onCopy,
  onDelete,
  onReact,
  onLoadOlder,
  hasMoreOlder,
  isLoadingOlder,
  onImageClick,
  userSentMessageTrigger,
  incomingMessageTrigger
}) => {
  const containerRef = useRef(null);
  const bottomAnchorRef = useRef(null);

  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [unreadScrolledCount, setUnreadScrolledCount] = useState(0);

  // For preserving scroll position during pagination
  const scrollSnapshotRef = useRef(null);

  // Check if scroll position is near bottom
  const checkIsNearBottom = useCallback(() => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 140;
  }, []);

  const scrollToBottom = (smooth = true) => {
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
      setUnreadScrolledCount(0);
      setShowScrollBottom(false);
    }
  };

  // Scroll listener for:
  // 1) Showing/hiding the floating scroll to bottom button
  // 2) Triggering pagination when reaching the top
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 140;

    setShowScrollBottom(!isNearBottom);
    if (isNearBottom) {
      setUnreadScrolledCount(0);
    }

    // Top pagination trigger
    if (scrollTop < 40 && hasMoreOlder && !isLoadingOlder) {
      // Record scroll height before prepending
      scrollSnapshotRef.current = scrollHeight;
      onLoadOlder();
    }
  };

  // Preserve scroll position when older messages are prepended
  useLayoutEffect(() => {
    if (scrollSnapshotRef.current && containerRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const heightDifference = newScrollHeight - scrollSnapshotRef.current;
      containerRef.current.scrollTop += heightDifference;
      scrollSnapshotRef.current = null;
    }
  }, [messages]);

  // Initial scroll to bottom on mount or chat change
  useEffect(() => {
    scrollToBottom(false);
  }, [currentChat.id]);

  // When USER sends a message: immediately scroll to bottom!
  useEffect(() => {
    if (userSentMessageTrigger) {
      scrollToBottom(true);
    }
  }, [userSentMessageTrigger]);

  // When SOMEONE ELSE sends a message:
  // "kisi aur ka meesage aya to top par hi rahe"
  useEffect(() => {
    if (!incomingMessageTrigger) return;
    const isNearBottom = checkIsNearBottom();
    if (isNearBottom) {
      // If user is already near bottom, scroll down
      scrollToBottom(true);
    } else {
      // If user is scrolled up reading older messages, stay at current scroll position!
      setUnreadScrolledCount((prev) => prev + 1);
      setShowScrollBottom(true);
    }
  }, [incomingMessageTrigger, checkIsNearBottom]);

  const handleOpenContextMenu = (message, coords) => {
    setContextMenuTarget(message);
    setContextMenuPos(coords);
  };

  const handleCloseContextMenu = () => {
    setContextMenuTarget(null);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="wa-chat-area-container"
    >
      <div className="wa-chat-area-inner">
        {/* Pagination loading spinner */}
        {isLoadingOlder && (
          <div className="wa-pagination-spinner">
            <Loader2 size={18} className="animate-spin text-emerald-600 mr-2" />
            <span>Loading older messages...</span>
          </div>
        )}

        {/* End-to-end encryption security banner */}
        <div className="wa-encryption-banner">
          <div className="wa-encryption-pill">
            <Lock size={12} className="inline mr-1 text-amber-500" />
            <span>Messages and discussions are end-to-end encrypted. Internal & confidential to Marca Coroma Enterprise.</span>
          </div>
        </div>

        {/* Message stream grouped by date so sticky date pills never overlap */}
        {(() => {
          const groups = [];
          messages.forEach((message) => {
            const lastGroup = groups[groups.length - 1];
            if (!lastGroup || !isSameDay(message.date, lastGroup.date)) {
              groups.push({
                key: `date-${message.id}`,
                date: message.date,
                items: [message]
              });
            } else {
              lastGroup.items.push(message);
            }
          });

          return groups.map((group) => (
            <div key={group.key} className="wa-date-group">
              <DateSeparator date={group.date} />
              {group.items.map((message) => (
                <SwipeableMessage
                  key={message.id}
                  message={message}
                  onReply={onReply}
                  onLongPress={handleOpenContextMenu}
                  onContextMenu={handleOpenContextMenu}
                  onImageClick={onImageClick}
                  isSelected={contextMenuTarget?.id === message.id}
                />
              ))}
            </div>
          ));
        })()}

        {/* Bottom invisible scroll anchor */}
        <div ref={bottomAnchorRef} style={{ height: 1 }} />
      </div>

      {/* Floating Scroll to Bottom button with unread counter */}
      <ScrollToBottomButton
        visible={showScrollBottom}
        unreadCount={unreadScrolledCount}
        onClick={() => scrollToBottom(true)}
      />

      {/* Long press / Right click Context Menu */}
      {contextMenuTarget && (
        <MessageContextMenu
          targetMessage={contextMenuTarget}
          position={contextMenuPos}
          onClose={handleCloseContextMenu}
          onReply={onReply}
          onCopy={onCopy}
          onDelete={onDelete}
          onReact={onReact}
        />
      )}
    </div>
  );
};

export default ChatArea;

