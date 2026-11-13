import { QCR_SYSTEM_CONFIG } from './qcr.config';
import { mcdSync } from '../../sync/mcdSyncEngine';

/**
 * QCR System Driver Logic (qcr.js)
 * Manages Quality Control inspection queries and real-time sync with MCD Central Hub
 */
export class QCRSystemController {
  constructor() {
    this.config = QCR_SYSTEM_CONFIG;
  }

  getRoomIdForCard(card) {
    return `query-${card.queryId}`;
  }

  initiateQCRDiscussion(card, onComplete) {
    const roomId = this.getRoomIdForCard(card);
    const queryData = {
      queryId: card.queryId,
      title: card.title,
      department: 'Quality & Inspection (QCR)',
      raisedBy: this.config.defaultInspector.name,
      senderRole: this.config.defaultInspector.role,
      priority: card.severity,
      status: card.status,
      description: card.description,
      extraMetadata: {
        batchNo: card.batchNo,
        defectCode: card.defectCode,
        inspectionStage: card.inspectionStage
      }
    };

    // Broadcast room creation to MCD Standalone App
    mcdSync.broadcastQueryRoomCreated(queryData, 'QCR');

    if (onComplete) {
      onComplete(roomId, queryData);
    }

    return roomId;
  }

  sendMessage(roomId, text, replyTo = null) {
    const message = {
      id: `qcr-msg-${Date.now()}`,
      chatId: roomId,
      position: 'right',
      senderName: this.config.defaultInspector.name,
      senderRole: this.config.defaultInspector.role,
      type: 'text',
      text,
      date: new Date(),
      status: 'sent',
      replyTo,
      sourceSystem: 'QCR'
    };

    mcdSync.broadcastMessage(roomId, message, 'QCR');
    return message;
  }
}

export const qcrController = new QCRSystemController();
export default qcrController;

