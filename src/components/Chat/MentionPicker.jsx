import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Check, Minus } from 'lucide-react';

export const MentionPicker = ({ members = [], alreadyMentioned = [], onConfirm, onCancel }) => {
  const [selected, setSelected] = useState([]); // member ids
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const isAlready = (m) => alreadyMentioned.includes(m.name);

  const selectableMembers = useMemo(
    () => members.filter((m) => !alreadyMentioned.includes(m.name)),
    [members, alreadyMentioned]
  );

  const filtered = useMemo(
    () =>
      members.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.role.toLowerCase().includes(query.toLowerCase())
      ),
    [members, query]
  );

  const allSelected =
    selectableMembers.length > 0 && selected.length === selectableMembers.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelected(allSelected ? [] : selectableMembers.map((m) => m.id));

  const selectedMembers = selectableMembers.filter((m) => selected.includes(m.id));

  return (
    <div className="mcd-mpicker" onMouseDown={(e) => e.stopPropagation()}>
      <div className="mcd-mpicker-head">
        <strong>Mention team members</strong>
        <button type="button" className="mcd-mpicker-x" onClick={onCancel} title="Cancel">
          <X size={16} />
        </button>
      </div>

      {selectedMembers.length > 0 && (
        <div className="mcd-mpicker-pills">
          {selectedMembers.map((m) => (
            <span key={m.id} className="mcd-pill">
              <img src={m.avatar} alt="" />
              {m.name}
              <button
                type="button"
                className="mcd-pill-remove"
                onClick={() => toggle(m.id)}
                title={`Remove ${m.name}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mcd-mpicker-search">
        <Search size={14} />
        <input
          autoFocus
          placeholder="Search member..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mcd-mpicker-list">
        <label className={`mcd-mpicker-row mcd-mpicker-all ${selectableMembers.length === 0 ? 'mcd-mpicker-added' : ''}`}>
          <span className={`mcd-check ${allSelected || someSelected ? 'on' : ''}`}>
            {allSelected ? <Check size={12} /> : someSelected ? <Minus size={12} /> : null}
          </span>
          <input
            type="checkbox"
            hidden
            disabled={selectableMembers.length === 0}
            checked={allSelected}
            onChange={toggleAll}
          />
          <span className="mcd-mpicker-name">All members</span>
          <span className="mcd-mpicker-role">
            {selectableMembers.length === 0
              ? 'All added'
              : `${selectableMembers.length} remaining`}
          </span>
        </label>

        {filtered.map((m) => {
          const added = isAlready(m);
          const on = !added && selected.includes(m.id);
          return (
            <label key={m.id} className={`mcd-mpicker-row ${added ? 'mcd-mpicker-added' : ''}`}>
              <span className={`mcd-check ${on || added ? 'on' : ''}`}>
                {(on || added) && <Check size={12} />}
              </span>
              <input
                type="checkbox"
                hidden
                disabled={added}
                checked={on || added}
                onChange={() => !added && toggle(m.id)}
              />
              <img src={m.avatar} alt="" className="mcd-mention-avatar" />
              <span className="mcd-mpicker-name">{m.name}</span>
              {added ? (
                <span className="mcd-added-tag">Added</span>
              ) : (
                <span className="mcd-mpicker-role">{m.role}</span>
              )}
            </label>
          );
        })}
        {filtered.length === 0 && <div className="mcd-mpicker-empty">No member found</div>}
      </div>

      <div className="mcd-mpicker-foot">
        <button type="button" className="mcd-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="mcd-btn-primary"
          disabled={selectedMembers.length === 0}
          onClick={() => onConfirm(selectedMembers)}
        >
          OK{selectedMembers.length ? ` (${selectedMembers.length})` : ''}
        </button>
      </div>
    </div>
  );
};

export default MentionPicker;

