import React, { useEffect, useRef, useState } from 'react';
import { Image, FileText, Camera, User, BarChart2 } from 'lucide-react';

const ITEMS = [
  { id: 'document', label: 'Document', icon: FileText, color: '#7f66ff' },
  { id: 'photos', label: 'Photos & videos', icon: Image, color: '#007bfc' },
  { id: 'camera', label: 'Camera', icon: Camera, color: '#ff2e74' },
  { id: 'contact', label: 'Contact', icon: User, color: '#009de2' },
  { id: 'poll', label: 'Poll', icon: BarChart2, color: '#ffbc38' }
];

export const AttachmentModal = ({ isOpen, onClose, onSelectOption }) => {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(isOpen);

  // keep mounted briefly so the closing animation can play
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 180);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest && e.target.closest('[data-attach-toggle]')) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) onClose();
    };
    if (isOpen) window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className={`wa-attachment-stack-menu ${isOpen ? 'wa-attach-in' : 'wa-attach-out'}`}
    >
      {ITEMS.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className="wa-attach-row"
            style={{ animationDelay: `${isOpen ? index * 25 : 0}ms` }}
            onClick={() => {
              onSelectOption(item.id);
              onClose();
            }}
          >
            <span className="wa-attach-ico" style={{ color: item.color }}>
              <Icon size={22} />
            </span>
            <span className="wa-attach-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AttachmentModal;
