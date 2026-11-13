import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Smile,
  Keyboard,
  Paperclip,
  Mic,
  Send,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AtSign,
  Plus,
  Camera
} from 'lucide-react';
import ReplyPreview from './ReplyPreview';
import EmojiPickerModal from '../Modals/EmojiPickerModal';
import AttachmentModal from '../Modals/AttachmentModal';
import MentionPicker from './MentionPicker';

/* ---------- Editor DOM -> marker text (rendered by utils/richText) ---------- */
const getFormats = (node, root) => {
  let b = false, i = false, u = false;
  let n = node.parentNode;
  while (n && n !== root) {
    const t = n.nodeName;
    const st = n.style || {};
    if (t === 'B' || t === 'STRONG' || st.fontWeight === 'bold' || Number(st.fontWeight) >= 600) b = true;
    if (t === 'I' || t === 'EM' || st.fontStyle === 'italic') i = true;
    if (t === 'U' || String(st.textDecorationLine || st.textDecoration || '').includes('underline')) u = true;
    n = n.parentNode;
  }
  return { b, i, u };
};

const wrapText = (text, f) => {
  if (!text.trim()) return text;
  const m = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  let core = m[2];
  if (f.i) core = `_${core}_`;
  if (f.b) core = `*${core}*`;
  if (f.u) core = `~~${core}~~`;
  return m[1] + core + m[3];
};

export const serializeEditor = (root) => {
  let out = '';
  const nl = () => {
    if (out && !out.endsWith('\n')) out += '\n';
  };
  const walk = (parent) => {
    parent.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        out += wrapText(child.nodeValue.replace(/\u00A0/g, ' '), getFormats(child, root));
        return;
      }
      if (child.nodeType !== 1) return;
      const tag = child.nodeName;
      if (child.dataset && child.dataset.mention) {
        out += '@' + child.dataset.mention;
        return;
      }
      if (tag === 'BR') {
        out += '\n';
        return;
      }
      if (tag === 'UL' || tag === 'OL') {
        nl();
        let idx = 0;
        child.childNodes.forEach((li) => {
          if (li.nodeName !== 'LI') return;
          idx += 1;
          out += tag === 'UL' ? '- ' : `${idx}. `;
          walk(li);
          nl();
        });
        return;
      }
      if (tag === 'DIV' || tag === 'P') {
        nl();
        walk(child);
        nl();
        return;
      }
      walk(child);
    });
  };
  walk(root);
  return out
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
    .filter((l) => !/^(-|\d+\.)$/.test(l)) // drop empty list items
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/* Programmatically deletes the single preceding character or unicode emoji/grapheme cluster */
const deleteGraphemeBeforeCaret = (el, range) => {
  if (!el || !el.hasChildNodes()) return;

  if (range && el.contains(range.startContainer)) {
    const sc = range.startContainer;
    const offset = range.startOffset;

    if (sc.nodeType === 3 && offset > 0) {
      const text = sc.nodeValue;
      const before = text.slice(0, offset);
      const after = text.slice(offset);

      let segments;
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        segments = Array.from(seg.segment(before)).map((s) => s.segment);
      } else {
        segments = Array.from(before);
      }

      segments.pop(); // remove last character / emoji
      const newBefore = segments.join('');
      sc.nodeValue = newBefore + after;
      if (sc.nodeValue.length === 0) {
        sc.remove();
      } else {
        range.setStart(sc, newBefore.length);
        range.collapse(true);
      }
      return;
    } else if (sc.nodeType === 1 && offset > 0) {
      const child = sc.childNodes[offset - 1];
      if (child) {
        child.remove();
        return;
      }
    }
  }

  // Fallback: delete the last child or last grapheme from el
  const findLastTextOrElement = (node) => {
    if (!node) return null;
    if (node.nodeType === 3 && node.nodeValue.length > 0) return node;
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const res = findLastTextOrElement(node.childNodes[i]);
      if (res) return res;
    }
    return node;
  };

  const target = findLastTextOrElement(el);
  if (target && target !== el) {
    if (target.nodeType === 3) {
      const text = target.nodeValue;
      let segments;
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        segments = Array.from(seg.segment(text)).map((s) => s.segment);
      } else {
        segments = Array.from(text);
      }
      segments.pop();
      if (segments.length === 0) {
        target.remove();
      } else {
        target.nodeValue = segments.join('');
      }
    } else {
      target.remove();
    }
  }
};

export const ChatFooter = ({
  inputText,
  setInputText,
  onSendMessage,
  replyTarget,
  onCancelReply,
  onSendMedia,
  onSendAudio,
  members = []
}) => {
  const [activeDrawer, setActiveDrawer] = useState(null); // 'emoji' | 'attachment' | null
  const showEmojiPicker = activeDrawer === 'emoji';
  const showAttachment = activeDrawer === 'attachment';
  const [showMention, setShowMention] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [hasContent, setHasContent] = useState(false);
  const [focused, setFocused] = useState(false);
  const [fmt, setFmt] = useState({ b: false, i: false, u: false, ul: false, ol: false });

  const editorRef = useRef(null);
  const savedRange = useRef(null);
  const typedAt = useRef(false);
  const recordTimerRef = useRef(null);

  // Auto-focus on chat entry: desktop focuses immediately, mobile places caret without opening virtual keyboard
  useEffect(() => {
    const isMobile = isMobileDevice();
    const el = editorRef.current;
    if (!el) return;

    if (!isMobile) {
      el.focus();
    } else {
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        savedRange.current = range.cloneRange();
      }
    }
  }, []);

  /* Track caret + active formats */
  useEffect(() => {
    const onSel = () => {
      const el = editorRef.current;
      const sel = window.getSelection();
      if (!el || !sel || !sel.rangeCount || !el.contains(sel.anchorNode)) return;
      savedRange.current = sel.getRangeAt(0).cloneRange();
      try {
        setFmt({
          b: document.queryCommandState('bold'),
          i: document.queryCommandState('italic'),
          u: document.queryCommandState('underline'),
          ul: document.queryCommandState('insertUnorderedList'),
          ol: document.queryCommandState('insertOrderedList')
        });
      } catch (e) {
        /* ignore */
      }
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  useEffect(() => {
    if (replyTarget && editorRef.current) editorRef.current.focus();
  }, [replyTarget]);

  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } else if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
    }
    return () => recordTimerRef.current && clearInterval(recordTimerRef.current);
  }, [isRecording]);

  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const r = savedRange.current;
    if (r) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }, []);

  const syncContent = () => {
    const el = editorRef.current;
    if (!el) return;
    if (!el.textContent && !el.querySelector('[data-mention],li')) el.innerHTML = '';
    const text = serializeEditor(el);
    setHasContent(text.length > 0);
    if (setInputText) setInputText(text);
  };

  const refreshFmt = useCallback(() => {
    try {
      setFmt({
        b: document.queryCommandState('bold'),
        i: document.queryCommandState('italic'),
        u: document.queryCommandState('underline'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList')
      });
    } catch (e) {
      /* ignore */
    }
  }, []);

  const exec = (cmd) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false, null);
    syncContent();
    refreshFmt(); // highlight the button immediately, even before typing
  };

  const isInList = () => {
    const el = editorRef.current;
    const sel = window.getSelection();
    let n = sel && sel.anchorNode;
    while (n && n !== el) {
      if (n.nodeName === 'LI') return true;
      n = n.parentNode;
    }
    return false;
  };

  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth <= 768 ||
      (window.innerHeight <= 560 && window.innerWidth <= 1024) ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
      (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
    );
  };

  const handleSend = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const el = editorRef.current;
    if (!el) return;
    const text = serializeEditor(el);
    if (!text) return;
    onSendMessage(text);
    el.innerHTML = '';
    setHasContent(false);
    if (setInputText) setInputText('');
    setActiveDrawer(null);
    setShowMention(false);

    // Keep mobile on-screen keyboard open and re-focus editor immediately
    requestAnimationFrame(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        const sel = window.getSelection();
        if (sel) {
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          savedRange.current = range.cloneRange();
        }
      }
    });
  };

  const tryExitList = () => {
    const el = editorRef.current;
    const sel = window.getSelection();
    if (!el || !sel || !sel.rangeCount || !sel.isCollapsed) return false;
    let n = sel.anchorNode;
    while (n && n !== el && n.nodeName !== 'LI') n = n.parentNode;
    if (!n || n === el) return false;
    const r = sel.getRangeAt(0);
    const pre = document.createRange();
    pre.selectNodeContents(n);
    pre.setEnd(r.startContainer, r.startOffset);
    const frag = pre.cloneContents();
    if (frag.textContent.length > 0 || frag.querySelector('[data-mention]')) return false;
    const isOl = n.parentNode.nodeName === 'OL';
    document.execCommand(isOl ? 'insertOrderedList' : 'insertUnorderedList');
    syncContent();
    return true;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && tryExitList()) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      // On mobile / touch devices: Enter key ALWAYS inserts a new line (never sends message)
      if (isMobileDevice()) {
        // Let native Enter insert newline or handle line break inside contentEditable
        if (!isInList()) {
          // Native Enter in contenteditable will create a newline / <div><br></div>
          // Ensure it does not trigger send
          return;
        }
        return;
      }

      // On desktop: plain Enter sends message, Shift+Enter makes a new line
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        handleSend();
        return;
      }
      if (!e.shiftKey && !isInList()) {
        e.preventDefault();
        handleSend();
      }
      // Shift+Enter -> new line; Enter inside a list -> next bullet / number
    }
  };

  const handleInput = (e) => {
    const el = editorRef.current;
    const sel = window.getSelection();
    let charBefore = '';
    if (el && sel && sel.rangeCount && el.contains(sel.anchorNode)) {
      const r = sel.getRangeAt(0);
      savedRange.current = r.cloneRange();
      if (r.collapsed && r.startContainer.nodeType === 3 && r.startOffset > 0) {
        charBefore = r.startContainer.nodeValue[r.startOffset - 1];
      }
    }
    const data = e.nativeEvent && e.nativeEvent.data;
    syncContent();
    if ((data === '@' || charBefore === '@') && members.length > 0) {
      typedAt.current = true;
      setShowMention(true);
      setShowEmojiPicker(false);
      setShowAttachment(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleSelectEmoji = (emoji) => {
    const el = editorRef.current;
    if (!el) return;

    const isMobile = isMobileDevice();

    if (!isMobile) {
      el.focus();
      restoreSelection();
    }

    let inserted = false;
    if (!isMobile) {
      try {
        inserted = document.execCommand('insertText', false, emoji);
      } catch (e) {
        inserted = false;
      }
    }

    if (!inserted) {
      const sel = window.getSelection();
      let range = savedRange.current;
      if (!range || !el.contains(range.startContainer)) {
        if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
          range = sel.getRangeAt(0);
        } else {
          range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
        }
      }

      range.deleteContents();
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);

      savedRange.current = range.cloneRange();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    syncContent();
  };

  const handleToggleEmoji = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (activeDrawer === 'emoji') {
      // User tapped Keyboard button: close emoji drawer and bring up virtual keyboard!
      setActiveDrawer(null);
      requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      });
    } else {
      // User tapped Smiley button: blur editor to dismiss mobile virtual keyboard cleanly!
      if (editorRef.current) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
          savedRange.current = sel.getRangeAt(0).cloneRange();
        }
        editorRef.current.blur();
      }
      setActiveDrawer('emoji');
      setShowMention(false);
    }
  };

  const handleToggleAttachment = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (activeDrawer === 'attachment') {
      setActiveDrawer(null);
    } else {
      if (editorRef.current) {
        editorRef.current.blur();
      }
      setActiveDrawer('attachment');
      setShowMention(false);
    }
  };

  const handleEmojiBackspace = () => {
    const el = editorRef.current;
    if (!el) return;

    if (!isMobileDevice()) {
      el.focus();
    }

    const sel = window.getSelection();
    let range = savedRange.current;
    if (!range || !el.contains(range.startContainer)) {
      if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
        range = sel.getRangeAt(0);
      }
    }

    const beforeText = el.innerText;
    let deleted = false;
    try {
      deleted = document.execCommand('delete', false, null);
    } catch (e) {
      deleted = false;
    }

    // If native delete didn't actually delete anything (or text remained identical):
    // Perform robust DOM grapheme deletion
    if (!deleted || el.innerText === beforeText) {
      deleteGraphemeBeforeCaret(el, range);
    }

    // Refresh caret so it continues to blink right at the updated location
    const newRange = document.createRange();
    newRange.selectNodeContents(el);
    newRange.collapse(false);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
    savedRange.current = newRange.cloneRange();

    syncContent();
  };

  const openMentionFromButton = () => {
    typedAt.current = false;
    setShowMention((p) => !p);
    setActiveDrawer(null);
  };

  const getExistingMentions = () => {
    const el = editorRef.current;
    if (!el) return [];
    return Array.from(el.querySelectorAll('[data-mention]')).map(
      (n) => n.dataset.mention
    );
  };

  const confirmMentions = (list) => {
    setShowMention(false);
    restoreSelection();
    const el = editorRef.current;
    const existing = new Set(getExistingMentions());
    const uniqueList = list.filter((m) => !existing.has(m.name));
    const sel = window.getSelection();
    let range = sel.rangeCount ? sel.getRangeAt(0) : null;
    if (!range || !el.contains(range.startContainer)) {
      range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
    }
    if (typedAt.current) {
      if (
        range.collapsed &&
        range.startContainer.nodeType === 3 &&
        range.startOffset > 0 &&
        range.startContainer.nodeValue[range.startOffset - 1] === '@'
      ) {
        range.setStart(range.startContainer, range.startOffset - 1);
        range.deleteContents();
      } else if (
        range.collapsed &&
        range.startContainer.nodeType === 1 &&
        range.startOffset > 0
      ) {
        const prev = range.startContainer.childNodes[range.startOffset - 1];
        if (prev && prev.nodeType === 3 && prev.nodeValue.endsWith('@')) {
          prev.nodeValue = prev.nodeValue.slice(0, -1);
          range.setStart(prev, prev.nodeValue.length);
          range.collapse(true);
        }
      } else if (
        range.startContainer.previousSibling &&
        range.startContainer.previousSibling.nodeType === 3 &&
        range.startContainer.previousSibling.nodeValue.endsWith('@')
      ) {
        const prev = range.startContainer.previousSibling;
        prev.nodeValue = prev.nodeValue.slice(0, -1);
      }
    }
    typedAt.current = false;

    const frag = document.createDocumentFragment();
    let last = null;
    uniqueList.forEach((m) => {
      const chip = document.createElement('span');
      chip.className = 'mcd-chip';
      chip.contentEditable = 'false';
      chip.dataset.mention = m.name;
      chip.textContent = `@${m.name}`;
      frag.appendChild(chip);
      last = document.createTextNode('\u00A0');
      frag.appendChild(last);
    });
    range.insertNode(frag);
    if (last) {
      range.setStartAfter(last);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    syncContent();
  };

  const cancelMention = () => {
    setShowMention(false);
    typedAt.current = false;
    restoreSelection();
  };

  const handleAttachmentOption = (type) => {
    if (type === 'photos') {
      const photos = [
        'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
      ];
      onSendMedia(photos[Math.floor(Math.random() * photos.length)], 'Attachment image preview');
    } else if (type === 'audio') {
      onSendAudio(14);
    } else {
      onSendMessage(`📎 Sent ${type.toUpperCase()} attachment`);
    }
  };

  const handleFinishRecording = () => {
    setIsRecording(false);
    if (onSendAudio) onSendAudio(recordSeconds || 4);
    setRecordSeconds(0);
  };

  const formatRecordTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? '0' + remaining : remaining}`;
  };

  const tbBtn = (title, active, onClick, icon) => (
    <button
      type="button"
      title={title}
      className={active ? 'mcd-tb-active' : ''}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {icon}
    </button>
  );

  return (
    <div className="wa-footer-wrapper">
      <ReplyPreview replyTarget={replyTarget} onCancel={onCancelReply} />

      {showMention && (
        <MentionPicker
          members={members}
          alreadyMentioned={getExistingMentions()}
          onConfirm={confirmMentions}
          onCancel={cancelMention}
        />
      )}

      {!isRecording && (
        <div className="mcd-format-toolbar mcd-tb-visible">
          {tbBtn('Bold (Ctrl+B)', fmt.b, () => exec('bold'), <Bold size={15} />)}
          {tbBtn('Italic (Ctrl+I)', fmt.i, () => exec('italic'), <Italic size={15} />)}
          {tbBtn('Underline (Ctrl+U)', fmt.u, () => exec('underline'), <Underline size={15} />)}
          <span className="mcd-format-sep" />
          {tbBtn('Bullet list', fmt.ul, () => exec('insertUnorderedList'), <List size={15} />)}
          {tbBtn('Numbered list', fmt.ol, () => exec('insertOrderedList'), <ListOrdered size={15} />)}
          <span className="mcd-format-sep" />
          {tbBtn('Mention team members (@)', showMention, openMentionFromButton, <AtSign size={15} />)}
        </div>
      )}

      <div className="wa-footer-bar">
        {isRecording ? (
          <div className="wa-recording-bar">
            <button type="button" className="wa-rec-cancel-btn" onClick={() => setIsRecording(false)} title="Cancel recording">
              <X size={20} className="text-red-500" />
            </button>
            <div className="wa-rec-indicator">
              <span className="wa-rec-dot" />
              <span className="wa-rec-time">{formatRecordTime(recordSeconds)}</span>
              <span className="wa-rec-label">Recording voice note...</span>
            </div>
            <button type="button" className="wa-send-btn wa-pop" onClick={handleFinishRecording} title="Send voice note">
              <Send size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className={`wa-composer-pill ${focused ? 'wa-composer-focus' : ''}`}>
              {/* WhatsApp Smiley <-> Keyboard toggle button */}
              <button
                type="button"
                data-emoji-toggle="true"
                className={`wa-pill-btn ${showEmojiPicker ? 'wa-pill-active is-keyboard-toggle' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                onClick={handleToggleEmoji}
                title={showEmojiPicker ? "Keyboard" : "Emojis"}
              >
                {showEmojiPicker ? <Keyboard size={24} className="text-emerald-600 animate-pulse" /> : <Smile size={24} />}
              </button>

              <button
                type="button"
                data-attach-toggle="true"
                className={`wa-pill-btn wa-attach-btn ${showAttachment ? 'wa-pill-active wa-attach-open' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                onClick={handleToggleAttachment}
                title="Attach"
              >
                <Plus size={26} className="wa-ico-desktop wa-attach-icon" />
                <Paperclip size={22} className="wa-ico-mobile" />
              </button>

              <div className="wa-editor-wrap">
                <div
                  ref={editorRef}
                  className="wa-editor"
                  contentEditable
                  suppressContentEditableWarning
                  role="textbox"
                  aria-multiline="true"
                  data-placeholder="Type a message"
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  onFocus={() => {
                    setFocused(true);
                    setActiveDrawer(null);
                  }}
                  onBlur={() => setFocused(false)}
                />
              </div>

              {!hasContent && (
                <button
                  type="button"
                  className="wa-pill-btn wa-camera-btn"
                  onClick={() => handleAttachmentOption('camera')}
                  title="Camera"
                >
                  <Camera size={22} />
                </button>
              )}
            </div>

            {hasContent ? (
              <button
                key="send"
                type="button"
                className="wa-send-btn wa-pop"
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                onClick={handleSend}
                title="Send"
              >
                <Send size={20} />
              </button>
            ) : (
              <button
                key="mic"
                type="button"
                className="wa-send-btn wa-mic-btn wa-pop"
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => setIsRecording(true)}
                title="Voice message"
              >
                <Mic size={22} />
              </button>
            )}
          </>
        )}
      </div>

      {/* WhatsApp Bottom Drawers Shelf with smooth transition (No jitter / flicker) */}
      <div className={`wa-drawer-shelf ${activeDrawer ? 'wa-drawer-open' : ''}`}>
        <EmojiPickerModal
          isOpen={showEmojiPicker}
          onClose={() => setActiveDrawer(null)}
          onSelectEmoji={handleSelectEmoji}
          onBackspace={handleEmojiBackspace}
        />

        <AttachmentModal
          isOpen={showAttachment}
          onClose={() => setActiveDrawer(null)}
          onSelectOption={handleAttachmentOption}
        />
      </div>
    </div>
  );
};

export default ChatFooter;
