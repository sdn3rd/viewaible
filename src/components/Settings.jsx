import { useState } from 'react';

const PRESETS = [
  { id: 'default', name: 'Default', bg: '#000000', fg: '#E8E8F0', cursor: '#D4AF37' },
  { id: 'matrix', name: 'Matrix', bg: '#0A0A0A', fg: '#00FF41', cursor: '#00FF41' },
  { id: 'dracula', name: 'Dracula', bg: '#282A36', fg: '#F8F8F2', cursor: '#BD93F9' },
  { id: 'solarized', name: 'Solarized', bg: '#002B36', fg: '#839496', cursor: '#B58900' },
  { id: 'monokai', name: 'Monokai', bg: '#272822', fg: '#F8F8F2', cursor: '#F92672' },
  { id: 'nord', name: 'Nord', bg: '#2E3440', fg: '#D8DEE9', cursor: '#88C0D0' },
  { id: 'ocean', name: 'Ocean', bg: '#1B2838', fg: '#C0C5CE', cursor: '#6699CC' },
  { id: 'paper', name: 'Paper', bg: '#F5F5F0', fg: '#333333', cursor: '#D4AF37' },
  { id: 'amber', name: 'Amber CRT', bg: '#1A1000', fg: '#FFB000', cursor: '#FFB000' },
];

const FONTS = [
  'JetBrains Mono',
  'Fira Code',
  'Cascadia Code',
  'Source Code Pro',
  'IBM Plex Mono',
  'Inconsolata',
  'Ubuntu Mono',
  'Courier New',
  'monospace',
];

const SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20];

export default function Settings({ settings, onChange, onClose, theme, onThemeChange }) {
  const [activePreset, setActivePreset] = useState(settings.preset || 'default');

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    onChange({
      ...settings,
      preset: preset.id,
      termBg: preset.bg,
      termFg: preset.fg,
      termCursor: preset.cursor,
    });
  };

  const updateField = (key, value) => {
    setActivePreset('custom');
    onChange({ ...settings, [key]: value, preset: 'custom' });
  };

  return (
    <div className="settings-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="settings-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>Settings</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>&times;</button>
        </div>

        {/* Theme */}
        <div className="settings-section">
          <h3>Theme</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {['dark', 'light', 'system'].map(t => (
              <button
                key={t}
                className={`btn btn-sm ${theme === t ? 'btn-gold' : 'btn-ghost'}`}
                onClick={() => onThemeChange(t)}
                style={{ flex: 1, textTransform: 'capitalize' }}
              >
                {t === 'system' ? 'Auto' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal font */}
        <div className="settings-section">
          <h3>Terminal Font</h3>
          <div className="field-row">
            <div className="field">
              <label>Font Family</label>
              <select
                value={settings.termFont || 'JetBrains Mono'}
                onChange={e => onChange({ ...settings, termFont: e.target.value })}
              >
                {FONTS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ maxWidth: 100 }}>
              <label>Size</label>
              <select
                value={settings.termSize || 13}
                onChange={e => onChange({ ...settings, termSize: parseInt(e.target.value) })}
              >
                {SIZES.map(s => (
                  <option key={s} value={s}>{s}px</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Color presets */}
        <div className="settings-section">
          <h3>Terminal Colors</h3>
          <div className="preset-grid">
            {PRESETS.map(p => (
              <button
                key={p.id}
                className={`preset-btn ${activePreset === p.id ? 'active' : ''}`}
                style={{ background: p.bg, color: p.fg, borderColor: activePreset === p.id ? 'var(--gold)' : p.bg }}
                onClick={() => applyPreset(p)}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Custom colors */}
          <div className="color-row">
            <label>Background</label>
            <input
              type="color"
              value={settings.termBg || '#000000'}
              onChange={e => updateField('termBg', e.target.value)}
            />
            <span style={{ fontSize: 11, color: 'var(--tx3)', fontFamily: 'var(--mono)' }}>
              {settings.termBg || '#000000'}
            </span>
          </div>
          <div className="color-row">
            <label>Foreground</label>
            <input
              type="color"
              value={settings.termFg || '#E8E8F0'}
              onChange={e => updateField('termFg', e.target.value)}
            />
            <span style={{ fontSize: 11, color: 'var(--tx3)', fontFamily: 'var(--mono)' }}>
              {settings.termFg || '#E8E8F0'}
            </span>
          </div>
          <div className="color-row">
            <label>Cursor</label>
            <input
              type="color"
              value={settings.termCursor || '#D4AF37'}
              onChange={e => updateField('termCursor', e.target.value)}
            />
            <span style={{ fontSize: 11, color: 'var(--tx3)', fontFamily: 'var(--mono)' }}>
              {settings.termCursor || '#D4AF37'}
            </span>
          </div>
        </div>

        {/* Preview */}
        <div className="settings-section">
          <h3>Preview</h3>
          <div style={{
            background: settings.termBg || '#000000',
            color: settings.termFg || '#E8E8F0',
            fontFamily: (settings.termFont || 'JetBrains Mono') + ', monospace',
            fontSize: settings.termSize || 13,
            padding: 16,
            borderRadius: 'var(--radius)',
            border: '1px solid var(--bd)',
            lineHeight: 1.6,
          }}>
            <span style={{ color: settings.termCursor || '#D4AF37' }}>$</span> claude<br/>
            <span style={{ opacity: 0.6 }}>Claude Code v2.1</span><br/>
            <span style={{ color: settings.termCursor || '#D4AF37' }}>$</span>{' '}
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '1em',
              background: settings.termCursor || '#D4AF37',
              verticalAlign: 'text-bottom',
            }}/>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              applyPreset(PRESETS[0]);
              onChange({ preset: 'default', termBg: '#000000', termFg: '#E8E8F0', termCursor: '#D4AF37', termFont: 'JetBrains Mono', termSize: 13 });
            }}
          >
            Reset to Default
          </button>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-gold btn-sm" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
