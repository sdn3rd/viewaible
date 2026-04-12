import { useState, useRef, useEffect } from 'react';
import Logo from './Logo';

// Layout for 1-4 panes:
// 1: [  full  ]
// 2: [ left | right ] (if wide) or [ top / bottom ] (if tall)
// 3: T-shape: [ left | right ] on top, [ full-width ] on bottom (or rotated if tall)
// 4: 2x2 grid

function Pane({ pane, onRemove, canRemove }) {
  return (
    <div style={{ flex: 1, position: 'relative', minHeight: 0, minWidth: 0 }}>
      <iframe
        src={`/terminal/?t=${pane.id}`}
        title={`Terminal ${pane.id}`}
        allow="clipboard-read; clipboard-write"
        style={{ width: '100%', height: '100%', border: 'none', background: '#000' }}
      />
      {canRemove && (
        <button
          onClick={() => onRemove(pane.id)}
          title="Close pane"
          style={{
            position: 'absolute', top: 4, right: 8,
            background: 'rgba(11,11,20,0.85)', border: '1px solid var(--bd)',
            borderRadius: 6, color: 'var(--tx3)', fontSize: 14,
            width: 24, height: 24, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', zIndex: 2, lineHeight: 1,
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

const SPLIT_BORDER = { background: 'var(--bd)', flexShrink: 0 };

function PaneLayout({ panes, onRemove, isWide }) {
  const canRemove = panes.length > 1;
  const hDiv = { ...SPLIT_BORDER, width: '2px', minWidth: '2px' };
  const vDiv = { ...SPLIT_BORDER, height: '2px', minHeight: '2px' };

  if (panes.length === 1) {
    return <Pane pane={panes[0]} onRemove={onRemove} canRemove={canRemove} />;
  }

  if (panes.length === 2) {
    // Split along the bigger dimension
    if (isWide) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}>
          <Pane pane={panes[0]} onRemove={onRemove} canRemove={canRemove} />
          <div style={hDiv} />
          <Pane pane={panes[1]} onRemove={onRemove} canRemove={canRemove} />
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Pane pane={panes[0]} onRemove={onRemove} canRemove={canRemove} />
        <div style={vDiv} />
        <Pane pane={panes[1]} onRemove={onRemove} canRemove={canRemove} />
      </div>
    );
  }

  if (panes.length === 3) {
    // T-shape: two on top (or left), one full-width on bottom (or right)
    if (isWide) {
      // Wide: top row split vertically, bottom row full width
      return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}>
            <Pane pane={panes[0]} onRemove={onRemove} canRemove={canRemove} />
            <div style={hDiv} />
            <Pane pane={panes[1]} onRemove={onRemove} canRemove={canRemove} />
          </div>
          <div style={vDiv} />
          <Pane pane={panes[2]} onRemove={onRemove} canRemove={canRemove} />
        </div>
      );
    }
    // Tall: left column split horizontally, right column full height
    return (
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <Pane pane={panes[0]} onRemove={onRemove} canRemove={canRemove} />
          <div style={vDiv} />
          <Pane pane={panes[1]} onRemove={onRemove} canRemove={canRemove} />
        </div>
        <div style={hDiv} />
        <Pane pane={panes[2]} onRemove={onRemove} canRemove={canRemove} />
      </div>
    );
  }

  // 4 panes: 2x2 grid
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}>
        <Pane pane={panes[0]} onRemove={onRemove} canRemove={canRemove} />
        <div style={hDiv} />
        <Pane pane={panes[1]} onRemove={onRemove} canRemove={canRemove} />
      </div>
      <div style={vDiv} />
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}>
        <Pane pane={panes[2]} onRemove={onRemove} canRemove={canRemove} />
        <div style={hDiv} />
        <Pane pane={panes[3]} onRemove={onRemove} canRemove={canRemove} />
      </div>
    </div>
  );
}

export default function Terminal({ connection, settings }) {
  const [panes, setPanes] = useState([{ id: 1 }]);
  const [showAdd, setShowAdd] = useState(false);
  const containerRef = useRef(null);
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setIsWide(entry.contentRect.width >= entry.contentRect.height);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  if (!connection) {
    return (
      <div className="empty">
        <Logo size={96} />
        <div style={{
          fontFamily: 'var(--fd)',
          fontSize: 28,
          fontWeight: 500,
          color: 'var(--tx2)',
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}>
          view<span style={{ color: 'var(--gold)', fontWeight: 900 }}>AI</span>ble
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--tx3)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          divide and conquer, anywhere
        </div>
        <p style={{ marginTop: 16 }}>
          Add a VPS to get started with Claude Code in your browser.
        </p>
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

  // + button position: on the edge where the next split would happen
  const plusStyle = (() => {
    if (panes.length === 1) {
      // Next split: horizontal if wide, vertical if tall
      return isWide
        ? { right: 0, top: '50%', transform: 'translateY(-50%)', borderRadius: '6px 0 0 6px', width: 24, height: 44 }
        : { bottom: 0, left: '50%', transform: 'translateX(-50%)', borderRadius: '6px 6px 0 0', width: 44, height: 24 };
    }
    if (panes.length === 2) {
      // Next split adds the T-bar
      return isWide
        ? { bottom: 0, left: '50%', transform: 'translateX(-50%)', borderRadius: '6px 6px 0 0', width: 44, height: 24 }
        : { right: 0, top: '50%', transform: 'translateY(-50%)', borderRadius: '6px 0 0 6px', width: 24, height: 44 };
    }
    // 3 panes → 4th makes a grid, put + in center
    return { bottom: '50%', right: 0, transform: 'translateY(50%)', borderRadius: '6px 0 0 6px', width: 24, height: 44 };
  })();

  return (
    <div className="terminal-frame" ref={containerRef}>
      <div style={{
        display: 'flex',
        height: showAdd ? 'calc(100% - 40px)' : '100%',
        transition: 'height 0.15s ease',
      }}>
        <PaneLayout panes={panes} onRemove={removePane} isWide={isWide} />
      </div>

      {/* Add session footer */}
      {showAdd && (
        <div style={{
          height: 40,
          background: 'var(--bg2)',
          borderTop: '1px solid var(--bd)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          animation: 'fadeIn 0.15s ease',
        }}>
          <button className="btn btn-gold btn-sm" onClick={addPane} disabled={!canAdd}>
            + New Session
          </button>
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>
            {panes.length}/4
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

      {/* Floating + button */}
      {!showAdd && canAdd && (
        <button
          onClick={() => setShowAdd(true)}
          title="Add session"
          style={{
            position: 'absolute',
            ...plusStyle,
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
            boxShadow: '0 0 8px rgba(212,175,55,0.25)',
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
