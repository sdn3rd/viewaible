import { useState, useEffect, useCallback } from 'react';
import { CSS } from './styles';
import { loadConnections, addConnection, removeConnection } from './store';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';
import Setup from './components/Setup';
import Footer from './components/Footer';
import Settings from './components/Settings';

const SETTINGS_KEY = 'viewaible_settings';
const THEME_KEY = 'viewaible_theme';

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; }
}

function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function resolveTheme(pref) {
  if (pref === 'system') return getSystemTheme();
  return pref || 'dark';
}

export default function App() {
  const [connections, setConnections] = useState(() => loadConnections());
  const [activeId, setActiveId] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => loadSettings());
  const [themePref, setThemePref] = useState(() => localStorage.getItem(THEME_KEY) || 'system');
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(localStorage.getItem(THEME_KEY) || 'system'));

  // Apply theme to document
  useEffect(() => {
    const resolved = resolveTheme(themePref);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  }, [themePref]);

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      if (themePref === 'system') {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themePref]);

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

  const handleThemeChange = useCallback((pref) => {
    setThemePref(pref);
    localStorage.setItem(THEME_KEY, pref);
  }, []);

  const handleSettingsChange = useCallback((s) => {
    setSettings(s);
    saveSettings(s);
  }, []);

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
          onSettings={() => setShowSettings(true)}
        />
        <div className="main" style={{ paddingBottom: 28 }}>
          {active && (
            <div className="terminal-bar">
              <div className="status">
                <div className="vps-dot connected" />
                <span>{active.name}</span>
              </div>
            </div>
          )}
          <Terminal connection={active} settings={settings} />
          {(showSetup || showWizard) && (
            <Setup
              onSave={handleAdd}
              onCancel={connections.length > 0 ? () => setShowSetup(false) : undefined}
            />
          )}
        </div>
      </div>
      <Footer />
      {showSettings && (
        <Settings
          settings={settings}
          onChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
          theme={themePref}
          onThemeChange={handleThemeChange}
        />
      )}
    </>
  );
}
