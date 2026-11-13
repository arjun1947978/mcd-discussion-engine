import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'react-chat-elements/dist/main.css';
import './App.css';

import { MCD_DEPARTMENTS } from './data/departments';
import { MOCK_QUERY_CARDS } from './data/mockQueries';
import {
  loadAllRoomMessages,
  saveAllRoomMessages
} from './data/roomStore';
import { generateOlderHistoryBatch } from './data/initialMessages';
import { mcdSync } from './sync/mcdSyncEngine';
import { getMembersForRoom } from './data/roomMembers';

import Sidebar from './components/Sidebar/Sidebar';
import MembersPanel from './components/Sidebar/MembersPanel';
import ChatHeader from './components/Chat/ChatHeader';
import ChatArea from './components/Chat/ChatArea';
import ChatFooter from './components/Chat/ChatFooter';
import MediaViewerModal from './components/Modals/MediaViewerModal';
import Toast from './components/Common/Toast';
import MCDRailwayCanvas from './components/Canvas/MCDRailwayCanvas';
import { MessageSquare, Shield, Building2 } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState('light');

  // Master message store across all departments & query rooms
  const [roomMessages, setRoomMessages] = useState(() => loadAllRoomMessages());

  // Active room state: default to Tools Department
  const [activeRoomId, setActiveRoomId] = useState('dept-tools');
  const [activeRoomContext, setActiveRoomContext] = useState({
    type: 'department',
    id: 'dept-tools',
    data: MCD_DEPARTMENTS[0]
  });

  // Desktop Members Panel toggle (shown between sidebar and chat or collapsible)
  const [showMembersPanel, setShowMembersPanel] = useState(true);

  // Mobile Members Sheet modal toggle
  const [mobileMembersModal, setMobileMembersModal] = useState(false);

  // Query rooms list grouped by systems (25 realistic enterprise queries)
  const [queryRoomsList, setQueryRoomsList] = useState(() => {
    return [
      ...MOCK_QUERY_CARDS.slice(0, 3),
      {
        queryId: 'SALES-Q201',
        title: 'Bulk Export Order Discount Authorization (Zenith Corp)',
        department: 'Sales & Marketing',
        raisedBy: 'Pooja Varma',
        priority: 'Critical',
        status: 'In Discussion',
        description: 'Client requesting 8.5% volume discount for 50,000 units quarterly contract.'
      },
      {
        queryId: 'SALES-Q202',
        title: 'Dispatch Timeline Expedited for 1200 Poly Plugs',
        department: 'Sales & Marketing',
        raisedBy: 'Pooja Varma',
        priority: 'High',
        status: 'Open',
        description: 'Customer plant shutdown next week, requires dispatch by Thursday.'
      },
      {
        queryId: 'SALES-Q203',
        title: 'Custom Packaging & Barcode Labeling Verification',
        department: 'Sales & Marketing',
        raisedBy: 'Amit Khanna',
        priority: 'Medium',
        status: 'Open',
        description: 'Customer requires thermal transfer QR code labels on each carton.'
      },
      {
        queryId: 'SALES-Q204',
        title: 'North America Distributor Credit Limit Extension ($250k)',
        department: 'Sales & Marketing',
        raisedBy: 'Pooja Varma',
        priority: 'High',
        status: 'Open',
        description: 'Distributor requests credit line bump from $150k to $250k before peak season orders.'
      },
      {
        queryId: 'SALES-Q205',
        title: 'Annual Price Indexation for Automotive Mouldings',
        department: 'Sales & Marketing',
        raisedBy: 'Amit Khanna',
        priority: 'Medium',
        status: 'In Discussion',
        description: 'Contract clause 14 review with Tier-1 automotive client based on polymer crude prices.'
      },
      {
        queryId: 'SALES-Q206',
        title: 'OEM Tooling Amortization Schedule Review',
        department: 'Sales & Marketing',
        raisedBy: 'Neha Sharma',
        priority: 'High',
        status: 'In Discussion',
        description: 'Tool amortized over first 200k shots; current run reached 185k shots.'
      },
      {
        queryId: 'SALES-Q207',
        title: 'Export Ocean Freight Surcharge Discrepancy (Hamburg Port)',
        department: 'Sales & Marketing',
        raisedBy: 'Pooja Varma',
        priority: 'Low',
        status: 'Open',
        description: 'Forwarder billed peak season surcharge not aligned with master shipping rate agreement.'
      },
      {
        queryId: 'QCR-Q301',
        title: 'Polymer Injection Sink Marks on Bezel Batch #991',
        department: 'Quality & Inspection (QCR)',
        raisedBy: 'Kailash Mehta',
        priority: 'Critical Reject',
        status: 'In Discussion',
        description: 'Sink depth measured 0.45mm on critical cosmetic face.'
      },
      {
        queryId: 'QCR-Q302',
        title: 'Polycarbonate Resin MFI Variance Detected (Batch #940)',
        department: 'Quality & Inspection (QCR)',
        raisedBy: 'Dr. Kabir Sen',
        priority: 'Quarantine',
        status: 'Open',
        description: 'Supplier Certificate states MFI 10.5 g/10min, lab testing shows 14.2 g/10min.'
      },
      {
        queryId: 'QCR-Q303',
        title: 'Ultrasonic Horn Amplitude Calibration Variance',
        department: 'Quality & Inspection (QCR)',
        raisedBy: 'Kailash Mehta',
        priority: 'Minor Deviation',
        status: 'Open',
        description: 'Burst test achieved 18 bar vs specified 22 bar.'
      },
      {
        queryId: 'QCR-Q304',
        title: 'Melt Flow Index (MFI) Test Deviation on Resin Batch #882',
        department: 'Quality & Inspection (QCR)',
        raisedBy: 'Kailash Mehta',
        priority: 'Critical Reject',
        status: 'Open',
        description: 'Batch #882 resin viscosity deviation affecting thin-wall moulding cycle times.'
      },
      {
        queryId: 'QCR-Q305',
        title: 'CMM Dimensional Inspection Failure on Thread Pitch M12',
        department: 'Quality & Inspection (QCR)',
        raisedBy: 'Dr. Kabir Sen',
        priority: 'High',
        status: 'In Discussion',
        description: 'Coordinate Measuring Machine shows thread pitch deviation of +0.08mm outside ISO standard.'
      },
      {
        queryId: 'QCR-Q306',
        title: 'Color Spectrophotometer Delta-E Exceeding 1.2 on Pearl White',
        department: 'Quality & Inspection (QCR)',
        raisedBy: 'Kailash Mehta',
        priority: 'Minor Deviation',
        status: 'Open',
        description: 'Master plaque comparison shows Delta-E of 1.48 under D65 daylight illuminant.'
      },
      {
        queryId: 'QCR-Q307',
        title: 'Incoming Raw Material Certificate of Analysis (CoA) Missing',
        department: 'Quality & Inspection (QCR)',
        raisedBy: 'Sunita Mehra',
        priority: 'Quarantine',
        status: 'Open',
        description: 'Unloaded 18 metric tons of ABS granules without batch analysis report from supplier.'
      },
      {
        queryId: 'TOOLS-Q103',
        title: 'EDM Wire Cut Electrode Wear Exceeding Tolerance Limit',
        department: 'Tools & Machinery',
        raisedBy: 'Vikram Sharma',
        priority: 'Critical',
        status: 'In Discussion',
        description: 'Brass wire guide groove worn out causing spark gap variance on cavity inserts.'
      },
      {
        queryId: 'TOOLS-Q104',
        title: 'Hydraulic Ram Pressure Fluctuation on 450T Injection Press',
        department: 'Tools & Machinery',
        raisedBy: 'Ramesh Patel',
        priority: 'High',
        status: 'Open',
        description: 'Proportional valve hunting observed during high pressure clamping phase.'
      },
      {
        queryId: 'TOOLS-Q105',
        title: 'Preventive Core Pin Replacement Schedule for Mould B-12',
        department: 'Tools & Machinery',
        raisedBy: 'Vikram Sharma',
        priority: 'Medium',
        status: 'Open',
        description: 'Shot counter passed 250,000 cycles; scheduled replacement of beryllium copper pins.'
      },
      {
        queryId: 'TOOLS-Q106',
        title: 'Chiller Coolant Temperature Spike to 28°C on Line 3',
        department: 'Tools & Machinery',
        raisedBy: 'Harpreet Singh',
        priority: 'High',
        status: 'In Discussion',
        description: 'Closed-loop mould water return circuit temperature elevated, cooling time increased by 4s.'
      },
      {
        queryId: 'OPS-Q401',
        title: 'Shift B Cycle Time Optimization from 28s to 24s',
        department: 'Plant Operations',
        raisedBy: 'Sanjay Verma',
        priority: 'Medium',
        status: 'Open',
        description: 'Robotic takeout arm trajectory reprogrammed for faster sprue clipping.'
      },
      {
        queryId: 'OPS-Q402',
        title: 'Purging Compound Shortage on Extruder Line 02',
        department: 'Plant Operations',
        raisedBy: 'Anita Desai',
        priority: 'High',
        status: 'In Discussion',
        description: 'Only 2 bags of Dyna-Purge remaining before black-to-clear resin color changeover.'
      },
      {
        queryId: 'SCM-Q501',
        title: 'Corrugated Box Grade 5-Ply Delivery Delay by Vendor',
        department: 'Supply Chain & Logistics',
        raisedBy: 'Rohan Joshi',
        priority: 'High',
        status: 'Open',
        description: 'Box supplier fleet delayed due to interstate highway maintenance; packing buffer is 6 hours.'
      },
      {
        queryId: 'SCM-Q502',
        title: 'Pallet Stacking Height Safety Compliance in Warehouse Zone C',
        department: 'Supply Chain & Logistics',
        raisedBy: 'Manoj Tiwari',
        priority: 'Low',
        status: 'Open',
        description: 'Forklift operators instructed not to exceed 3 tiers on high-cube euro pallets.'
      }
    ];
  });

  const [sidebarTab, setSidebarTab] = useState('departments');
  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll triggers
  const [userSentMessageTrigger, setUserSentMessageTrigger] = useState(0);
  const [incomingMessageTrigger, setIncomingMessageTrigger] = useState(0);

  // Pagination state
  const [paginationPage, setPaginationPage] = useState(1);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  // Modals & Toast
  const [mediaModal, setMediaModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Responsive helper: Checks if device is in mobile mode (portrait OR landscape mobile)
  const isMobileScreen = () => {
    if (typeof window === 'undefined') return false;
    const isNarrow = window.innerWidth <= 768;
    const isLandscapeMobile = window.innerHeight <= 560 && window.innerWidth <= 1024;
    const isTouchMobile =
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 && window.innerHeight <= 600) ||
      (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches && window.innerHeight <= 600);
    return isNarrow || isLandscapeMobile || isTouchMobile;
  };

  // Mobile view state: 'sidebar' | 'chat'
  const [mobileView, setMobileView] = useState(() => {
    return isMobileScreen() ? 'sidebar' : 'chat';
  });

  // Listen for window resize & orientation change
  useEffect(() => {
    const handleResize = () => {
      const isMobile = isMobileScreen();
      if (!isMobile) {
        setMobileView('chat');
      } else if (!activeRoomId) {
        setMobileView('sidebar');
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [activeRoomId]);

  // When room is closed on mobile or window switches to mobile without active room, auto-switch to sidebar
  useEffect(() => {
    if (!activeRoomId && isMobileScreen()) {
      setMobileView('sidebar');
    }
  }, [activeRoomId]);

  // Mobile virtual keyboard viewport & scroll locking (prevents chat header from scrolling off-screen)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lockWindowScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    const handleVisualViewport = () => {
      if (window.visualViewport) {
        const vh = window.visualViewport.height;
        document.documentElement.style.setProperty('--app-viewport-height', `${vh}px`);
        const kbdHeight = window.innerHeight - vh;
        if (kbdHeight > 140) {
          document.documentElement.style.setProperty('--wa-keyboard-height', `${kbdHeight}px`);
        }
      }
      lockWindowScroll();
    };

    window.addEventListener('scroll', lockWindowScroll);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewport);
      window.visualViewport.addEventListener('scroll', handleVisualViewport);
      handleVisualViewport();
    }

    return () => {
      window.removeEventListener('scroll', lockWindowScroll);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewport);
        window.visualViewport.removeEventListener('scroll', handleVisualViewport);
      }
    };
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Toggle Theme (Light <-> Dark)
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    showToast(
      theme === 'light' ? 'Switched to Dark Mode 🌙' : 'Switched to Light Mode ☀️',
      'info'
    );
  };

  // Real-time synchronization subscription
  useEffect(() => {
    const unsubscribe = mcdSync.subscribe((payload) => {
      if (payload.type === 'NEW_MESSAGE') {
        const { roomId, message, sourceSystem } = payload;
        setRoomMessages((prev) => {
          const list = prev[roomId] || [];
          if (list.some((m) => m.id === message.id)) return prev;
          return {
            ...prev,
            [roomId]: [...list, message]
          };
        });

        if (roomId === activeRoomId) {
          if (sourceSystem === 'MCD') {
            setUserSentMessageTrigger(Date.now());
          } else {
            setIncomingMessageTrigger(Date.now());
          }
        }
      } else if (payload.type === 'QUERY_ROOM_CREATED') {
        const { queryData, sourceSystem } = payload;
        setQueryRoomsList((prev) => {
          if (prev.some((q) => q.queryId === queryData.queryId)) return prev;
          return [queryData, ...prev];
        });

        const roomId = `query-${queryData.queryId}`;
        setRoomMessages((prev) => {
          if (prev[roomId]) return prev;
          return {
            ...prev,
            [roomId]: [
              {
                id: `init-${Date.now()}`,
                chatId: roomId,
                position: 'left',
                senderName: queryData.raisedBy || 'Staff',
                senderRole: queryData.senderRole || 'Initiator',
                type: 'text',
                text: `📌 [New Query Discussion Opened from ${sourceSystem}]: ${queryData.queryId} - ${queryData.title}\n${queryData.description}`,
                date: new Date(),
                status: 'read'
              }
            ]
          };
        });
      }
    });

    return () => unsubscribe();
  }, [activeRoomId]);

  // Persist messages in localStorage
  useEffect(() => {
    saveAllRoomMessages(roomMessages);
  }, [roomMessages]);

  const currentMessages = useMemo(() => {
    return activeRoomId ? roomMessages[activeRoomId] || [] : [];
  }, [roomMessages, activeRoomId]);

  // Select room from Sidebar (either Department or Query from Tree)
  const handleSelectRoom = (roomId, type, data) => {
    setActiveRoomId(roomId);
    setActiveRoomContext({ type, id: roomId, data });
    setReplyTarget(null);
    setMobileView('chat');
  };

  // Close / Back button clicked
  // Works on BOTH desktop (closes current open chat) and mobile (goes back to list)
  const handleCloseRoom = () => {
    if (isMobileScreen()) {
      setMobileView('sidebar');
    } else {
      setActiveRoomId(null);
    }
  };

  const handleOpenMembersModalOrPanel = () => {
    if (isMobileScreen()) {
      setMobileMembersModal(true);
    } else {
      setShowMembersPanel((prev) => !prev);
    }
  };

  // User sends a message
  const handleSendMessage = (text) => {
    if (!activeRoomId) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      chatId: activeRoomId,
      position: 'right',
      senderName: 'You',
      type: 'text',
      text: text,
      date: new Date(),
      status: 'sent',
      replyTo: replyTarget
        ? {
            id: replyTarget.id,
            text: replyTarget.text,
            senderName: replyTarget.senderName || 'Member',
            position: replyTarget.position
          }
        : null
    };

    setReplyTarget(null);
    setUserSentMessageTrigger(Date.now());

    mcdSync.broadcastMessage(activeRoomId, newMessage, 'MCD');

    // Tick progression: Sent -> Delivered -> Read
    setTimeout(() => {
      setRoomMessages((prev) => ({
        ...prev,
        [activeRoomId]: (prev[activeRoomId] || []).map((m) =>
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        )
      }));
    }, 1000);

    setTimeout(() => {
      setRoomMessages((prev) => ({
        ...prev,
        [activeRoomId]: (prev[activeRoomId] || []).map((m) =>
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        )
      }));
    }, 2400);
  };

  // Send photo
  const handleSendMedia = (photoUri, caption = '') => {
    if (!activeRoomId) return;

    const newMediaMsg = {
      id: `media-${Date.now()}`,
      chatId: activeRoomId,
      position: 'right',
      type: 'photo',
      text: caption || photoUri,
      data: {
        uri: photoUri,
        width: 320,
        height: 220
      },
      date: new Date(),
      status: 'sent'
    };
    mcdSync.broadcastMessage(activeRoomId, newMediaMsg, 'MCD');
    setUserSentMessageTrigger(Date.now());

    setTimeout(() => {
      setRoomMessages((prev) => ({
        ...prev,
        [activeRoomId]: (prev[activeRoomId] || []).map((m) =>
          m.id === newMediaMsg.id ? { ...m, status: 'read' } : m
        )
      }));
    }, 1800);
  };

  // Send audio voice note
  const handleSendAudio = (durationSec = 10) => {
    if (!activeRoomId) return;

    const audioMsg = {
      id: `audio-${Date.now()}`,
      chatId: activeRoomId,
      position: 'right',
      type: 'audio',
      text: 'Voice note update',
      data: {
        audioURL: '#',
        duration: durationSec
      },
      date: new Date(),
      status: 'sent'
    };
    mcdSync.broadcastMessage(activeRoomId, audioMsg, 'MCD');
    setUserSentMessageTrigger(Date.now());

    setTimeout(() => {
      setRoomMessages((prev) => ({
        ...prev,
        [activeRoomId]: (prev[activeRoomId] || []).map((m) =>
          m.id === audioMsg.id ? { ...m, status: 'read' } : m
        )
      }));
    }, 1800);
  };

  // Pagination: load older messages
  const handleLoadOlder = useCallback(() => {
    if (isLoadingOlder || !hasMoreOlder || !activeRoomId) return;

    setIsLoadingOlder(true);
    setTimeout(() => {
      const olderBatch = generateOlderHistoryBatch(paginationPage);
      setRoomMessages((prev) => ({
        ...prev,
        [activeRoomId]: [...olderBatch, ...(prev[activeRoomId] || [])]
      }));
      setPaginationPage((p) => p + 1);
      setIsLoadingOlder(false);

      if (paginationPage >= 3) {
        setHasMoreOlder(false);
        showToast('Reached beginning of discussion history', 'info');
      } else {
        showToast(`Loaded archive page #${paginationPage}`, 'info');
      }
    }, 700);
  }, [isLoadingOlder, hasMoreOlder, paginationPage, activeRoomId]);

  // Reply handler
  const handleReply = (message) => {
    setReplyTarget(message);
    const author =
      message.position === 'right' ? 'yourself' : message.senderName || 'Member';
    showToast(`Replying to ${author}`, 'info');
  };

  // Copy handler
  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Copied to clipboard! 📋', 'success');
    }
  };

  // Delete handler
  const handleDelete = (messageId, isUserMessage) => {
    setRoomMessages((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map((m) =>
        m.id === messageId
          ? { ...m, deleted: true, deletedForEveryone: isUserMessage }
          : m
      )
    }));
    showToast('Message deleted', 'info');
  };

  // React handler
  const handleReact = (messageId, emoji) => {
    setRoomMessages((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map((m) => {
        if (m.id !== messageId) return m;
        const currentReactions = m.reactions || [];
        const hasEmoji = currentReactions.includes(emoji);
        const newReactions = hasEmoji
          ? currentReactions.filter((e) => e !== emoji)
          : [...currentReactions, emoji];
        return { ...m, reactions: newReactions };
      })
    }));
  };

  // Clear Chat in room
  const handleClearChat = () => {
    if (window.confirm('Clear all discussion history in this room?')) {
      setRoomMessages((prev) => ({
        ...prev,
        [activeRoomId]: []
      }));
      showToast('Discussion history cleared', 'info');
    }
  };

  return (
    <div className={`wa-app-root ${theme === 'dark' ? 'wa-theme-dark' : 'wa-theme-light'}`}>
      <div className={`wa-app-container ${mobileView === 'sidebar' ? 'wa-mobile-show-sidebar' : 'wa-mobile-show-chat'}`}>
        
        {/* ==============================================================
            COLUMN 1: NAVIGATION SIDEBAR (DEPARTMENTS & QUERY TREE)
            ============================================================== */}
        <div className="wa-sidebar-wrapper">
          <Sidebar
            activeRoomId={activeRoomId}
            onSelectRoom={handleSelectRoom}
            queryRoomsList={queryRoomsList}
            allMessages={roomMessages}
            activeTab={sidebarTab}
            onTabChange={setSidebarTab}
          />
        </div>

        {/* ==============================================================
            COLUMN 2: DESKTOP MEMBERS PANEL (USER NAMES & ONLINE STATUS)
            (Visible on desktop next to the left sidebar: shows room members when room open,
             or all organization members when on canvas/empty state)
            ============================================================== */}
        {showMembersPanel && (
          <div className="mcd-desktop-members-col hidden md:block">
            <MembersPanel
              roomId={activeRoomId}
              roomContext={activeRoomContext}
              onClose={() => setShowMembersPanel(false)}
            />
          </div>
        )}

        {/* ==============================================================
            COLUMN 3: MAIN CHAT PANEL (OPENS RIGHT SIDE DIRECTLY)
            ============================================================== */}
        <main className="wa-main-chat">
          {activeRoomId ? (
            <>
              {/* Chat Header with Back Arrow on BOTH Desktop and Mobile */}
              <ChatHeader
                roomContext={activeRoomContext}
                isTyping={isTyping}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onBack={handleCloseRoom}
                onOpenMembers={handleOpenMembersModalOrPanel}
                onClearChat={handleClearChat}
              />

              {/* Chat Area with Ticks, Dates, Swipe to Reply */}
              <ChatArea
                messages={currentMessages}
                currentChat={{ id: activeRoomId }}
                onReply={handleReply}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onReact={handleReact}
                onLoadOlder={handleLoadOlder}
                hasMoreOlder={hasMoreOlder}
                isLoadingOlder={isLoadingOlder}
                onImageClick={(m) => setMediaModal(m)}
                userSentMessageTrigger={userSentMessageTrigger}
                incomingMessageTrigger={incomingMessageTrigger}
              />

              {/* Input Footer with Auto-expanding Textarea & Shift+Enter */}
              <ChatFooter
                inputText={inputText}
                setInputText={setInputText}
                onSendMessage={handleSendMessage}
                replyTarget={replyTarget}
                onCancelReply={() => setReplyTarget(null)}
                onSendMedia={handleSendMedia}
                onSendAudio={handleSendAudio}
                members={getMembersForRoom(activeRoomId, activeRoomContext)}
              />
            </>
          ) : (
            /* ==========================================================
               RAILWAY-STYLE INTERACTIVE ARCHITECTURE CANVAS (When chat is closed)
               Dual Mode: Departments Mesh & Query Systems Mesh
               ========================================================== */
            <MCDRailwayCanvas
              theme={theme}
              onToggleTheme={handleToggleTheme}
              showMembersPanel={showMembersPanel}
              activeTab={sidebarTab}
              onTabChange={setSidebarTab}
              queryRoomsList={queryRoomsList}
              onToggleMembers={handleOpenMembersModalOrPanel}
              onSelectDepartment={(deptId, deptData) =>
                handleSelectRoom(deptId, 'department', deptData)
              }
              onSelectQuery={(query) =>
                handleSelectRoom(`query-${query.queryId}`, 'query', query)
              }
              onOpenSidebar={() => setMobileView('sidebar')}
            />
          )}
        </main>
      </div>

      {/* MOBILE MEMBERS MODAL SHEET (Triggered from 3-dots or canvas on Mobile) */}
      {mobileMembersModal && (
        <div className="mcd-mobile-sheet-backdrop" onClick={() => setMobileMembersModal(false)}>
          <div className="mcd-mobile-sheet-content" onClick={(e) => e.stopPropagation()}>
            <MembersPanel
              roomId={activeRoomId}
              roomContext={activeRoomContext}
              onClose={() => setMobileMembersModal(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Lightbox Media Modal */}
      <MediaViewerModal
        media={mediaModal}
        onClose={() => setMediaModal(null)}
      />

      {/* Toast Feedback */}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

export default App;
