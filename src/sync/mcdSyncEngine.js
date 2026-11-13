/**
 * MCD Real-Time Sync Engine
 * Uses modern BroadcastChannel API + localStorage events for instant 2-way sync
 * across different windows, iframes, or injected widget instances.
 */

const CHANNEL_NAME = 'MCD_REALTIME_SYNC_CHANNEL';
const STORAGE_PREFIX = 'mcd_room_';

class MCDSyncEngine {
  constructor() {
    this.listeners = new Set();
    this.channel = null;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.handleIncomingBroadcast(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported, falling back to storage events');
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith(STORAGE_PREFIX)) {
          const roomId = e.key.replace(STORAGE_PREFIX, '');
          try {
            const data = JSON.parse(e.newValue);
            this.notifyListeners({
              type: 'ROOM_UPDATED',
              roomId,
              messages: data
            });
          } catch (err) {}
        }
      });
    }
  }

  // Subscribe to real-time events
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(payload) {
    this.listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error('Error in sync listener', err);
      }
    });
  }

  handleIncomingBroadcast(data) {
    if (!data) return;
    this.notifyListeners(data);
  }

  // Broadcast a new message to all connected instances (MCD Standalone <-> Sales <-> QCR)
  broadcastMessage(roomId, message, sourceSystem = 'MCD') {
    const payload = {
      type: 'NEW_MESSAGE',
      roomId,
      message,
      sourceSystem,
      timestamp: Date.now()
    };

    if (this.channel) {
      this.channel.postMessage(payload);
    }
    // Also notify local listeners
    this.notifyListeners(payload);
  }

  // Broadcast room creation (e.g. When a query is raised from Sales card)
  broadcastQueryRoomCreated(queryData, sourceSystem = 'SALES') {
    const payload = {
      type: 'QUERY_ROOM_CREATED',
      queryData,
      sourceSystem,
      timestamp: Date.now()
    };

    if (this.channel) {
      this.channel.postMessage(payload);
    }
    this.notifyListeners(payload);
  }
}

export const mcdSync = new MCDSyncEngine();
export default mcdSync;

