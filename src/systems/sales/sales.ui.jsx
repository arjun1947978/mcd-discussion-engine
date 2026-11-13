import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  DollarSign,
  Building,
  MessageSquare,
  X,
  Send,
  ArrowRight,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import { SALES_SYSTEM_CONFIG } from './sales.config';
import { salesController } from './sales';
import { mcdSync } from '../../sync/mcdSyncEngine';
import ChatArea from '../../components/Chat/ChatArea';
import ChatFooter from '../../components/Chat/ChatFooter';

export const SalesSystemUI = ({ sharedRoomMessages, onMessageSentFromSales }) => {
  const [cards, setCards] = useState(SALES_SYSTEM_CONFIG.sampleSalesCards);
  const [activeCard, setActiveCard] = useState(null);
  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [userSentTrigger, setUserSentTrigger] = useState(0);

  const activeRoomId = activeCard ? salesController.getRoomIdForCard(activeCard) : null;
  const currentMessages = activeRoomId ? sharedRoomMessages[activeRoomId] || [] : [];

  const handleOpenCardDiscussion = (card) => {
    setActiveCard(card);
    salesController.initiateQueryDiscussion(card, (roomId, queryData) => {
      // Sync engine broadcasts to MCD Standalone
    });
  };

  const handleSend = (text) => {
    if (!text.trim() || !activeRoomId) return;
    const msg = salesController.sendMessage(activeRoomId, text.trim(), replyTarget);
    setInputText('');
    setReplyTarget(null);
    setUserSentTrigger(Date.now());

    if (onMessageSentFromSales) {
      onMessageSentFromSales(activeRoomId, msg);
    }
  };

  return (
    <div className="sales-injected-portal">
      {/* Top Banner of Sales System */}
      <div className="sales-portal-header">
        <div className="flex items-center gap-3">
          <div className="sales-header-badge">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div>
            <h2 className="sales-portal-title">{SALES_SYSTEM_CONFIG.systemName}</h2>
            <p className="sales-portal-sub">
              [Injected System View] • <em>Notice: No departments shown here, only card query discussions.</em>
            </p>
          </div>
        </div>
      </div>

      {/* Sales Query Cards List */}
      <div className="sales-cards-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const roomId = salesController.getRoomIdForCard(card);
            const messages = sharedRoomMessages[roomId] || [];
            const hasActivity = messages.length > 0;

            return (
              <div key={card.queryId} className="sales-card">
                <div className="sales-card-top">
                  <span className="sales-order-id font-mono">{card.orderId}</span>
                  <span className={`sales-priority-badge priority-${card.priority.toLowerCase()}`}>
                    {card.priority}
                  </span>
                </div>

                <div className="sales-client-row">
                  <Building size={14} className="text-gray-400 mr-1.5 inline" />
                  <span className="font-semibold text-gray-200">{card.clientName}</span>
                </div>

                <div className="sales-value-row">
                  <DollarSign size={14} className="text-emerald-400 mr-1.5 inline" />
                  <span className="text-emerald-400 font-bold">{card.dealValue}</span>
                </div>

                <h4 className="sales-card-title">{card.title}</h4>
                <p className="sales-card-desc">{card.description}</p>

                <div className="sales-card-footer">
                  <span className="text-xs text-gray-400 font-mono">{card.queryId}</span>

                  {/* INJECTED MCD BUTTON */}
                  <button
                    type="button"
                    className="sales-mcd-btn"
                    onClick={() => handleOpenCardDiscussion(card)}
                    title="Open query chat for this order"
                  >
                    <MessageSquare size={15} className="mr-1.5" />
                    <span>Discuss Order</span>
                    {messages.length > 0 && (
                      <span className="sales-msg-count">{messages.length}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Injected WhatsApp Discussion Drawer for Active Sales Card */}
      {activeCard && (
        <div className="sales-drawer-backdrop" onClick={() => setActiveCard(null)}>
          <div className="sales-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header tailored for Sales */}
            <div className="sales-drawer-header">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="sales-drawer-tag font-mono">{activeCard.queryId}</span>
                  <span className="text-sm font-semibold text-white truncate">
                    {activeCard.orderId} • {activeCard.clientName}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {activeCard.title} ({activeCard.dealValue})
                </p>
              </div>

              <button
                type="button"
                className="sales-drawer-close"
                onClick={() => setActiveCard(null)}
                title="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Real-time sync badge */}
            <div className="sales-sync-pill">
              <Sparkles size={13} className="text-emerald-400 inline mr-1.5" />
              <span>Real-time connected with MCD Central App</span>
            </div>

            {/* Chat Area with WhatsApp gestures, dates, ticks */}
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

export default SalesSystemUI;

