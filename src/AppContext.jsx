import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ── Local Storage keys ──────────────────────────────────────────── */
export const LS = {
  USER:       'ha_user',
  HABITS:     'ha_habits',
  CHECKED:    () => `ha_checked_${today()}`,
  DIARY:      () => `ha_diary_${today()}`,
  SCAN_COUNT: 'ha_scan_count',
  IS_PREMIUM: 'ha_is_premium',
  STREAK:     'ha_streak',
  LAST_DAY:   'ha_last_day',
};

export function today() {
  return new Date().toISOString().split('T')[0];
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function ls_get(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function ls_set(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ── Default data ────────────────────────────────────────────────── */
const DEFAULT_USER = {
  name:        'Alex',
  calorieGoal: 2000,
  weight:      '60',
  notifs:      true,
  darkMode:    false,
};

const DEFAULT_HABITS = [
  { id: 'water',   label: 'Drink 2L Water',  emoji: '💧' },
  { id: 'stretch', label: 'Morning Stretch',  emoji: '🧘' },
  { id: 'read',    label: 'Read 10 Pages',    emoji: '📖' },
  { id: 'sleep',   label: 'Sleep by 11 PM',  emoji: '🌙' },
];

/* ── Context ─────────────────────────────────────────────────────── */
const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }) {
  /* User / settings */
  const [user, _setUser] = useState(() => ({
    ...DEFAULT_USER,
    ...ls_get(LS.USER, {}),
  }));
  const setUser = useCallback(patch => {
    _setUser(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      ls_set(LS.USER, next);
      return next;
    });
  }, []);

  /* Habits list */
  const [habits, _setHabits] = useState(() => ls_get(LS.HABITS, DEFAULT_HABITS));
  const setHabits = useCallback(val => {
    const next = typeof val === 'function' ? val(habits) : val;
    _setHabits(next);
    ls_set(LS.HABITS, next);
  }, [habits]);

  /* Today's checked map */
  const [checked, _setChecked] = useState(() => ls_get(LS.CHECKED(), {}));
  const setChecked = useCallback(val => {
    const next = typeof val === 'function' ? val(checked) : val;
    _setChecked(next);
    ls_set(LS.CHECKED(), next);
  }, [checked]);

  /* Today's diary */
  const [diary, _setDiary] = useState(() => ls_get(LS.DIARY(), []));
  const setDiary = useCallback(val => {
    const next = typeof val === 'function' ? val(diary) : val;
    _setDiary(next);
    ls_set(LS.DIARY(), next);
  }, [diary]);

  /* Premium + scan count */
  const [isPremium, _setIsPremium] = useState(() => ls_get(LS.IS_PREMIUM, false));
  const setPremium = useCallback(v => { _setIsPremium(v); ls_set(LS.IS_PREMIUM, v); }, []);

  const [scanCount, _setScanCount] = useState(() => ls_get(LS.SCAN_COUNT, 0));
  const incrementScan = useCallback(() => {
    _setScanCount(c => { const n = c + 1; ls_set(LS.SCAN_COUNT, n); return n; });
  }, []);
  const resetScans = useCallback(() => { _setScanCount(0); ls_set(LS.SCAN_COUNT, 0); }, []);

  /* Streak */
  const [streak, setStreak] = useState(() => ls_get(LS.STREAK, 0));

  /* Compute streak whenever checked/habits change */
  useEffect(() => {
    const allDone = habits.length > 0 && habits.every(h => !!checked[h.id]);
    if (!allDone) return;
    const tod  = today();
    const last = localStorage.getItem(LS.LAST_DAY);
    if (last === tod) return;                          // already counted today
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    const next = last === yStr ? streak + 1 : 1;
    setStreak(next);
    ls_set(LS.STREAK, next);
    localStorage.setItem(LS.LAST_DAY, tod);
  }, [habits, checked, streak]);

  /* Derived */
  const totalCals = diary.reduce((a, m) => a + Number(m.calories || 0), 0);

  return (
    <AppCtx.Provider value={{
      user, setUser,
      habits, setHabits,
      checked, setChecked,
      diary, setDiary,
      isPremium, setPremium,
      scanCount, incrementScan, resetScans,
      streak,
      totalCals,
    }}>
      {children}
    </AppCtx.Provider>
  );
}
