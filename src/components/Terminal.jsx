import { useState } from 'react';

export default function Terminal({ connection }) {
  const [panes, setPanes] = useState([{ id: 1 }]);
  const [showAdd, setShowAdd] = useState(false);

  if (!connection) {
    return (
      <div className="empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="18" rx="2"/>
          <path d="M7 9l3 3-3 3"/>
          <line x1="13" y1="15" x2="17" y2="15"/>
        </svg>
        <p>Add a terminal connection to get started with Claude Code in your browser.</p>
      </div>
    );
  }

  const addPane = () => {
    if (panes.length >= 4) return;
    setPanes(prev => [...prev, { id: Date.now() }]);
    setShowAdd(false);
  };

  const removePane = (id) => {
    if (panes.length <= 1) return;
    setPanes(prev => prev.filter(p => p.id !== id));
  };

  const canAdd = panes.length < 4;

  return (
    <div className="terminal-frame">
      {/* Terminal panes */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: showAdd ? 'calc(100% - 48px)' : '100%',
        transition: 'height 0.2s ease',
      }}>
        {panes.map((pane, i) => (
          <div key={pane.id} style={{
            flex: 1,
            position: 'relative',
            borderBottom: i < panes.length - 1 ? '2px solid var(--bd)' : 'none',
            minHeight: 0,
          }}>
            <iframe
              src={`/terminal/?t=${pane.id}`}
              title={`Terminal ${i + 1}`}
              allow="clipboard-read; clipboard-write"
              style={{ width: '100%', height: '100%', border: 'none', background: '#000' }}
            />
            {panes.length > 1 && (
              <button
                onClick={() => removePane(pane.id)}
                title="Close pane"
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 8,
                  background: 'rgba(11,11,20,0.8)',
                  border: '1px solid var(--bd)',
                  borderRadius: 4,
                  color: 'var(--tx3)',
                  fontSize: 12,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--red)'}
                onMouseLeave={e => e.target.style.color = 'var(--tx3)'}
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add pane footer - slides up when activated */}
      {showAdd && (
        <div style={{
          height: 48,
          background: 'var(--bg2)',
          borderTop: '1px solid var(--bd)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          animation: 'fadeIn 0.15s ease',
        }}>
          <button
            className="btn btn-gold btn-sm"
            onClick={addPane}
            disabled={!canAdd}
          >
            + New Claude Session
          </button>
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>
            {panes.length}/4 sessions &middot; same VPS &middot; same auth
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowAdd(false)}
            style={{ padding: '4px 10px' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Floating + button - half circle at bottom */}
      {!showAdd && canAdd && (
        <button
          onClick={() => setShowAdd(true)}
          title="Add terminal session"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 48,
            height: 24,
            borderRadius: '24px 24px 0 0',
            background: 'var(--gold)',
            border: 'none',
            borderBottom: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: '#0B0B14',
            transition: 'all 0.15s',
            zIndex: 3,
            boxShadow: '0 -2px 8px rgba(212,175,55,0.3)',
          }}
          onMouseEnter={e => {
            e.target.style.height = '28px';
            e.target.style.background = 'var(--gold2)';
          }}
          onMouseLeave={e => {
            e.target.style.height = '24px';
            e.target.style.background = 'var(--gold)';
          }}
        >
          +
        </button>
      )}
    </div>
  );
}
