import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';

export const StatusTick = ({ status, className = '' }) => {
  if (status === 'pending') {
    return <Clock size={12} className={`text-gray-400 inline-block ml-1 ${className}`} />;
  }

  if (status === 'sent') {
    // Single grey tick
    return (
      <span className={`inline-flex items-center ml-1 text-gray-400 font-bold leading-none ${className}`} title="Sent">
        <Check size={14} strokeWidth={2.5} />
      </span>
    );
  }

  if (status === 'delivered') {
    // Double grey tick
    return (
      <span className={`inline-flex items-center ml-1 text-gray-400 font-bold leading-none ${className}`} title="Delivered">
        <CheckCheck size={15} strokeWidth={2.5} />
      </span>
    );
  }

  if (status === 'read') {
    // Double blue tick (WhatsApp iconic blue: #53bdeb)
    return (
      <span
        className={`inline-flex items-center ml-1 font-bold leading-none ${className}`}
        style={{ color: '#53bdeb' }}
        title="Read"
      >
        <CheckCheck size={15} strokeWidth={2.5} />
      </span>
    );
  }

  return null;
};

export default StatusTick;

