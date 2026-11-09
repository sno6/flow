const STORAGE_KEY = "flow-sessions";

export interface SavedSession {
  id: string;
  idea: string;
  rawText: string;
  wordCount: number;
  createdAt: number;
}

export function getSessions(): SavedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedSession[];
  } catch {
    return [];
  }
}

export function saveSession(
  session: Omit<SavedSession, "id" | "createdAt">,
): SavedSession {
  const saved: SavedSession = {
    ...session,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const sessions = getSessions();
  sessions.unshift(saved);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return saved;
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
