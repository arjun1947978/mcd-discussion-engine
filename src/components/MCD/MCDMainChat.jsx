import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatHeader from '../Chat/ChatHeader';
import ChatArea from '../Chat/ChatArea';
import ChatFooter from '../Chat/ChatFooter';

export const MCDMainChat = ({
  theme,
  onToggleTheme,
  activeRoomId,
  activeRoomContext,
  onSelectRoom,
  queryRoomsList,
  roomMessages,
  onSendMessage,
  onSendMedia,
  onSendAudio,
  replyTarget,
  setReplyTarget,
  userSentMessageTrigger,
  incomingMessageTrigger,
  isLoadingOlder,
  hasMoreOlder,
  onLoadOlder,
  onClearChat,
  onToggleTicks,
  onManualIncoming,
  onManualVoiceNote,
  onImageClick
}) => {
  const [inputText, setInputText] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentMessages = roomMessages[activeRoomId] || [];

  const handleSend = (text) => {
    onSendMessage(text);
    setInputText('');
  };

  return (
    <div className="wa-app-container flex-1">
      {/* Left Sidebar (Departments & Query Rooms) */}
      <div
        className={`wa-sidebar-wrapper ${
          mobileSidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <Sidebar
          activeRoomId={activeRoomId}
          onSelectRoom={(id, type, data) => {
            onSelectRoom(id, type, data);
            setMobileSidebarOpen(false);
          }}
          queryRoomsList={queryRoomsList}
          allMessages={roomMessages}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Right Main Chat Window */}
      <main className="wa-main-chat">
        <ChatHeader
          roomContext={activeRoomContext}
          isTyping={false}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onBack={() => setMobileSidebarOpen(true)}
          onSimulateIncoming={onManualIncoming}
          onClearChat={onClearChat}
          onSimulateVoiceNote={onManualVoiceNote}
          onToggleTicks={onToggleTicks}
        />

        <ChatArea
          messages={currentMessages}
          currentChat={{ id: activeRoomId }}
          onReply={(m) => setReplyTarget(m)}
          onCopy={(t) => navigator.clipboard && navigator.clipboard.writeText(t)}
          onDelete={(id, isUser) => {}}
          onReact={(id, emoji) => {}}
          onLoadOlder={onLoadOlder}
          hasMoreOlder={hasMoreOlder}
          isLoadingOlder={isLoadingOlder}
          onImageClick={onImageClick}
          userSentMessageTrigger={userSentMessageTrigger}
          incomingMessageTrigger={incomingMessageTrigger}
        />

        <ChatFooter
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={handleSend}
          replyTarget={replyTarget}
          onCancelReply={() => setReplyTarget(null)}
          onSendMedia={onSendMedia}
          onSendAudio={onSendAudio}
        />
      </main>
    </div>
  );
};

export default MCDMainChat;

