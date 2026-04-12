import { VERSION } from '../version';

export default function Footer() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 28,
      background: 'var(--bg2)',
      borderTop: '1px solid var(--bd)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      fontSize: 11,
      color: 'var(--tx3)',
      zIndex: 5,
      fontFamily: 'var(--fb)',
    }}>
      <span>viewAIble v{VERSION}</span>
      <span>
        MIT License &middot;{' '}
        <a
          href="https://github.com/sdn3rd/viewaible"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--tx2)', textDecoration: 'none' }}
        >
          GitHub
        </a>
      </span>
    </div>
  );
}
