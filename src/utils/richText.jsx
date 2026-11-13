import React from 'react';
import { ROOM_MEMBERS_DATA } from '../data/roomMembers';

// All known member names (longest first so "Dr. Kabir Sen" wins over shorter matches)
const ALL_NAMES = Array.from(
  new Set(Object.values(ROOM_MEMBERS_DATA).flat().map((m) => m.name))
).sort((a, b) => b.length - a.length);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const MENTION_RE = new RegExp(
  `@(?:${ALL_NAMES.map(escapeRe).join('|')})`,
  'g'
);

// Inline markers:  ~~underline~~   *bold*   _italic_   @Mention
const INLINE_RE = new RegExp(
  `(~~[^~\\n]+~~|\\*[^*\\n]+\\*|_[^_\\n]+_|${MENTION_RE.source})`,
  'g'
);

const renderInline = (text, keyPrefix) => {
  const parts = text.split(INLINE_RE);
  return parts.map((part, i) => {
    if (!part) return null;
    const key = `${keyPrefix}-${i}`;
    if (part.length > 4 && part.startsWith('~~') && part.endsWith('~~')) {
      return <u key={key}>{renderInline(part.slice(2, -2), key)}</u>;
    }
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return <strong key={key}>{renderInline(part.slice(1, -1), key)}</strong>;
    }
    if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) {
      return <em key={key}>{renderInline(part.slice(1, -1), key)}</em>;
    }
    if (part.startsWith('@') && ALL_NAMES.includes(part.slice(1))) {
      return (
        <span key={key} className="mcd-mention">
          {part}
        </span>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
};

/**
 * Render message text with: bold, italic, underline, bullet list,
 * numbered list, @mentions and preserved new lines.
 */
export const renderRichText = (text = '') => {
  const lines = String(text).split('\n');
  const out = [];
  let list = null; // { type: 'ul' | 'ol', items: [] }

  const flush = () => {
    if (!list) return;
    const Tag = list.type;
    out.push(
      <Tag key={`l-${out.length}`} className="mcd-rich-list">
        {list.items.map((it, i) => (
          <li key={i}>{renderInline(it, `li-${out.length}-${i}`)}</li>
        ))}
      </Tag>
    );
    list = null;
  };

  lines.forEach((line, idx) => {
    const bullet = line.match(/^\s*[-•]\s+(.*)$/);
    const number = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet) {
      if (!list || list.type !== 'ul') {
        flush();
        list = { type: 'ul', items: [] };
      }
      list.items.push(bullet[1]);
    } else if (number) {
      if (!list || list.type !== 'ol') {
        flush();
        list = { type: 'ol', items: [] };
      }
      list.items.push(number[1]);
    } else {
      flush();
      out.push(
        <div key={`p-${idx}`} className="mcd-rich-line">
          {line === '' ? '\u00A0' : renderInline(line, `p-${idx}`)}
        </div>
      );
    }
  });
  flush();
  return out;
};

