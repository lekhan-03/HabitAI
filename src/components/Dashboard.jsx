import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Plus, Trash2, Droplets, Dumbbell, BookOpen, Moon, Zap, Flame, TrendingUp } from 'lucide-react';

/* ── Constants ──────────────────────────────────────────────────────── */
const TODAY_KEY   = () => `habits_day_${new Date().toISOString().split('T')[0]}`;
const HABITS_KEY  = 'habits_list';
const STREAK_KEY  = 'habit_streak';
const LAST_DAY_KEY = 'habit_last_day';

const DEFAULT_HABITS = [
  { id: 'water',   label: 'Drink 2L Water',    emoji: '💧' },
  { id: 'stretch', label: 'Morning Stretch',   emoji: '🧘' },
  { id: 'read',    label: 'Read 10 Pages',     emoji: '📖' },
  { id: 'sleep',   label: 'Sleep by 11 PM',    emoji: '🌙' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function todayString() {
  return new Date().toISOString().split('T')[0];
}

/* ── Streak logic ───────────────────────────────────────────────────── */
function computeStreak(habits, checked) {
  const allDone = habits.length > 0 && habits.every(h => !!checked[h.id]);
  const today   = todayString();
  const lastDay = localStorage.getItem(LAST_DAY_KEY);
  let   streak  = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);

  if (allDone && lastDay !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    streak = lastDay === yStr ? streak + 1 : 1;
    localStorage.setItem(STREAK_KEY, String(streak));
    localStorage.setItem(LAST_DAY_KEY, today);
  }

  return { streak, allDone };
}

/* ── Dashboard ──────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [habits,   setHabits]   = useState(() => {
    const s = localStorage.getItem(HABITS_KEY);
    return s ? JSON.parse(s) : DEFAULT_HABITS;
  });
  const [checked,  setChecked]  = useState(() => {
    const s = localStorage.getItem(TODAY_KEY());
    return s ? JSON.parse(s) : {};
  });
  const [adding,   setAdding]   = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [hovered,  setHovered]  = useState(null);
  const inputRef = useRef(null);

  /* persist */
  const saveHabits  = useCallback(h => { setHabits(h);  localStorage.setItem(HABITS_KEY, JSON.stringify(h)); }, []);
  const saveChecked = useCallback(c => { setChecked(c); localStorage.setItem(TODAY_KEY(), JSON.stringify(c)); }, []);

  /* streak */
  const [streakData, setStreakData] = useState({ streak: parseInt(localStorage.getItem(STREAK_KEY) || '0'), allDone: false });
  useEffect(() => {
    const data = computeStreak(habits, checked);
    setStreakData(data);
  }, [habits, checked]);

  /* toggle */
  const toggle = useCallback(id => {
    const next = { ...checked, [id]: !checked[id] };
    saveChecked(next);
  }, [checked, saveChecked]);

  /* add habit */
  const commitAdd = useCallback(() => {
    const label = newLabel.trim();
    if (!label) { setAdding(false); setNewLabel(''); return; }
    const newHabit = { id: `h_${Date.now()}`, label, emoji: '✦' };
    saveHabits([...habits, newHabit]);
    setNewLabel('');
    setAdding(false);
  }, [newLabel, habits, saveHabits]);

  /* delete */
  const deleteHabit = useCallback(id => {
    saveHabits(habits.filter(h => h.id !== id));
    const { [id]: _, ...rest } = checked;
    saveChecked(rest);
  }, [habits, checked, saveHabits, saveChecked]);

  /* focus input when adding */
  useEffect(() => {
    if (adding) setTimeout(() => inputRef.current?.focus(), 50);
  }, [adding]);

  const done  = habits.filter(h => !!checked[h.id]).length;
  const total = habits.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ padding: '20px 20px 0' }} className="anim-fade-up">
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginBottom: 4, fontWeight: 500 }}>
          {getGreeting()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>
            Today's Habits
          </h2>
          {streakData.streak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(79,70,229,0.07)', borderRadius: 999, padding: '5px 11px',
            }}>
              <span className="streak-dot" style={{ fontSize: '0.85rem' }}>⚡</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--indigo)' }}>
                {streakData.streak} day streak
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Progress ────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 0', animationDelay: '0.05s' }} className="anim-fade-up">
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)', fontWeight: 500 }}>
              Daily Progress
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: done === total && total > 0 ? 'var(--emerald)' : 'var(--text-2)' }}>
              {done}/{total}
            </span>
          </div>
          <div style={{ background: 'var(--border-sm)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              background: done === total && total > 0 ? 'var(--emerald)' : 'var(--indigo)',
              width: `${pct}%`,
              transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
          {streakData.allDone && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--emerald)', fontWeight: 500, marginTop: 10, marginBottom: 0 }}>
              🎉 All habits complete — streak extended!
            </p>
          )}
        </div>
      </div>

      {/* ── Habits List ─────────────────────────────────────── */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {habits.map((h, idx) => {
            const isDone = !!checked[h.id];
            const isHov  = hovered === h.id;
            return (
              <div
                key={h.id}
                className="card anim-fade-up"
                style={{ animationDelay: `${0.06 + idx * 0.04}s`, position: 'relative', overflow: 'hidden' }}
                onMouseEnter={() => setHovered(h.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  onClick={() => toggle(h.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                    opacity: isDone ? 0.6 : 1,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {/* Circle toggle */}
                  <div className={`habit-circle ${isDone ? 'done' : ''}`}>
                    {isDone && (
                      <span className="anim-check-pop">
                        <Check size={13} color="#fff" strokeWidth={2.5} />
                      </span>
                    )}
                  </div>

                  {/* Emoji + Label */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1rem' }}>{h.emoji}</span>
                      <span style={{
                        fontSize: '0.9375rem', fontWeight: 500,
                        color: isDone ? 'var(--text-4)' : 'var(--text-1)',
                        textDecoration: isDone ? 'line-through' : 'none',
                        transition: 'all 0.15s ease',
                      }}>{h.label}</span>
                    </div>
                    {isDone && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: 2, fontWeight: 500 }}>
                        Completed
                      </p>
                    )}
                  </div>
                </button>

                {/* Delete button on hover */}
                {isHov && (
                  <button
                    onClick={() => deleteHabit(h.id)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      width: 30, height: 30, borderRadius: '50%',
                      background: '#FEF2F2', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'opacity 0.15s',
                    }}
                    className="anim-scale-in"
                  >
                    <Trash2 size={13} color="#EF4444" strokeWidth={2} />
                  </button>
                )}
              </div>
            );
          })}

          {/* ── Inline Add ─────────────────────────────────── */}
          {adding ? (
            <div className="card anim-scale-in" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="habit-circle" style={{ borderColor: 'var(--indigo-md)' }} />
              <input
                ref={inputRef}
                className="inline-add-input"
                placeholder="New habit..."
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setAdding(false); setNewLabel(''); } }}
              />
              <button onClick={commitAdd} style={{
                background: 'var(--indigo)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: '0.8125rem',
                cursor: 'pointer',
              }}>
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '13px 16px', width: '100%', background: 'transparent',
                border: '1.5px dashed var(--border)', borderRadius: 'var(--r-lg)',
                cursor: 'pointer', color: 'var(--text-4)', fontSize: '0.875rem', fontWeight: 500,
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--indigo-md)'; e.currentTarget.style.color = 'var(--indigo)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-4)'; }}
            >
              <Plus size={15} />
              Add a habit
            </button>
          )}
        </div>
      </div>

      {/* ── Quick Stats ─────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: 10 }}>
        {[
          { label: 'Streak',     value: `${streakData.streak}d`, icon: '⚡' },
          { label: 'Today',      value: `${pct}%`,              icon: '📈' },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: 1, padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 4 }}>{s.icon}</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{s.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', margin: 0, fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
