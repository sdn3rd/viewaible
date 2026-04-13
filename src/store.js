const STORAGE_KEY = 'viewaible_connections';

export function loadConnections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConnections(connections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
}

export function addConnection(conn) {
  const connections = loadConnections();
  const id = crypto.randomUUID();
  const entry = { id, ...conn, createdAt: Date.now() };
  connections.push(entry);
  saveConnections(connections);
  return entry;
}

export function removeConnection(id) {
  const connections = loadConnections().filter(c => c.id !== id);
  saveConnections(connections);
  return connections;
}

export function updateConnection(id, updates) {
  const connections = loadConnections().map(c =>
    c.id === id ? { ...c, ...updates } : c
  );
  saveConnections(connections);
  return connections;
}
