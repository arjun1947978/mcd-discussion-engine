import React, { useState } from 'react';
import {
  Search,
  Users,
  Building2,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Microscope,
  Wrench,
  CheckCheck,
  FolderTree
} from 'lucide-react';
import { MCD_DEPARTMENTS } from '../../data/departments';

export const Sidebar = ({
  activeRoomId,
  onSelectRoom,
  queryRoomsList = [],
  allMessages = {},
  activeTab: controlledTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState('departments'); // 'departments' | 'queries'
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const [search, setSearch] = useState('');

  const handleTabClick = (tab) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  // Expandable tree state for Query Systems:
  const [expandedSystems, setExpandedSystems] = useState({
    SALES: true,
    QCR: true,
    TOOLS: true,
    OPS: true,
    SCM: true,
    RND: true
  });

  const toggleSystemExpand = (sysKey) => {
    setExpandedSystems((prev) => ({
      ...prev,
      [sysKey]: !prev[sysKey]
    }));
  };

  // Group queries by their originating system
  const systemsData = [
    {
      key: 'SALES',
      name: 'Sales CRM System',
      icon: ShoppingBag,
      color: '#db2777',
      code: 'SALES',
      queries: queryRoomsList.filter(
        (q) =>
          q.queryId.startsWith('SALES') ||
          q.department?.toLowerCase().includes('sales')
      )
    },
    {
      key: 'QCR',
      name: 'QCR Quality Inspection',
      icon: Microscope,
      color: '#ea580c',
      code: 'QCR',
      queries: queryRoomsList.filter(
        (q) =>
          q.queryId.startsWith('QCR') ||
          q.department?.toLowerCase().includes('quality') ||
          q.department?.toLowerCase().includes('qcr')
      )
    },
    {
      key: 'TOOLS',
      name: 'Tools & Plant Engineering',
      icon: Wrench,
      color: '#0284c7',
      code: 'TOOLS',
      queries: queryRoomsList.filter(
        (q) =>
          q.queryId.startsWith('TOOL') ||
          q.queryId === 'MCD-Q101' ||
          q.queryId === 'MCD-Q106' ||
          q.department?.toLowerCase().includes('tool') ||
          q.department?.toLowerCase().includes('machinery')
      )
    },
    {
      key: 'OPS',
      name: 'Plant Operations & Assembly',
      icon: Building2,
      color: '#10b981',
      code: 'OPS',
      queries: queryRoomsList.filter(
        (q) =>
          q.queryId.startsWith('OPS') ||
          q.department?.toLowerCase().includes('operation')
      )
    },
    {
      key: 'SCM',
      name: 'Supply Chain & Logistics',
      icon: Building2,
      color: '#0d9488',
      code: 'SCM',
      queries: queryRoomsList.filter(
        (q) =>
          q.queryId.startsWith('SCM') ||
          q.queryId === 'MCD-Q103' ||
          q.department?.toLowerCase().includes('supply') ||
          q.department?.toLowerCase().includes('logistics')
      )
    },
    {
      key: 'RND',
      name: 'R&D Materials & Testing',
      icon: Microscope,
      color: '#8b5cf6',
      code: 'RND',
      queries: queryRoomsList.filter(
        (q) =>
          q.queryId.startsWith('RND') ||
          q.queryId === 'MCD-Q102' ||
          q.queryId === 'MCD-Q107' ||
          q.department?.toLowerCase().includes('r&d') ||
          (!q.queryId.startsWith('SALES') &&
            !q.queryId.startsWith('QCR') &&
            !q.queryId.startsWith('TOOL') &&
            !q.queryId.startsWith('OPS') &&
            !q.queryId.startsWith('SCM'))
      )
    }
  ];

  // Filtered departments
  const filteredDepts = MCD_DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  const getPriorityBadgeClass = (priority = '') => {
    const p = priority.toLowerCase();
    if (p.includes('critical')) return 'mcd-p-critical';
    if (p.includes('high') || p.includes('quarantine')) return 'mcd-p-high';
    return 'mcd-p-normal';
  };

  return (
    <aside className="wa-sidebar">
      {/* Brand Header */}
      <div className="wa-sidebar-header">
        <div className="wa-sidebar-user">
          <div className="mcd-sidebar-logo">
            <Building2 size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="wa-sidebar-username">MCD Discussion</span>
            <span className="wa-sidebar-brand-sub">Marca Coroma Enterprise</span>
          </div>
        </div>
      </div>

      {/* Navigation Mode Tabs: Departments vs Query Tree */}
      <div className="mcd-sidebar-nav-tabs">
        <button
          type="button"
          className={`mcd-nav-tab ${activeTab === 'departments' ? 'mcd-nav-tab-active' : ''}`}
          onClick={() => handleTabClick('departments')}
        >
          <Users size={16} className="mr-1.5 inline" />
          <span>Departments</span>
          <span className="mcd-tab-badge">{MCD_DEPARTMENTS.length}</span>
        </button>

        <button
          type="button"
          className={`mcd-nav-tab ${activeTab === 'queries' ? 'mcd-nav-tab-active' : ''}`}
          onClick={() => handleTabClick('queries')}
        >
          <FolderTree size={16} className="mr-1.5 inline" />
          <span>Query Tree</span>
          <span className="mcd-tab-badge mcd-tab-badge-accent">
            {queryRoomsList.length}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="wa-sidebar-search-container">
        <div className="wa-search-bar">
          <Search size={15} className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder={
              activeTab === 'departments'
                ? 'Search departments...'
                : 'Search queries or systems...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="wa-search-input"
          />
        </div>
      </div>

      {/* List Scroll */}
      <div className="wa-chat-list-scroll">
        {activeTab === 'departments' ? (
          /* ==========================================================
             1. DEPARTMENTS TAB
             ========================================================== */
          filteredDepts.map((dept) => {
            const isActive = activeRoomId === dept.id;
            const messages = allMessages[dept.id] || [];
            const lastMsg =
              messages.length > 0
                ? messages[messages.length - 1]
                : { text: dept.lastMessage, date: new Date() };

            return (
              <div
                key={dept.id}
                className={`wa-chat-item ${isActive ? 'wa-chat-item-active' : ''}`}
                onClick={() => onSelectRoom(dept.id, 'department', dept)}
              >
                <div
                  className="mcd-dept-avatar"
                  style={{ backgroundColor: dept.color }}
                >
                  <span className="text-lg">{dept.icon}</span>
                </div>

                <div className="wa-chat-item-body">
                  <div className="wa-chat-item-top">
                    <span className="wa-chat-item-name">{dept.name}</span>
                    <span className="wa-chat-item-time">
                      {dept.lastMessageTime || 'Online'}
                    </span>
                  </div>

                  <div className="wa-chat-item-bottom">
                    <p className="wa-chat-item-preview">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 mr-1">
                        [{dept.code}]:
                      </span>
                      {lastMsg.text || dept.description}
                    </p>

                    <div className="wa-chat-item-meta">
                      <span className="mcd-members-badge">
                        {dept.membersCount} mbrs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* ==========================================================
             2. QUERY ROOMS TREE (Modern Card-Type Tiles, Normal Height)
             ========================================================== */
          <div className="mcd-query-tree-wrapper">
            {systemsData.map((system) => {
              const isExpanded = expandedSystems[system.key];
              const SysIcon = system.icon;

              const filteredQueries = system.queries.filter(
                (q) =>
                  q.title.toLowerCase().includes(search.toLowerCase()) ||
                  q.queryId.toLowerCase().includes(search.toLowerCase()) ||
                  system.name.toLowerCase().includes(search.toLowerCase())
              );

              return (
                <div key={system.key} className="mcd-tree-system-node">
                  {/* System Header (Click expands / collapses) */}
                  <div
                    className={`mcd-tree-system-header ${isExpanded ? 'mcd-tree-system-open' : ''}`}
                    onClick={() => toggleSystemExpand(system.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="mcd-tree-chevron">
                        {isExpanded ? (
                          <ChevronDown size={15} />
                        ) : (
                          <ChevronRight size={15} />
                        )}
                      </span>
                      <div
                        className="mcd-system-icon-badge"
                        style={{ backgroundColor: system.color }}
                      >
                        <SysIcon size={13} className="text-white" />
                      </div>
                      <span className="mcd-tree-system-name font-semibold text-xs">
                        {system.name}
                      </span>
                    </div>

                    <span className="mcd-system-count-pill">
                      {filteredQueries.length}
                    </span>
                  </div>

                  {/* Expanded Query Cards (Same height as normal department items!) */}
                  {isExpanded && (
                    <div className="mcd-tree-cards-container">
                      {filteredQueries.map((query) => {
                        const roomId = `query-${query.queryId}`;
                        const isActive = activeRoomId === roomId;
                        const messages = allMessages[roomId] || [];
                        const lastMsg =
                          messages.length > 0
                            ? messages[messages.length - 1]
                            : null;

                        return (
                          <div
                            key={query.queryId}
                            className={`mcd-query-modern-card ${
                              isActive ? 'mcd-query-card-active' : ''
                            }`}
                            onClick={() => onSelectRoom(roomId, 'query', query)}
                            title={query.title}
                          >
                            {/* Card Top: Query ID + Priority Badge */}
                            <div className="mcd-qcard-top">
                              <span className="mcd-qcard-id font-mono">
                                {query.queryId}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {query.priority && (
                                  <span
                                    className={`mcd-qcard-priority ${getPriorityBadgeClass(
                                      query.priority
                                    )}`}
                                  >
                                    {query.priority}
                                  </span>
                                )}
                                <span className="mcd-qcard-status">
                                  {query.status || 'Active'}
                                </span>
                              </div>
                            </div>

                            {/* Card Middle: Single-line Title */}
                            <h4 className="mcd-qcard-title truncate">
                              {query.title}
                            </h4>

                            {/* Card Bottom: Single-line Last Message Snippet */}
                            <p className="mcd-qcard-snippet truncate">
                              {lastMsg ? (
                                <>
                                  <CheckCheck
                                    size={13}
                                    className="text-blue-500 mr-1 inline"
                                  />
                                  {lastMsg.text}
                                </>
                              ) : (
                                query.description
                              )}
                            </p>
                          </div>
                        );
                      })}

                      {filteredQueries.length === 0 && (
                        <div className="mcd-tree-empty-branch">
                          <span>No queries currently in this system</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
