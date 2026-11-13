import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  Microscope,
  MessageSquare,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { QCR_SYSTEM_CONFIG } from './qcr.config';
import { qcrController } from './qcr';
import ChatArea from '../../components/Chat/ChatArea';
import ChatFooter from '../../components/Chat/ChatFooter';

export const QCRSystemUI = ({ sharedRoomMessages, onMessageSentFromQCR }) => {
  const [cards, setCards] = useState(QCR_SYSTEM_CONFIG.sampleQCRCards);
  const [activeCard, setActiveCard] = useState(null);
  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [userSentTrigger, setUserSentTrigger] = useState(0);

  const activeRoomId = activeCard ? qcrController.getRoomIdForCard(activeCard) : null;
  const currentMessages = activeRoomId ? sharedRoomMessages[activeRoomId] || [] : [];

  const handleOpenCardDiscussion = (card) => {
    setActiveCard(card);
    qcrController.initiateQCRDiscussion(card, (roomId, queryData) => {
      // Notified via sync engine
    });
  };

  const handleSend = (text) => {
    if (!text.trim() || !activeRoomId) return;
    const msg = qcrController.sendMessage(activeRoomId, text.trim(), replyTarget);
    setInputText('');
    setReplyTarget(null);
    setUserSentTrigger(Date.now());

    if (onMessageSentFromQCR) {
      onMessageSentFromQCR(activeRoomId, msg);
    }
  };

  return (
    <div className="qcr-injected-portal">
      {/* Top Banner of QCR Portal */}
      <div className="qcr-portal-header">
        <div className="flex items-center gap-3">
          <div className="qcr-header-badge">
            <Microscope size={20} className="text-white" />
          </div>
          <div>
            <h2 className="qcr-portal-title">{QCR_SYSTEM_CONFIG.systemName}</h2>
            <p className="qcr-portal-sub">
              [Injected System View] • <em>Custom QCR logic with Batch, Defect Code, and Quality Stage.</em>
            </p>
          </div>
        </div>
      </div>

      {/* QCR Cards List */}
      <div className="qcr-cards-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const roomId = qcrController.getRoomIdForCard(card);
            const messages = sharedRoomMessages[roomId] || [];

            return (
              <div key={card.queryId} className="qcr-card">
                <div className="qcr-card-top">
                  <span className="qcr-batch-no font-mono">{card.batchNo}</span>
                  <span className={`qcr-severity-badge severity-${card.severity.toLowerCase().replace(/\s+/g, '-')}`}>
                    {card.severity}
                  </span>
                </div>

                <div className="qcr-stage-row">
                  <Layers size={13} className="text-amber-400 mr-1.5 inline" />
                  <span className="text-xs font-semibold text-amber-300">{card.inspectionStage}</span>
                </div>

                <div className="qcr-defect-code-row">
                  <AlertOctagon size={14} className="text-red-400 mr-1.5 inline" />
                  <span className="text-red-300 font-mono text-xs font-semibold">{card.defectCode}</span>
                </div>

                <h4 className="qcr-card-title">{card.title}</h4>
                <p className="qcr-card-desc">{card.description}</p>

                <div className="qcr-card-footer">
                  <span className="text-xs text-gray-400 font-mono">{card.queryId}</span>

                  <button
                    type="button"
                    className="qcr-mcd-btn"
                    onClick={() => handleOpenCardDiscussion(card)}
                    title="Open QC defect discussion"
                  >
                    <MessageSquare size={15} className="mr-1.5" />
                    <span>Inspect & Discuss</span>
                    {messages.length > 0 && (
                      <span className="qcr-msg-count">{messages.length}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Injected WhatsApp Discussion Drawer for Active QCR Defect */}
      {activeCard && (
        <div className="qcr-drawer-backdrop" onClick={() => setActiveCard(null)}>
          <div className="qcr-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="qcr-drawer-header">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="qcr-drawer-tag font-mono">{activeCard.queryId}</span>
                  <span className="text-sm font-semibold text-white truncate">
                    {activeCard.batchNo} • {activeCard.defectCode}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {activeCard.title} ({activeCard.severity})
                </p>
              </div>

              <button
                type="button"
                className="qcr-drawer-close"
                onClick={() => setActiveCard(null)}
                title="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="qcr-sync-pill">
              <Sparkles size={13} className="text-amber-400 inline mr-1.5" />
              <span>Real-time sync with MCD Central Plant Hub</span>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col relative">
              <ChatArea
                messages={currentMessages}
                currentChat={{ id: activeRoomId }}
                onReply={(m) => setReplyTarget(m)}
                onCopy={(t) => navigator.clipboard && navigator.clipboard.writeText(t)}
                onDelete={() => {}}
                onReact={() => {}}
                onLoadOlder={() => {}}
                hasMoreOlder={false}
                isLoadingOlder={false}
                userSentMessageTrigger={userSentTrigger}
                incomingMessageTrigger={0}
              />

              <ChatFooter
                inputText={inputText}
                setInputText={setInputText}
                onSendMessage={handleSend}
                replyTarget={replyTarget}
                onCancelReply={() => setReplyTarget(null)}
                onSendMedia={() => {}}
                onSendAudio={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QCRSystemUI;

