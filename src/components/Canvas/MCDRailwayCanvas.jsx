import React, { useEffect, useRef, useState } from 'react';
import {
  Users,
  Sun,
  Moon,
  ArrowLeft,
  Wrench,
  Microscope,
  ShoppingBag,
  Building2,
  Factory,
  CreditCard,
  ExternalLink,
  Radio,
  Cpu,
  FolderTree,
  Tag,
  AlertCircle,
  Truck
} from 'lucide-react';
import { MCD_DEPARTMENTS } from '../../data/departments';

// Department Service Nodes
const DEPT_SERVICES = [
  {
    id: 'dept-tools',
    key: 'TOOLS',
    name: 'Tools & Machinery',
    service: 'Tooling & Plant Support',
    icon: Wrench,
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.4)',
    status: 'Operational',
    latency: '18ms',
    uptime: '99.98%',
    members: '14 mbrs',
    queries: '5 active',
    pos: { xRel: -0.29, yRel: -0.16 }
  },
  {
    id: 'dept-rnd',
    key: 'RND',
    name: 'R&D (Research & Dev)',
    service: 'Materials Lab',
    icon: Microscope,
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.4)',
    status: 'Operational',
    latency: '24ms',
    uptime: '99.95%',
    members: '18 mbrs',
    queries: '2 active',
    pos: { xRel: 0.29, yRel: -0.16 }
  },
  {
    id: 'dept-sales',
    key: 'SALES',
    name: 'Sales & Marketing',
    service: 'CRM Injected Hub',
    icon: ShoppingBag,
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.4)',
    status: 'Live Sync',
    latency: '12ms',
    uptime: '100%',
    members: '22 mbrs',
    queries: '7 active',
    pos: { xRel: -0.29, yRel: 0.16 }
  },
  {
    id: 'dept-operations',
    key: 'OPS',
    name: 'Plant Operations',
    service: 'Assembly Lines',
    icon: Factory,
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    status: 'Active',
    latency: '31ms',
    uptime: '99.99%',
    members: '30 mbrs',
    queries: '2 active',
    pos: { xRel: 0.29, yRel: 0.16 }
  },
  {
    id: 'dept-accounts',
    key: 'ACC',
    name: 'Accounts & Finance',
    service: 'Billing Ledger',
    icon: CreditCard,
    color: '#0d9488',
    glow: 'rgba(13, 148, 136, 0.4)',
    status: 'Standby',
    latency: '15ms',
    uptime: '99.9%',
    members: '9 mbrs',
    queries: '1 active',
    pos: { xRel: 0.0, yRel: 0.23 }
  },
  {
    id: 'dept-admin',
    key: 'ADMIN',
    name: 'Administration & HR',
    service: 'Facility & Personnel',
    icon: Building2,
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.4)',
    status: 'Online',
    latency: '22ms',
    uptime: '99.94%',
    members: '12 mbrs',
    queries: '0 active',
    pos: { xRel: 0.0, yRel: -0.23 }
  }
];

// Query Architecture Mesh Clusters
const QUERY_CLUSTERS = [
  {
    id: 'cluster-sales',
    systemKey: 'SALES',
    name: 'Sales CRM Ingestion Hub',
    service: 'Export & Commercial Inquiries',
    icon: ShoppingBag,
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.4)',
    status: '7 Queries Live',
    prefix: 'SALES',
    sampleQueryId: 'SALES-Q201',
    pos: { xRel: -0.29, yRel: -0.16 }
  },
  {
    id: 'cluster-qcr',
    systemKey: 'QCR',
    name: 'QCR Quality Inspection & Quarantine',
    service: 'MFI & CMM Dimension Validation',
    icon: AlertCircle,
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.4)',
    status: '7 Queries Live',
    prefix: 'QCR',
    sampleQueryId: 'QCR-Q301',
    pos: { xRel: 0.29, yRel: -0.16 }
  },
  {
    id: 'cluster-tools',
    systemKey: 'TOOLS',
    name: 'Tools & Machinery Diagnostics',
    service: 'CNC Spindles & Mould Hydraulics',
    icon: Wrench,
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.4)',
    status: '5 Queries Live',
    prefix: 'TOOL',
    sampleQueryId: 'TOOLS-Q103',
    pos: { xRel: -0.29, yRel: 0.16 }
  },
  {
    id: 'cluster-ops',
    systemKey: 'OPS',
    name: 'Plant Operations & Shopfloor',
    service: 'Cycle Time & Extrusion Lines',
    icon: Factory,
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    status: '2 Queries Live',
    prefix: 'OPS',
    sampleQueryId: 'OPS-Q401',
    pos: { xRel: 0.29, yRel: 0.16 }
  },
  {
    id: 'cluster-scm',
    systemKey: 'SCM',
    name: 'Supply Chain & Logistics',
    service: 'Corrugated 5-Ply & Pallet SLA',
    icon: Truck,
    color: '#0d9488',
    glow: 'rgba(13, 148, 136, 0.4)',
    status: '2 Queries Live',
    prefix: 'SCM',
    sampleQueryId: 'SCM-Q501',
    pos: { xRel: 0.0, yRel: 0.23 }
  },
  {
    id: 'cluster-rnd',
    systemKey: 'RND',
    name: 'R&D Materials & Stress Lab',
    service: 'Tensile & Polymer Analytics',
    icon: Microscope,
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.4)',
    status: '2 Queries Live',
    prefix: 'RND',
    sampleQueryId: 'MCD-Q102',
    pos: { xRel: 0.0, yRel: -0.23 }
  }
];

export const MCDRailwayCanvas = ({
  theme,
  onToggleTheme,
  showMembersPanel,
  onToggleMembers,
  onSelectDepartment,
  onSelectQuery,
  onOpenSidebar,
  activeTab: controlledTab,
  onTabChange,
  queryRoomsList = []
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [internalMode, setInternalMode] = useState('departments');
  const viewMode = controlledTab !== undefined ? controlledTab : internalMode;

  const handleToggleMode = (mode) => {
    if (onTabChange) onTabChange(mode);
    setInternalMode(mode);
  };

  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });

  const activeNodes = viewMode === 'queries' ? QUERY_CLUSTERS : DEPT_SERVICES;

  // Canvas particle / animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Dynamic packets moving along routes
    const packets = [];
    for (let i = 0; i < 24; i++) {
      packets.push({
        targetIndex: i % activeNodes.length,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        outward: i % 2 === 0,
        size: 2 + Math.random() * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      const width = containerRef.current ? containerRef.current.clientWidth : 800;
      const height = containerRef.current ? containerRef.current.clientHeight : 600;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Dot Grid (Railway / Linear Canvas Grid)
      const dotSpacing = 32;
      const dotColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)';
      const activeDotColor = isDark ? 'rgba(0, 168, 132, 0.35)' : 'rgba(0, 168, 132, 0.3)';

      ctx.fillStyle = dotColor;
      for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
        for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
          const dx = mousePos.x - x;
          const dy = mousePos.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.fillStyle = activeDotColor;
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = dotColor;
          } else {
            ctx.beginPath();
            ctx.arc(x, y, 1.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 2. Draw Central Concentric Radar / Wave Ripples
      const hubAccent = viewMode === 'queries' ? 'rgba(219, 39, 119, ' : 'rgba(0, 168, 132, ';
      for (let r = 1; r <= 3; r++) {
        const radius = 55 + r * 30 + Math.sin(time + r) * 4;
        ctx.strokeStyle = `${hubAccent}${0.16 / r})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 3. Draw Connecting Circuit / Bus Lines to Services
      activeNodes.forEach((srv) => {
        const nodeX = centerX + srv.pos.xRel * width;
        const nodeY = centerY + srv.pos.yRel * height;

        const cpX = (centerX + nodeX) / 2;
        const cpY = centerY;

        ctx.strokeStyle = isDark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.quadraticCurveTo(cpX, cpY, nodeX, nodeY);
        ctx.stroke();
      });

      // 4. Draw Animated Data Packets (Glowing Light Particles)
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.targetIndex = Math.floor(Math.random() * activeNodes.length);
        }

        const srv = activeNodes[p.targetIndex] || activeNodes[0];
        const nodeX = centerX + srv.pos.xRel * width;
        const nodeY = centerY + srv.pos.yRel * height;
        const cpX = (centerX + nodeX) / 2;
        const cpY = centerY;

        const tProg = p.outward ? p.progress : 1 - p.progress;
        const curX =
          (1 - tProg) * (1 - tProg) * centerX +
          2 * (1 - tProg) * tProg * cpX +
          tProg * tProg * nodeX;
        const curY =
          (1 - tProg) * (1 - tProg) * centerY +
          2 * (1 - tProg) * tProg * cpY +
          tProg * tProg * nodeY;

        ctx.fillStyle = srv.color;
        ctx.shadowColor = srv.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 5. Draw Central Gateway Hub
      const hubGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        42
      );
      if (viewMode === 'queries') {
        hubGrad.addColorStop(0, isDark ? '#831843' : '#db2777');
        hubGrad.addColorStop(1, isDark ? '#0b141a' : '#9d174d');
      } else {
        hubGrad.addColorStop(0, isDark ? '#005c4b' : '#00a884');
        hubGrad.addColorStop(1, isDark ? '#0b141a' : '#02906f');
      }

      ctx.fillStyle = hubGrad;
      ctx.shadowColor = viewMode === 'queries' ? '#db2777' : '#00a884';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [theme, mousePos, activeNodes, viewMode]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -999, y: -999 });
  };

  const findDept = (deptId) => {
    return MCD_DEPARTMENTS.find((d) => d.id === deptId) || MCD_DEPARTMENTS[0];
  };

  // Get queries belonging to a specific cluster
  const getClusterQueries = (cluster) => {
    return queryRoomsList.filter((q) => {
      if (cluster.systemKey === 'SALES') {
        return (
          q.queryId.startsWith('SALES') ||
          q.department?.toLowerCase().includes('sales')
        );
      }
      if (cluster.systemKey === 'QCR') {
        return (
          q.queryId.startsWith('QCR') ||
          q.department?.toLowerCase().includes('quality') ||
          q.department?.toLowerCase().includes('qcr')
        );
      }
      if (cluster.systemKey === 'TOOLS') {
        return (
          q.queryId.startsWith('TOOL') ||
          q.queryId === 'MCD-Q101' ||
          q.queryId === 'MCD-Q106' ||
          q.department?.toLowerCase().includes('tool') ||
          q.department?.toLowerCase().includes('machinery')
        );
      }
      if (cluster.systemKey === 'OPS') {
        return (
          q.queryId.startsWith('OPS') ||
          q.department?.toLowerCase().includes('operation')
        );
      }
      if (cluster.systemKey === 'SCM') {
        return (
          q.queryId.startsWith('SCM') ||
          q.queryId === 'MCD-Q103' ||
          q.department?.toLowerCase().includes('supply') ||
          q.department?.toLowerCase().includes('logistics')
        );
      }
      if (cluster.systemKey === 'RND') {
        return (
          q.queryId.startsWith('RND') ||
          q.queryId === 'MCD-Q102' ||
          q.queryId === 'MCD-Q107' ||
          q.department?.toLowerCase().includes('r&d') ||
          (!q.queryId.startsWith('SALES') &&
            !q.queryId.startsWith('QCR') &&
            !q.queryId.startsWith('TOOL') &&
            !q.queryId.startsWith('OPS') &&
            !q.queryId.startsWith('SCM'))
        );
      }
      return false;
    });
  };

  const handleNodeClick = (node) => {
    if (viewMode === 'queries') {
      const clusterQueries = getClusterQueries(node);
      const targetQuery = clusterQueries[0] || {
        queryId: node.sampleQueryId,
        title: node.name,
        department: node.name,
        raisedBy: 'Lead',
        priority: 'High',
        status: 'In Discussion'
      };
      if (onSelectQuery) onSelectQuery(targetQuery);
    } else {
      if (onSelectDepartment) onSelectDepartment(node.id, findDept(node.id));
    }
  };

  return (
    <div
      ref={containerRef}
      className="mcd-railway-canvas-root"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="mcd-railway-canvas" />

      {/* TOP CONTROL BAR (Navigation, Mode Switcher, Members & Theme) */}
      <div className="mcd-canvas-topbar">
        <div className="flex items-center gap-2">
          {/* Mobile Back / Show Groups button */}
          <button
            type="button"
            className="mcd-canvas-back-btn"
            onClick={onOpenSidebar}
            title="Open Discussions & Query Tree"
          >
            <ArrowLeft size={18} />
            <span>Discussions & Queries</span>
          </button>

          {/* Mode Switcher Pill */}
          <div className="mcd-canvas-mode-switcher">
            <button
              type="button"
              className={`mcd-mode-pill-btn ${viewMode === 'departments' ? 'is-active' : ''}`}
              onClick={() => handleToggleMode('departments')}
            >
              <Users size={14} className="mr-1" />
              <span>Departments Mesh</span>
              <span className="mcd-mode-count">{MCD_DEPARTMENTS.length}</span>
            </button>
            <button
              type="button"
              className={`mcd-mode-pill-btn ${viewMode === 'queries' ? 'is-active' : ''}`}
              onClick={() => handleToggleMode('queries')}
            >
              <FolderTree size={14} className="mr-1" />
              <span>Query Systems Mesh</span>
              <span className="mcd-mode-count mcd-mode-count-accent">
                {queryRoomsList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Right Action Tools: Members & Theme */}
        <div className="flex items-center gap-2">
          {/* Toggle Organization Members Panel */}
          <button
            type="button"
            className={`mcd-canvas-action-btn ${showMembersPanel ? 'mcd-btn-active' : ''}`}
            onClick={onToggleMembers}
            title={showMembersPanel ? 'Hide Organization Members' : 'Show Organization Members'}
          >
            <Users size={18} />
            <span className="hidden md:inline text-xs font-semibold ml-1.5">
              Members
            </span>
          </button>

          {/* Theme Toggle (Sun / Moon) */}
          <button
            type="button"
            className="mcd-canvas-action-btn wa-theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* CENTRAL GATEWAY LABEL OVERLAY */}
      <div className="mcd-center-gateway-overlay">
        <div className="mcd-gateway-badge">
          <Cpu
            size={16}
            className={viewMode === 'queries' ? 'text-pink-400 animate-pulse' : 'text-emerald-400 animate-pulse'}
          />
          <span>
            {viewMode === 'queries'
              ? 'MCD Query Dispatch & Resolution Engine'
              : 'MCD Enterprise Collaboration Gateway'}
          </span>
        </div>
      </div>

      {/* INTERACTIVE NODES (Departments or Query Clusters) */}
      {activeNodes.map((srv) => {
        const Icon = srv.icon;
        const isHovered = hoveredNode === srv.id;
        const clusterQueries = viewMode === 'queries' ? getClusterQueries(srv) : [];

        return (
          <div
            key={srv.id}
            className={`mcd-canvas-node-card ${isHovered ? 'is-hovered' : ''}`}
            style={{
              left: `calc(50% + ${srv.pos.xRel * 100}%)`,
              top: `calc(50% + ${srv.pos.yRel * 100}%)`,
              '--node-color': srv.color
            }}
            onMouseEnter={() => setHoveredNode(srv.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(srv)}
            role="button"
            tabIndex={0}
          >
            {/* Card Header: Icon + Name */}
            <div className="mcd-node-header">
              <div
                className="mcd-node-icon-box"
                style={{ backgroundColor: srv.color }}
              >
                <Icon size={16} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mcd-node-title truncate">{srv.name}</h4>
                <span className="mcd-node-subtitle truncate">{srv.service}</span>
              </div>
              <span className="mcd-node-status-dot" />
            </div>

            {/* In Query View: Show Live Query Pills with Priority */}
            {viewMode === 'queries' ? (
              <div className="mcd-node-queries-preview">
                <div className="mcd-node-stats-row mb-1.5">
                  <span className="mcd-node-pill mcd-node-pill-green font-semibold">
                    {clusterQueries.length} Queries
                  </span>
                  <span className="mcd-node-pill text-xs">
                    {srv.prefix} Systems
                  </span>
                </div>
                {clusterQueries.slice(0, 2).map((q) => (
                  <div
                    key={q.queryId}
                    className="mcd-canvas-mini-query-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectQuery) onSelectQuery(q);
                    }}
                    title={`Open ${q.queryId}: ${q.title}`}
                  >
                    <span className="mcd-query-badge-code">
                      {q.queryId}
                    </span>
                    <span className="mcd-query-badge-title truncate">
                      {q.title}
                    </span>
                    <span
                      className={`mcd-mini-priority-badge ${
                        (q.priority || '').toLowerCase().includes('critical')
                          ? 'is-critical'
                          : ''
                      }`}
                    >
                      {q.status || 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* In Department View: Show Railway Stats */
              <div className="mcd-node-stats-row">
                <span className="mcd-node-pill">{srv.members}</span>
                <span className="mcd-node-pill">{srv.latency}</span>
                <span className="mcd-node-pill mcd-node-pill-green">
                  {srv.uptime}
                </span>
              </div>
            )}

            {/* Hover Action Link */}
            <div className="mcd-node-hover-action">
              <span>
                {viewMode === 'queries' ? 'Explore Query Room' : 'Open Department'}
              </span>
              <ExternalLink size={12} />
            </div>
          </div>
        );
      })}

      {/* FLOATING GLASS FOOTER BAR */}
      <div className="mcd-canvas-footer-bar">
        <div className="flex items-center gap-2">
          <div className="mcd-footer-status-pill">
            <Radio size={14} className="text-emerald-500 animate-pulse" />
            <span>
              {viewMode === 'queries'
                ? 'Query Dispatch Live'
                : 'BroadcastChannel Live'}
            </span>
          </div>
          <span className="text-gray-400 mx-2 hidden sm:inline">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
            {viewMode === 'queries'
              ? 'Click any query cluster to jump into live engineering resolution'
              : 'Click any department node or select from sidebar'}
          </span>
        </div>

        {/* Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {viewMode === 'queries'
            ? queryRoomsList.slice(0, 5).map((q) => (
                <button
                  key={q.queryId}
                  type="button"
                  className="mcd-quick-node-chip"
                  onClick={() => onSelectQuery && onSelectQuery(q)}
                  title={q.title}
                >
                  <Tag size={12} className="text-pink-500" />
                  <span className="font-semibold">{q.queryId}</span>
                </button>
              ))
            : MCD_DEPARTMENTS.slice(0, 5).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="mcd-quick-node-chip"
                  onClick={() => onSelectDepartment(d.id, d)}
                >
                  <span>{d.icon}</span>
                  <span>{d.code}</span>
                </button>
              ))}
        </div>
      </div>
    </div>
  );
};

export default MCDRailwayCanvas;
