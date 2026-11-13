import { SALES_SYSTEM_CONFIG } from './sales.config';
import { mcdSync } from '../../sync/mcdSyncEngine';

/**
 * Sales System Driver Logic (sales.js)
 * Manages query creation from sales cards and synchronization with MCD Central Hub
 */
export class SalesSystemController {
  constructor() {
    this.config = SALES_SYSTEM_CONFIG;
  }

  // Generate or retrieve room ID for a specific sales card
  getRoomIdForCard(card) {
    return `query-${card.queryId}`;
  }

  // Open / Trigger query room creation
  initiateQueryDiscussion(card, onComplete) {
    const roomId = this.getRoomIdForCard(card);
    const queryData = {
      queryId: card.queryId,
      title: card.title,
      department: 'Sales & Marketing',
      raisedBy: this.config.defaultSender.name,
      senderRole: this.config.defaultSender.role,
      priority: card.priority,
      status: card.status,
      description: card.description,
      extraMetadata: {
        orderId: card.orderId,
        clientName: card.clientName,
        dealValue: card.dealValue
      }
    };

    // Broadcast room creation to MCD Standalone App
    mcdSync.broadcastQueryRoomCreated(queryData, 'SALES');

    if (onComplete) {
      onComplete(roomId, queryData);
    }

    return roomId;
  }

  // Send message from Sales Injected UI
  sendMessage(roomId, text, replyTo = null) {
    const message = {
      id: `sales-msg-${Date.now()}`,
      chatId: roomId,
      position: 'right', // in Sales UI, sales user is 'right'
      senderName: this.config.defaultSender.name,
      senderRole: this.config.defaultSender.role,
      type: 'text',
      text,
      date: new Date(),
      status: 'sent',
      replyTo,
      sourceSystem: 'SALES'
    };

    // Broadcast in real-time to MCD Central Hub
    mcdSync.broadcastMessage(roomId, message, 'SALES');
    return message;
  }
}

export const salesController = new SalesSystemController();
export default salesController;

