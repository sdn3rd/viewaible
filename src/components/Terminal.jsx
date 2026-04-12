export default function Terminal({ connection }) {
  if (!connection) {
    return (
      <div className="empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="18" rx="2"/>
          <path d="M7 9l3 3-3 3"/>
          <line x1="13" y1="15" x2="17" y2="15"/>
        </svg>
        <p>Add a VPS connection to get started with Claude Code in your browser.</p>
      </div>
    );
  }

  const { host, ttydPort, ttydUser, ttydPass } = connection;
  const proto = ttydPort === 443 ? 'https' : 'http';

  let src;
  if (ttydUser && ttydPass) {
    src = `${proto}://${ttydUser}:${ttydPass}@${host}:${ttydPort}`;
  } else {
    src = `${proto}://${host}:${ttydPort}`;
  }

  return (
    <div className="terminal-frame">
      <iframe
        key={connection.id}
        src={src}
        title={`Terminal — ${connection.name}`}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
