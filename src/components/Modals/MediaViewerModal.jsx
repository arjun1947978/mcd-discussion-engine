import React from 'react';
import { X, Download, ZoomIn, Share2 } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

export const MediaViewerModal = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div className="wa-media-modal-backdrop" onClick={onClose}>
      <div className="wa-media-modal-topbar" onClick={(e) => e.stopPropagation()}>
        <div className="wa-media-modal-sender">
          <span className="font-semibold text-white">
            {media.senderName || (media.position === 'right' ? 'You' : 'Contact')}
          </span>
          <span className="text-xs text-gray-400 ml-2">
            {formatTime(media.date)}
          </span>
        </div>
        <div className="wa-media-modal-actions">
          <button
            type="button"
            className="wa-media-btn"
            onClick={() => window.open(media.data?.uri || media.text, '_blank')}
            title="Download / Open Original"
          >
            <Download size={19} />
          </button>
          <button
            type="button"
            className="wa-media-btn"
            onClick={onClose}
            title="Close viewer"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="wa-media-modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={media.data?.uri || media.text}
          alt="Media"
          className="wa-media-modal-img"
        />
        {media.text && media.text !== media.data?.uri && (
          <div className="wa-media-modal-caption">
            <p>{media.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaViewerModal;

