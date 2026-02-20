export interface DriveSession {
  id: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  alertsCount: number;
  warningsCount: number;
}

export interface AppSettings {
  sensitivity: 'low' | 'medium' | 'high';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  shareAnonymousData: boolean;
}

const SESSIONS_KEY = 'wakey_sessions';
const SETTINGS_KEY = 'wakey_settings';
const ONBOARDING_KEY = 'wakey_onboarding_done';

export const defaultSettings: AppSettings = {
  sensitivity: 'medium',
  soundEnabled: true,
  vibrationEnabled: true,
  shareAnonymousData: false,
};

export function getSessions(): DriveSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: DriveSession): void {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function setOnboardingDone(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
