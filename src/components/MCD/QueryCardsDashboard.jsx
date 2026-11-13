import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle,
  Tag,
  Layers,
  ExternalLink,
  ChevronRight,
  Filter,
  PlusCircle,
  Building2
} from 'lucide-react';
import { MOCK_QUERY_CARDS } from '../../data/mockQueries';
import { MCD_DEPARTMENTS } from '../../data/departments';

export const QueryCardsDashboard = ({
  onOpenQueryRoom,
  onOpenDepartment,
  onOpenCentralWidget,
  activeRoomId,
  allMessages
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredCards = MOCK_QUERY_CARDS.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.queryId.toLowerCase().includes(search.toLowerCase()) ||
      card.description.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      selectedDept === 'ALL' || card.deptId === selectedDept;

    const matchesStatus =
      selectedStatus === 'ALL' || card.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'mcd-priority-critical';
      case 'High':
        return 'mcd-priority-high';
      case 'Medium':
        return 'mcd-priority-medium';
      default:
        return 'mcd-priority-normal';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Discussion':
        return 'mcd-status-discussion';
      case 'Resolved':
        return 'mcd-status-resolved';
      default:
        return 'mcd-status-open';
    }
  };

  return (
    <div className="mcd-host-system">
      {/* Enterprise Top Navbar */}
      <header className="mcd-host-header">
        <div className="mcd-host-branding">
          <div className="mcd-logo-badge">
            <Building2 size={22} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="mcd-host-title">Marca Coroma Industrial Portal</h1>
            <p className="mcd-host-subtitle">
              Enterprise Query Management & Discussion Engine
            </p>
          </div>
        </div>

        <div className="mcd-host-header-actions">
          {/* Centralized Launch Button */}
          <button
            type="button"
            className="mcd-launch-hub-btn"
            onClick={() => onOpenCentralWidget()}
            title="Open MCD Central Hub"
          >
            <MessageSquare size={18} className="mr-2" />
            <span>Open MCD Discussion Hub</span>
            <span className="mcd-hub-indicator" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mcd-host-content">
        {/* Banner with system injection info */}
        <div className="mcd-injection-banner">
          <div className="mcd-injection-banner-text">
            <h3>⚡ MCD (Marca Coroma Discussion) Injectable System</h3>
            <p>
              Har query card se <strong>"💬 Discuss in MCD"</strong> click karte hi us query ka 
              <strong> dedicated isolated room</strong> generate hota hai. Messages automatically sync 
              hote hain aur team real-time solve karti hai.
            </p>
          </div>
          <div className="mcd-dept-quick-pills">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">
              Quick Depts:
            </span>
            {MCD_DEPARTMENTS.slice(0, 4).map((d) => (
              <button
                key={d.id}
                onClick={() => onOpenDepartment(d.id)}
                className="mcd-dept-pill-btn"
                type="button"
              >
                <span>{d.icon}</span>
                <span>{d.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mcd-controls-row">
          <div className="mcd-search-wrap">
            <Search size={18} className="text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search query cards by ID, title, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mcd-search-input"
            />
          </div>

          <div className="mcd-filter-group">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="mcd-select"
            >
              <option value="ALL">All Departments</option>
              {MCD_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mcd-select"
            >
              <option value="ALL">All Status</option>
              <option value="Open">Open</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Query Cards Grid */}
        <div className="mcd-cards-grid">
          {filteredCards.map((card) => {
            const roomId = `query-${card.queryId}`;
            const messageCount = (allMessages[roomId] || []).length;
            const isCurrentlyActive = activeRoomId === roomId;

            return (
              <div
                key={card.queryId}
                className={`mcd-query-card ${isCurrentlyActive ? 'mcd-card-active-ring' : ''}`}
              >
                <div className="mcd-card-header">
                  <div className="mcd-card-id-tag">
                    <span className="font-mono font-bold">{card.queryId}</span>
                    <span className={`mcd-badge ${getPriorityClass(card.priority)}`}>
                      {card.priority}
                    </span>
                  </div>
                  <span className={`mcd-status-badge ${getStatusClass(card.status)}`}>
                    {card.status}
                  </span>
                </div>

                <h3 className="mcd-card-title">{card.title}</h3>
                <p className="mcd-card-desc">{card.description}</p>

                <div className="mcd-card-tags">
                  <span className="mcd-dept-tag">
                    <Layers size={13} className="mr-1 inline" />
                    {card.department}
                  </span>
                  {card.tags.map((t) => (
                    <span key={t} className="mcd-micro-tag">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="mcd-card-footer">
                  <div className="mcd-card-meta">
                    <span className="text-xs text-gray-400 block">
                      Raised by: <strong className="text-gray-300">{card.raisedBy}</strong>
                    </span>
                    <span className="text-xs text-gray-500">{card.date}</span>
                  </div>

                  {/* INJECTED BUTTON: Overrides general chat and opens this query's separate room */}
                  <button
                    type="button"
                    className="mcd-discuss-btn"
                    onClick={() => onOpenQueryRoom(card)}
                    title={`Open separate room for ${card.queryId}`}
                  >
                    <MessageSquare size={16} className="mr-1.5" />
                    <span>Discuss in MCD</span>
                    {messageCount > 0 && (
                      <span className="mcd-msg-count-pill">{messageCount}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCards.length === 0 && (
          <div className="mcd-empty-state">
            <p>No query cards match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryCardsDashboard;

