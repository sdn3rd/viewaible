import { useState, useRef, useEffect } from 'react';

// Recursive binary split layout.
// First split: whichever dimension is larger (wide → vertical split, tall → horizontal).
// Each subsequent split: the larger dimension of that sub-pane.
function buildLayout(panes) {
  if (panes.length === 0) return null;
  if (panes.length === 1) return { type: 'leaf', pane: panes[0] };

  const mid = Math.ceil(panes.length / 2);
  const left = panes.slice(0, mid);
  const right = panes.slice(mid);

  return {
    type: 'split',
    left: buildLayout(left),
    right: buildLayout(right),
  };
}

function LayoutNode({ node, onRemove, canRemove, containerRef }) {
  const [size, setSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    if (!containerRef?.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef]);

  if (node.type === 'leaf') {
    return (
      <div style={{ flex: 1, position: 'relative', minHeight: 0, minWidth: 0 }}>
        <iframe
          src={`/terminal/?t=${node.pane.id}`}
          title={`Terminal ${node.pane.id}`}
          allow="clipboard-read; clipboard-write"
          style={{ width: '100%', height: '100%', border: 'none', background: '#000' }}
        />
        {canRemove && (
          <button
            onClick={() => onRemove(node.pane.id)}
            title="Close pane"
            style={{
              position: 'absolute',
              top: 4,
              right: 8,
              background: 'rgba(11,11,20,0.85)',
              border: '1px solid var(--bd)',
              borderRadius: 4,
              color: 'var(--tx3)',
              fontSize: 12,
              padding: '2px 6px',
              cursor: 'pointer',
              zIndex: 2,
            }}
            onMouseEnter={e => e.target.style.color = 'var(--red)'}
            onMouseLeave={e => e.target.style.color = 'var(--tx3)'}
          >
            &times;
          </button>
        )}
      </div>
    );
  }

  // Split direction: wider → split vertically (side by side), taller → horizontally (stacked)
  const isWide = size.w >= size.h;
  const direction = isWide ? 'row' : 'column';
  const borderStyle = isWide
    ? { borderRight: '2px solid var(--bd)' }
    : { borderBottom: '2px solid var(--bd)' };

  return (
    <div style={{ display: 'flex', flexDirection: direction, flex: 1, minHeight: 0, minWidth: 0 }}>
      <div style={{ flex: 1, display: 'flex', minHeight: 0, minWidth: 0, ...borderStyle }}>
        <LayoutNode node={node.left} onRemove={onRemove} canRemove={canRemove} containerRef={containerRef} />
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0, minWidth: 0 }}>
        <LayoutNode node={node.right} onRemove={onRemove} canRemove={canRemove} containerRef={containerRef} />
      </div>
    </div>
  );
}

export default function Terminal({ connection }) {
  const [panes, setPanes] = useState([{ id: 1 }]);
  const [showAdd, setShowAdd] = useState(false);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

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
  const layout = buildLayout(panes);
  const isWide = containerSize.w >= containerSize.h;

  // Position the + button on the edge of the next split direction
  const plusPosition = isWide
    ? { right: 0, top: '50%', transform: 'translateY(-50%)', borderRadius: '6px 0 0 6px', width: 24, height: 48 }
    : { bottom: 0, left: '50%', transform: 'translateX(-50%)', borderRadius: '6px 6px 0 0', width: 48, height: 24 };

  return (
    <div className="terminal-frame" ref={containerRef}>
      <div style={{
        display: 'flex',
        height: showAdd ? 'calc(100% - 44px)' : '100%',
        transition: 'height 0.2s ease',
      }}>
        {layout && (
          <LayoutNode
            node={layout}
            onRemove={removePane}
            canRemove={panes.length > 1}
            containerRef={containerRef}
          />
        )}
      </div>

      {/* Add session footer */}
      {showAdd && (
        <div style={{
          height: 44,
          background: 'var(--bg2)',
          borderTop: '1px solid var(--bd)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          animation: 'fadeIn 0.15s ease',
        }}>
          <button className="btn btn-gold btn-sm" onClick={addPane} disabled={!canAdd}>
            + New Claude Session
          </button>
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>
            {panes.length}/4 &middot; same VPS &middot; same auth
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

      {/* Floating + button on the split edge */}
      {!showAdd && canAdd && (
        <button
          onClick={() => setShowAdd(true)}
          title="Add terminal session"
          style={{
            position: 'absolute',
            ...plusPosition,
            background: 'var(--gold)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: '#0B0B14',
            transition: 'all 0.15s',
            zIndex: 3,
            boxShadow: '0 0 8px rgba(212,175,55,0.3)',
          }}
          onMouseEnter={e => e.target.style.background = 'var(--gold2)'}
          onMouseLeave={e => e.target.style.background = 'var(--gold)'}
        >
          +
        </button>
      )}
    </div>
  );
}
