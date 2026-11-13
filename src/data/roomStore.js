import { getRelativeDate } from './initialMessages';
import { MCD_DEPARTMENTS } from './departments';
import { MOCK_QUERY_CARDS } from './mockQueries';

const STORAGE_KEY = 'mcd_discussion_rooms_v1';

// Seed default message history for department channels
const generateDefaultDeptMessages = () => {
  return {
    'dept-tools': [
      {
        id: 't-1',
        chatId: 'dept-tools',
        position: 'left',
        senderName: 'Vikram Sharma',
        senderRole: 'Tooling Head',
        type: 'text',
        text: 'Morning team. Please check the wear report on CNC Spindle #2 before starting shift B.',
        date: getRelativeDate(1, 9, 30),
        status: 'read'
      },
      {
        id: 't-2',
        chatId: 'dept-tools',
        position: 'right',
        type: 'text',
        text: 'Inspected cutter carbide inserts. Insert #4 shows micro-chipping, replacing it now.',
        date: getRelativeDate(1, 9, 45),
        status: 'read'
      },
      {
        id: 't-3',
        chatId: 'dept-tools',
        position: 'left',
        senderName: 'Ramesh Patel',
        senderRole: 'Line Supervisor',
        type: 'text',
        text: 'Thanks! Query card MCD-Q101 has been raised for tracking tool head vibration deviation.',
        date: getRelativeDate(0, 9, 35),
        status: 'read',
        replyTo: {
          id: 't-2',
          senderName: 'You',
          text: 'Inspected cutter carbide inserts. Insert #4 shows micro-chipping, replacing it now.'
        }
      },
      {
        id: 't-4',
        chatId: 'dept-tools',
        position: 'right',
        type: 'text',
        text: 'Understood. We are logging real-time telemetry on the query room directly.',
        date: getRelativeDate(0, 10, 5),
        status: 'read'
      }
    ],
    'dept-rnd': [
      {
        id: 'r-1',
        chatId: 'dept-rnd',
        position: 'left',
        senderName: 'Dr. Ananya Roy',
        senderRole: 'Chief Scientist',
        type: 'text',
        text: 'Welcome to Marca Coroma R&D Discussion. Tensile stress data for Batch #44 is ready.',
        date: getRelativeDate(1, 14, 10),
        status: 'read'
      },
      {
        id: 'r-2',
        chatId: 'dept-rnd',
        position: 'right',
        type: 'text',
        text: 'Testing with 15% glass fiber reinforcement blend gave exceptional modulus numbers.',
        date: getRelativeDate(0, 10, 20),
        status: 'read'
      }
    ],
    'dept-accounts': [
      {
        id: 'a-1',
        chatId: 'dept-accounts',
        position: 'left',
        senderName: 'Rajesh Agarwal',
        senderRole: 'CFO',
        type: 'text',
        text: 'Reminder: All departmental expense vouchers for Q3 audit must be submitted by Friday 5 PM.',
        date: getRelativeDate(2, 11, 0),
        status: 'read'
      }
    ],
    'dept-admin': [
      {
        id: 'ad-1',
        chatId: 'dept-admin',
        position: 'left',
        senderName: 'Sunita Mehra',
        senderRole: 'Admin Head',
        type: 'text',
        text: 'Scheduled plant fire alarm drill tomorrow at 11:30 AM. Evacuation routes have been marked.',
        date: getRelativeDate(1, 16, 0),
        status: 'read'
      }
    ],
    'dept-sales': [
      {
        id: 's-1',
        chatId: 'dept-sales',
        position: 'left',
        senderName: 'Amit Khanna',
        senderRole: 'VP Sales',
        type: 'text',
        text: 'Client meeting with Zenith Corp concluded on a positive note. Final discount approval needed.',
        date: getRelativeDate(0, 9, 15),
        status: 'read'
      }
    ],
    'dept-operations': [
      {
        id: 'op-1',
        chatId: 'dept-operations',
        position: 'left',
        senderName: 'Harpreet Singh',
        senderRole: 'Operations Manager',
        type: 'text',
        text: 'Plant production lines running at 98.4% efficiency. Shift handover logs cleared.',
        date: getRelativeDate(0, 6, 30),
        status: 'read'
      }
    ]
  };
};

// Seed default message history for mock query cards
const generateDefaultQueryMessages = () => {
  return {
    'query-MCD-Q101': [
      {
        id: 'q101-1',
        chatId: 'query-MCD-Q101',
        position: 'left',
        senderName: 'Ramesh Patel',
        senderRole: 'Line Supervisor',
        type: 'text',
        text: '🚨 [Query #MCD-Q101 Opened]: CNC tool head vibration on Line 2 is 0.08mm (threshold is 0.05mm). Milling finish is showing chatter marks.',
        date: getRelativeDate(0, 9, 30),
        status: 'read'
      },
      {
        id: 'q101-2',
        chatId: 'query-MCD-Q101',
        position: 'left',
        senderName: 'Vikram Sharma',
        senderRole: 'Tooling Head',
        type: 'text',
        text: 'Check if the collet chuck taper has debris or if the pull stud torque is loose.',
        date: getRelativeDate(0, 9, 42),
        status: 'read'
      },
      {
        id: 'q101-3',
        chatId: 'query-MCD-Q101',
        position: 'right',
        type: 'text',
        text: 'Cleaned the HSK-63A taper and recalibrated dial indicator. Running vibration test at 8000 RPM now.',
        date: getRelativeDate(0, 10, 15),
        status: 'read'
      }
    ],
    'query-MCD-Q102': [
      {
        id: 'q102-1',
        chatId: 'query-MCD-Q102',
        position: 'left',
        senderName: 'Dr. Kabir Sen',
        senderRole: 'Lab Chemist',
        type: 'text',
        text: '🔬 [Query #MCD-Q102 Opened]: Polymer Batch #88 test samples prepared. Awaiting UL-94 vertical burn chamber certification.',
        date: getRelativeDate(0, 10, 15),
        status: 'read'
      }
    ],
    'query-MCD-Q103': [
      {
        id: 'q103-1',
        chatId: 'query-MCD-Q103',
        position: 'left',
        senderName: 'Neha Sharma',
        senderRole: 'Dispatch Officer',
        type: 'text',
        text: '⚠️ [Query #MCD-Q103 Opened]: Truck MH-04-7712 holding at Gate #2. e-Way bill invoice value mismatch detected by security.',
        date: getRelativeDate(0, 11, 0),
        status: 'read'
      }
    ]
  };
};

export const loadAllRoomMessages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all dates are parsed back to Date objects
      Object.keys(parsed).forEach((roomId) => {
        parsed[roomId] = parsed[roomId].map((m) => ({
          ...m,
          date: new Date(m.date)
        }));
      });
      return parsed;
    }
  } catch (err) {
    console.error('Error loading rooms from storage', err);
  }

  const initial = {
    ...generateDefaultDeptMessages(),
    ...generateDefaultQueryMessages()
  };
  saveAllRoomMessages(initial);
  return initial;
};

export const saveAllRoomMessages = (store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Error saving rooms to storage', err);
  }
};

