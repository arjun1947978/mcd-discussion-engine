import React from 'react';
import {
  MessageSquare,
  ShoppingBag,
  Microscope,
  Columns,
  Sparkles,
  Layers
} from 'lucide-react';

export const SystemSimulatorBar = ({ currentView, onViewChange, stats }) => {
  return (
    <nav className="mcd-simulator-bar">
      <div className="mcd-sim-left">
        <div className="mcd-sim-brand">
          <span className="font-extrabold tracking-wider text-emerald-400">MCD</span>
          <span className="text-xs text-gray-400 ml-1 hidden sm:inline">
            (Marca Coroma Discussion Engine)
          </span>
        </div>
      </div>

      {/* Switcher Modes */}
      <div className="mcd-sim-center">
        <button
          type="button"
          className={`mcd-mode-pill ${currentView === 'mcd-standalone' ? 'mcd-mode-active' : ''}`}
          onClick={() => onViewChange('mcd-standalone')}
          title="Direct MCD WhatsApp Chat (Default Main App)"
        >
          <MessageSquare size={15} className="mr-1.5" />
          <span>MCD Standalone Chat</span>
          <span className="mcd-badge-count">{stats.totalMessages}</span>
        </button>

        <button
          type="button"
          className={`mcd-mode-pill ${currentView === 'sales-system' ? 'mcd-mode-active' : ''}`}
          onClick={() => onViewChange('sales-system')}
          title="Injected in Sales CRM System (sales.ui & sales.js)"
        >
          <ShoppingBag size={15} className="mr-1.5" />
          <span>Injected: Sales Portal</span>
        </button>

        <button
          type="button"
          className={`mcd-mode-pill ${currentView === 'qcr-system' ? 'mcd-mode-active' : ''}`}
          onClick={() => onViewChange('qcr-system')}
          title="Injected in QCR Quality Control (qcr.ui & qcr.js)"
        >
          <Microscope size={15} className="mr-1.5" />
          <span>Injected: QCR Quality</span>
        </button>

        <button
          type="button"
          className={`mcd-mode-pill mcd-mode-split ${
            currentView === 'split-sync' ? 'mcd-mode-active' : ''
          }`}
          onClick={() => onViewChange('split-sync')}
          title="Test real-time 2-way sync: Sales Injected System & MCD Standalone side-by-side!"
        >
          <Columns size={15} className="mr-1.5 text-amber-400" />
          <span>Live 2-Way Sync Test</span>
        </button>
      </div>

      <div className="mcd-sim-right">
        <div className="flex items-center text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
          <span>Sync Active</span>
        </div>
      </div>
    </nav>
  );
};

export default SystemSimulatorBar;

