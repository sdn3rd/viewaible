import { useState, useEffect } from 'react';
import { CSS } from './styles';
import { loadConnections, addConnection, removeConnection } from './store';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';
import Setup from './components/Setup';
import Footer from './components/Footer';

export default function App() {
  const [connections, setConnections] = useState(() => loadConnections());
  const [activeId, setActiveId] = useState(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (connections.length > 0 && !activeId) {
      setActiveId(connections[0].id);
    }
  }, [connections, activeId]);

  const active = connections.find(c => c.id === activeId) || null;

  const handleAdd = (conn) => {
    const entry = addConnection(conn);
    setConnections(loadConnections());
    setActiveId(entry.id);
    setShowSetup(false);
  };

  const handleRemove = (id) => {
    const updated = removeConnection(id);
    setConnections(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const showWizard = connections.length === 0 && !showSetup;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Sidebar
          connections={connections}
          activeId={activeId}
          onSelect={setActiveId}
          onAdd={() => setShowSetup(true)}
          onRemove={handleRemove}
        />
        <div className="main" style={{ paddingBottom: 28 }}>
          {active && (
            <div className="terminal-bar">
              <div className="status">
                <div className="vps-dot connected" />
                <span>{active.name}</span>
              </div>
              <span style={{ color: 'var(--tx3)' }}>
                {active.host}:{active.ttydPort}
              </span>
            </div>
          )}
          <Terminal connection={active} />
          {(showSetup || showWizard) && (
            <Setup
              onSave={handleAdd}
              onCancel={connections.length > 0 ? () => setShowSetup(false) : undefined}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
