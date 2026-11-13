import React, { useState } from 'react';
import { Users, Search, Circle, X } from 'lucide-react';
import { getMembersForRoom } from '../../data/roomMembers';
import MemberProfileModal from './MemberProfileModal';

export const MembersPanel = ({ roomId, roomContext, onClose, isMobile = false }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const members = getMembersForRoom(roomId, roomContext);

  const isAllOrg = !roomId || roomId === 'all';

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase()))
  );

  const onlineCount = members.filter((m) => m.status === 'online').length;

  return (
    <div className={`mcd-members-panel ${isMobile ? 'mcd-members-mobile-sheet' : ''}`}>
      {/* Header */}
      <div className="mcd-members-header">
        <div className="flex items-center gap-2">
          <Users size={17} className="text-emerald-500" />
          <div>
            <h3 className="mcd-members-title">
              {isAllOrg ? 'Team Members' : 'Room Members'}
            </h3>
            <span className="mcd-members-sub">
              {onlineCount} online • {members.length} {isAllOrg ? 'organization' : 'total'}
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            className="mcd-members-close-btn"
            onClick={onClose}
            title="Close members panel"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Members */}
      <div className="mcd-members-search">
        <Search size={14} className="text-gray-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Filter members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mcd-members-input"
        />
      </div>

      {/* Members List */}
      <div className="mcd-members-list">
        {filtered.map((member) => {
          const isOnline = member.status === 'online';

          return (
            <div
              key={member.id}
              className="mcd-member-item mcd-member-clickable"
              onClick={() => setSelected(member)}
              title="View profile"
            >
              <div className="mcd-member-avatar-wrap">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="mcd-member-avatar"
                />
                <span
                  className={`mcd-member-status-dot ${
                    isOnline ? 'mcd-status-online' : 'mcd-status-offline'
                  }`}
                />
              </div>

              <div className="mcd-member-info">
                <div className="flex items-center justify-between">
                  <span className="mcd-member-name">{member.name}</span>
                  <span
                    className={`mcd-member-badge ${
                      isOnline ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-gray-400'
                    }`}
                  >
                    {isOnline ? 'Online' : member.lastSeen}
                  </span>
                </div>
                <span className="mcd-member-role">{member.role}</span>
                {member.department && (
                  <span className="mcd-member-dept-badge">
                    {member.department}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-4 text-center text-xs text-gray-500">
            No members match "{search}"
          </div>
        )}
      </div>

      {selected && (
        <MemberProfileModal
          member={selected}
          roomContext={roomContext}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default MembersPanel;

