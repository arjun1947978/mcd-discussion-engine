import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  ArrowLeft,
  Sun,
  Moon,
  Users,
  Search,
  Trash2,
  Tag
} from 'lucide-react';

export const ChatHeader = ({
  roomContext,
  isTyping,
  theme,
  onToggleTheme,
  onBack,
  onOpenMembers,
  onClearChat
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showHeaderDetails, setShowHeaderDetails] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Reset header details dropdown when switching rooms
  useEffect(() => {
    setShowHeaderDetails(false);
    setCountdown(10);
  }, [roomContext?.id]);

  // 10-second auto-close countdown when header details dropdown is open
  useEffect(() => {
    if (!showHeaderDetails) return undefined;
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowHeaderDetails(false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showHeaderDetails]);

  const toggleHeaderDetails = () => {
    setShowHeaderDetails((prev) => !prev);
  };

  const isQueryRoom = roomContext?.type === 'query';
  const queryData = isQueryRoom ? roomContext.data : null;
  const deptData = !isQueryRoom ? roomContext?.data : null;

  const ringColor =
    countdown <= 3 ? '#ef4444' : countdown <= 5 ? '#f59e0b' : '#00a884';
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - countdown / 10);

  return (
    <div className="mcd-header-wrapper">
      <div className="wa-chat-header">
        <div className="wa-header-left">
          {/* Back Arrow button (Enabled on BOTH Desktop and Mobile to close/back) */}
          {onBack && (
            <button
              type="button"
              className="wa-header-back-btn"
              onClick={onBack}
              title="Close discussion / Back to list"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Clickable Header Info Area (expands full context dropdown) */}
          <div
            className="wa-header-clickable"
            onClick={toggleHeaderDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleHeaderDetails();
              }
            }}
            title="Tap to view full details"
          >
            {/* Room Avatar */}
            <div className="wa-header-avatar-wrap">
              {isQueryRoom ? (
                <div className="mcd-header-query-avatar">
                  <Tag size={18} className="text-white" />
                </div>
              ) : (
                <div
                  className="mcd-header-dept-avatar"
                  style={{ backgroundColor: deptData?.color || '#00a884' }}
                >
                  <span>{deptData?.icon || '🏢'}</span>
                </div>
              )}
              <span className="wa-avatar-online-dot" />
            </div>

            {/* Room Header Info */}
            <div className="wa-header-info">
              <h2 className="wa-header-title">
                {isQueryRoom
                  ? `${queryData.queryId}: ${queryData.title}`
                  : deptData?.name || 'Discussion Room'}
              </h2>

              <p className="wa-header-subtitle">
                {isTyping ? (
                  <span className="wa-typing-text">someone is typing...</span>
                ) : isQueryRoom ? (
                  <span>
                    <span className="hidden sm:inline">System: </span>
                    <strong>{queryData.department || 'Enterprise'}</strong>
                    <span className="hidden md:inline"> • Initiated by {queryData.raisedBy || 'Staff'}</span>
                    {queryData.status && (
                      <span className="mcd-header-status-pill ml-1.5">
                        {queryData.status}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    {deptData?.membersCount || 12} members online • Lead: {deptData?.lead || 'Department Team'}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

      {/* Header Right Actions */}
      <div className="wa-header-actions">
        {/* Toggle Members Panel button (Desktop shortcut) */}
        {onOpenMembers && (
          <button
            type="button"
            className="wa-header-action-btn"
            onClick={onOpenMembers}
            title="View Room Members & Online Status"
          >
            <Users size={19} />
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="wa-header-action-btn wa-theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun size={19} className="text-amber-400" />
          ) : (
            <Moon size={19} className="text-slate-600" />
          )}
        </button>

        {/* 3-Dots Options Menu (NO simulation items!) */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="wa-header-action-btn"
            onClick={() => setShowMenu((prev) => !prev)}
            title="Options Menu"
          >
            <MoreVertical size={19} />
          </button>

          {showMenu && (
            <div className="wa-header-dropdown">
              <button
                className="wa-dropdown-item"
                onClick={() => {
                  if (onOpenMembers) onOpenMembers();
                  setShowMenu(false);
                }}
              >
                <Users size={16} className="text-emerald-500 mr-2" />
                <span>Room Members & Status</span>
              </button>

              <button
                className="wa-dropdown-item"
                onClick={() => {
                  alert('Search within this discussion');
                  setShowMenu(false);
                }}
              >
                <Search size={16} className="text-blue-500 mr-2" />
                <span>Search in Discussion</span>
              </button>

              <div className="wa-menu-divider my-1" />

              <button
                className="wa-dropdown-item text-red-500"
                onClick={() => {
                  if (onClearChat) onClearChat();
                  setShowMenu(false);
                }}
              >
                <Trash2 size={16} className="text-red-500 mr-2" />
                <span>Clear discussion history</span>
              </button>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Expandable Full-Context Header Dropdown (Auto-closes in 10s) */}
      {showHeaderDetails && (
        <div
          className="mcd-header-details-dropdown"
          onClick={() => setShowHeaderDetails(false)}
          title="Click to close"
        >
          <div className="mcd-hd-top">
            <div className="mcd-hd-title-block">
              <h3 className="mcd-hd-title">
                {isQueryRoom
                  ? `${queryData.queryId}: ${queryData.title}`
                  : `${deptData?.name || 'Discussion Room'}${deptData?.code ? ` (${deptData.code})` : ''}`}
              </h3>
              {isQueryRoom ? (
                <div className="mcd-hd-meta-list">
                  <span><strong>System:</strong> {queryData.department || 'Enterprise'}</span>
                  <span><strong>Initiated by:</strong> {queryData.raisedBy || 'Staff'}</span>
                  {queryData.priority && (
                    <span><strong>Priority:</strong> {queryData.priority}</span>
                  )}
                  {queryData.status && (
                    <span className="mcd-hd-status-tag">{queryData.status}</span>
                  )}
                </div>
              ) : (
                <div className="mcd-hd-meta-list">
                  <span><strong>Members:</strong> {deptData?.membersCount || 12} online</span>
                  <span><strong>Lead:</strong> {deptData?.lead || 'Department Team'}</span>
                </div>
              )}
              {(isQueryRoom ? queryData?.description : deptData?.description) && (
                <p className="mcd-hd-desc">
                  {isQueryRoom ? queryData.description : deptData.description}
                </p>
              )}
            </div>

            {/* 10s Circular Countdown Indicator */}
            <div className="mcd-hd-countdown" title={`Auto-closes in ${countdown}s`}>
              <svg width="34" height="34" viewBox="0 0 34 34">
                <circle
                  cx="17"
                  cy="17"
                  r={radius}
                  fill="none"
                  stroke="var(--wa-border)"
                  strokeWidth="3"
                />
                <circle
                  cx="17"
                  cy="17"
                  r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  transform="rotate(-90 17 17)"
                  style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
                />
              </svg>
              <span className="mcd-hd-count-num" style={{ color: ringColor }}>
                {countdown}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
