import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Clock,
  Smile,
  Dog,
  Coffee,
  Trophy,
  Car,
  Lightbulb,
  Heart,
  Delete
} from 'lucide-react';
import { EMOJI_CATEGORIES, EMOJI_KEYWORDS } from '../../data/emojiData';

const TAB_ICONS = {
  recent: Clock,
  smileys: Smile,
  animals: Dog,
  food: Coffee,
  activity: Trophy,
  travel: Car,
  objects: Lightbulb,
  symbols: Heart
};

const RECENT_KEY = 'mcd_recent_emojis';

export const EmojiPickerModal = ({ isOpen, onClose, onSelectEmoji, onBackspace }) => {
  const [activeCategory, setActiveCategory] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(isOpen);
  const [recentEmojis, setRecentEmojis] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      return Array.isArray(saved) && saved.length > 0 ? saved : EMOJI_CATEGORIES[0].emojis;
    } catch {
      return EMOJI_CATEGORIES[0].emojis;
    }
  });

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  // Keep mounted briefly so closing animation plays smoothly
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 180);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Close when clicking outside (ignore emoji toggle button)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest && e.target.closest('[data-emoji-toggle]')) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const categories = useMemo(
    () =>
      EMOJI_CATEGORIES.map((c) =>
        c.id === 'recent' ? { ...c, emojis: recentEmojis } : c
      ),
    [recentEmojis]
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set();
    const out = [];
    categories.forEach((cat) => {
      const catMatch = cat.name.toLowerCase().includes(q);
      cat.emojis.forEach((emoji) => {
        if (seen.has(emoji)) return;
        const kw = EMOJI_KEYWORDS[emoji] || '';
        if (catMatch || kw.includes(q)) {
          seen.add(emoji);
          out.push(emoji);
        }
      });
    });
    return out;
  }, [searchQuery, categories]);

  const handlePick = (emoji) => {
    setRecentEmojis((prev) => {
      const next = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 24);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    onSelectEmoji(emoji);
  };

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    const node = sectionRefs.current[id];
    const box = scrollRef.current;
    if (node && box) {
      box.scrollTo({ top: node.offsetTop - 4, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const box = scrollRef.current;
    if (!box || searchQuery.trim()) return;
    const top = box.scrollTop + 28;
    for (let i = categories.length - 1; i >= 0; i -= 1) {
      const id = categories[i].id;
      const node = sectionRefs.current[id];
      if (node && node.offsetTop <= top) {
        if (activeCategory !== id) setActiveCategory(id);
        break;
      }
    }
  };

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className={`wa-emoji-picker-container wa-wa-emoji ${isOpen ? 'wa-emoji-in' : 'wa-emoji-out'}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* WhatsApp Top Category Tabs */}
      <div className="wa-emoji-tabs-bar">
        {categories.map((cat) => {
          const Icon = TAB_ICONS[cat.id] || Smile;
          const active = !searchQuery && activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`wa-emoji-tab-btn ${active ? 'is-active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setSearchQuery('');
                scrollToCategory(cat.id);
              }}
              title={cat.name}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      {/* WhatsApp Search Bar */}
      <div className="wa-emoji-search-wrap">
        <div className="wa-emoji-search-box">
          <Search size={14} className="wa-emoji-search-icon" />
          <input
            type="text"
            placeholder="Search emojis"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="wa-emoji-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="wa-emoji-clear-btn"
              type="button"
              title="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Emoji Sections */}
      <div ref={scrollRef} className="wa-emoji-scroll" onScroll={handleScroll}>
        {searchQuery.trim() ? (
          <div className="wa-emoji-section">
            <div className="wa-emoji-section-title">Search Results</div>
            {searchResults.length > 0 ? (
              <div className="wa-emoji-grid-8">
                {searchResults.map((emoji, idx) => (
                  <button
                    key={`${emoji}-${idx}`}
                    type="button"
                    className="wa-emoji-cell"
                    onMouseDown={(e) => e.preventDefault()}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePick(emoji);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : (
              <div className="wa-emoji-empty">No emojis found for "{searchQuery}"</div>
            )}
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              ref={(el) => {
                sectionRefs.current[cat.id] = el;
              }}
              className="wa-emoji-section"
            >
              <div className="wa-emoji-section-title">{cat.name}</div>
              <div className="wa-emoji-grid-8">
                {cat.emojis.map((emoji, idx) => (
                  <button
                    key={`${cat.id}-${emoji}-${idx}`}
                    type="button"
                    className="wa-emoji-cell"
                    onMouseDown={(e) => e.preventDefault()}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePick(emoji);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* WhatsApp Quick Backspace Button (Floating bottom right) */}
      {onBackspace && (
        <button
          type="button"
          className="wa-emoji-backspace-float"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBackspace();
          }}
          title="Backspace"
        >
          <Delete size={20} />
        </button>
      )}
    </div>
  );
};

export default EmojiPickerModal;
