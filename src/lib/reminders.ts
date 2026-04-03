export interface Reminder {
  id: string;
  label: string;
  time: string; // HH:mm
  enabled: boolean;
  type: 'workout' | 'meal' | 'sleep' | 'meditation' | 'water';
}

const STORAGE_KEY = 'fitlife_reminders';

const DEFAULT_REMINDERS: Reminder[] = [
  { id: 'workout', label: '운동 시간', time: '18:00', enabled: false, type: 'workout' },
  { id: 'breakfast', label: '아침 식사 기록', time: '08:30', enabled: false, type: 'meal' },
  { id: 'lunch', label: '점심 식사 기록', time: '12:30', enabled: false, type: 'meal' },
  { id: 'dinner', label: '저녁 식사 기록', time: '19:00', enabled: false, type: 'meal' },
  { id: 'sleep', label: '수면 준비', time: '22:30', enabled: false, type: 'sleep' },
  { id: 'meditation', label: '명상 시간', time: '07:00', enabled: false, type: 'meditation' },
  { id: 'water', label: '물 마시기', time: '10:00', enabled: false, type: 'water' },
];

export function getReminders(): Reminder[] {
  if (typeof window === 'undefined') return DEFAULT_REMINDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_REMINDERS;
  } catch { return DEFAULT_REMINDERS; }
}

export function saveReminders(reminders: Reminder[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

/** 브라우저 알림 권한 요청 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** 알림 스케줄 등록 (Service Worker 기반) */
export function scheduleReminder(reminder: Reminder): void {
  if (!reminder.enabled) return;

  const [h, m] = reminder.time.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('FitLife', { body: reminder.label, icon: '/icons/icon-192x192.png' });
    }
  }, delay);
}

/** 모든 활성 알림 등록 */
export function scheduleAllReminders(): void {
  const reminders = getReminders();
  reminders.filter(r => r.enabled).forEach(scheduleReminder);
}
