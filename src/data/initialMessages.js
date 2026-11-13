// Helper to get relative dates
export const getRelativeDate = (daysAgo = 0, hours = 10, minutes = 30) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// Initial messages for chat-1 (Sameer Khan)
export const INITIAL_MESSAGES_CHAT_1 = [
  // 3 days ago
  {
    id: 'm-old-1',
    chatId: 'chat-1',
    position: 'left',
    type: 'text',
    text: 'Hey! Are you working on the MCD project?',
    date: getRelativeDate(3, 11, 15),
    status: 'read',
    senderName: 'Sameer Khan'
  },
  {
    id: 'm-old-2',
    chatId: 'chat-1',
    position: 'right',
    type: 'text',
    text: 'Yes! Using react-chat-elements with custom MCD UI and gestures.',
    date: getRelativeDate(3, 11, 18),
    status: 'read'
  },
  {
    id: 'm-old-3',
    chatId: 'chat-1',
    position: 'left',
    type: 'text',
    text: 'Sounds great! Will it have swipe to reply and long press menu?',
    date: getRelativeDate(3, 11, 20),
    status: 'read',
    senderName: 'Sameer Khan'
  },

  // Yesterday
  {
    id: 'm-yest-1',
    chatId: 'chat-1',
    position: 'right',
    type: 'text',
    text: 'Haan bhai, swipe to reply, long press options (delete, copy, reply), sab built-in hai!',
    date: getRelativeDate(1, 16, 40),
    status: 'read'
  },
  {
    id: 'm-yest-2',
    chatId: 'chat-1',
    position: 'left',
    type: 'text',
    text: 'Kya baat hai! And what about date headers like Today, Yesterday and ticks?',
    date: getRelativeDate(1, 16, 42),
    status: 'read',
    senderName: 'Sameer Khan'
  },
  {
    id: 'm-yest-3',
    chatId: 'chat-1',
    position: 'right',
    type: 'text',
    text: 'Single tick, double tick, blue tick sab dynamic hain. Check out this screenshot preview:',
    date: getRelativeDate(1, 16, 45),
    status: 'read',
    reactions: ['🔥']
  },
  {
    id: 'm-yest-4',
    chatId: 'chat-1',
    position: 'right',
    type: 'photo',
    text: 'React Chat UI preview 🚀',
    data: {
      uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      width: 300,
      height: 200
    },
    date: getRelativeDate(1, 16, 46),
    status: 'read'
  },

  // Today
  {
    id: 'm-today-1',
    chatId: 'chat-1',
    position: 'left',
    type: 'text',
    text: 'Bhai iska demo kab share kar rahe ho?',
    date: getRelativeDate(0, 10, 5),
    status: 'read',
    senderName: 'Sameer Khan'
  },
  {
    id: 'm-today-2',
    chatId: 'chat-1',
    position: 'right',
    type: 'text',
    text: 'Just testing the pagination and auto-scroll logic abhi!',
    date: getRelativeDate(0, 10, 12),
    status: 'read',
    replyTo: {
      id: 'm-today-1',
      senderName: 'Sameer Khan',
      text: 'Bhai iska demo kab share kar rahe ho?'
    }
  },
  {
    id: 'm-today-3',
    chatId: 'chat-1',
    position: 'right',
    type: 'text',
    text: 'Top par rahoge to message aane par scroll jump nahi hoga, floating badge dikhega. But agar tum message karoge to smoothly bottom par aa jayega 🎯',
    date: getRelativeDate(0, 10, 15),
    status: 'read'
  },
  {
    id: 'm-today-4',
    chatId: 'chat-1',
    position: 'right',
    type: 'text',
    text: 'Check this message status: delivered (double grey tick)',
    date: getRelativeDate(0, 12, 30),
    status: 'delivered'
  },
  {
    id: 'm-today-5',
    chatId: 'chat-1',
    position: 'right',
    type: 'text',
    text: 'And this one is single tick (sent, not yet delivered)',
    date: getRelativeDate(0, 13, 2),
    status: 'sent'
  },
  {
    id: 'm-today-6',
    chatId: 'chat-1',
    position: 'left',
    type: 'text',
    text: 'Try long pressing on any message or swipe it to reply! 🔥',
    date: getRelativeDate(0, 13, 40),
    status: 'read',
    senderName: 'Sameer Khan',
    reactions: ['❤️', '👍']
  }
];

// Older pagination messages generator (history that prepends when scrolled to top)
export const generateOlderHistoryBatch = (page) => {
  const baseDay = 4 + page * 2;
  return [
    {
      id: `hist-${page}-1`,
      chatId: 'chat-1',
      position: 'left',
      type: 'text',
      text: `Older conversation history (Archive Page ${page}): Setting up project architecture.`,
      date: getRelativeDate(baseDay + 1, 9, 15),
      status: 'read',
      senderName: 'Sameer Khan'
    },
    {
      id: `hist-${page}-2`,
      chatId: 'chat-1',
      position: 'right',
      type: 'text',
      text: `Installed react-chat-elements and configured Vite for ultra-fast HMR.`,
      date: getRelativeDate(baseDay + 1, 9, 20),
      status: 'read'
    },
    {
      id: `hist-${page}-3`,
      chatId: 'chat-1',
      position: 'left',
      type: 'text',
      text: `Super cool! Let's make sure the scroll position stays locked smoothly while prepending!`,
      date: getRelativeDate(baseDay, 14, 10),
      status: 'read',
      senderName: 'Sameer Khan'
    }
  ];
};

