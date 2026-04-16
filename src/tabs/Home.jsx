import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../AppContext';
import { Plus, Trash2, Check } from 'lucide-react';

/* ── Calorie ring ──────────────────────────────────────────────── */
function CalorieRing({ consumed, goal, macros }) {
  const r   = 52;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(consumed / Math.max(goal, 1), 1);
  const offset = circ * (1 - pct);
  const color  = consumed > goal ? '#EF4444' : '#4F46E5';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle className="ring-track" cx="60" cy="60" r={r} />
          <circle
            className="ring-fill"
            cx="60" cy="60" r={r}
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {consumed}
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', marginTop: 2 }}>kcal</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 4px' }}>Daily goal</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          {goal} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#9CA3AF' }}>kcal</span>
        </p>
        <div style={{ background: '#F3F4F6', borderRadius: 999, height: 6, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: color, width: `${pct * 100}%`,
            transition: 'width 0.6s cubic-bezier(.16,1,.3,1)',
          }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 6, marginBottom: 8 }}>
          {Math.max(0, goal - consumed)} remaining
        </p>
        {macros && (
          <div style={{ display: 'flex', gap: 12, borderTop: '1px solid #F3F4F6', paddingTop: 8 }}>
            <div>
              <p style={{ fontSize: '0.625rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 2px' }}>Protein</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: 0 }}>{macros.protein}g</p>
            </div>
            <div>
              <p style={{ fontSize: '0.625rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 2px' }}>Carbs</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: 0 }}>{macros.carbs}g</p>
            </div>
            <div>
              <p style={{ fontSize: '0.625rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 2px' }}>Fat</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: 0 }}>{macros.fat}g</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Habit row ─────────────────────────────────────────────────── */
function HabitRow({ habit, done, onToggle, onDelete }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="card anim-fade-up"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <button onClick={() => onToggle(habit.id)} style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', width: '100%',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        opacity: done ? 0.6 : 1, transition: 'opacity 0.15s',
      }}>
        <div className={`habit-circle ${done ? 'done' : ''}`}>
          {done && <span className="anim-check"><Check size={12} color="white" strokeWidth={2.8} /></span>}
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', letterSpacing: '-0.01em' }}>
          {habit.emoji} {habit.label}
        </span>
        {done && (
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#10B981', fontWeight: 500 }}>Done</span>
        )}
      </button>
      {hov && (
        <button onClick={() => onDelete(habit.id)} className="anim-scale-in" style={{
          position: 'absolute', right: -8, top: -8,
          width: 22, height: 22, borderRadius: '50%',
          background: '#EF4444', border: '2.5px solid #F9FAFB',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Trash2 size={10} color="white" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

/* ── Home Tab ──────────────────────────────────────────────────── */
export default function HomeTab({ onToast }) {
  const { user, habits, setHabits, checked, setChecked, streak, totalCals, diary } = useApp();
  const [adding, setAdding]   = useState(false);
  const [label, setLabel]     = useState('');
  const inputRef              = useRef(null);

  useEffect(() => { if (adding) setTimeout(() => inputRef.current?.focus(), 40); }, [adding]);

  const toggle = useCallback(id => {
    setChecked(c => ({ ...c, [id]: !c[id] }));
  }, [setChecked]);

  const deleteHabit = useCallback(id => {
    setHabits(h => h.filter(x => x.id !== id));
    setChecked(c => { const { [id]: _, ...rest } = c; return rest; });
  }, [setHabits, setChecked]);

  const commitAdd = useCallback(() => {
    const l = label.trim();
    if (l) {
      setHabits(h => [...h, { id: `h_${Date.now()}`, label: l, emoji: '✦' }]);
      onToast?.('Habit added', '✓');
    }
    setLabel(''); setAdding(false);
  }, [label, setHabits, onToast]);

  const done = habits.filter(h => !!checked[h.id]).length;
  const pct  = habits.length > 0 ? Math.round((done / habits.length) * 100) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  };

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const macros = {
    protein: diary?.reduce((a, m) => a + Number(m.protein || 0), 0) || 0,
    carbs:   diary?.reduce((a, m) => a + Number(m.carbs   || 0), 0) || 0,
    fat:     diary?.reduce((a, m) => a + Number(m.fat     || 0), 0) || 0,
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ padding: '22px 20px 0' }} className="anim-fade-up">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 500, margin: '0 0 3px' }}>{dateStr}</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
              {greeting()}, {user.name}
            </h1>
          </div>
          {streak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(79,70,229,0.06)', borderRadius: 999,
              padding: '6px 12px',
            }}>
              <span style={{ fontSize: '0.875rem' }}>⚡</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4F46E5' }}>
                {streak}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Calorie summary ─────────────────────────────── */}
      <div style={{ padding: '16px 20px 0' }} className="anim-fade-up">
        <div className="card" style={{ padding: '18px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 14px' }}>
            Today's Nutrition
          </p>
          <CalorieRing consumed={totalCals} goal={Number(user.calorieGoal) || 2000} macros={macros} />
        </div>
      </div>

      {/* ── Habits ──────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
            Habits
          </h2>
          <span style={{ fontSize: '0.8125rem', color: done === habits.length && habits.length > 0 ? '#10B981' : '#9CA3AF', fontWeight: 500 }}>
            {done}/{habits.length} complete
          </span>
        </div>

        {/* Progress pill */}
        <div style={{ background: '#F3F4F6', borderRadius: 999, height: 5, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: done === habits.length && habits.length > 0 ? '#10B981' : '#4F46E5',
            width: `${pct}%`, transition: 'width 0.55s cubic-bezier(.16,1,.3,1)',
          }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {habits.map((h, i) => (
            <HabitRow
              key={h.id}
              habit={h}
              done={!!checked[h.id]}
              onToggle={toggle}
              onDelete={deleteHabit}
              style={{ animationDelay: `${i * 0.04}s` }}
            />
          ))}

          {/* Inline add */}
          {adding ? (
            <div className="card anim-scale-in" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="habit-circle" style={{ borderColor: '#A5B4FC' }} />
              <input
                ref={inputRef}
                className="inline-input"
                placeholder="e.g. Meditate 10 mins"
                value={label}
                onChange={e => setLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setAdding(false); setLabel(''); } }}
              />
              <button onClick={commitAdd} style={{
                background: '#4F46E5', color: 'white', border: 'none',
                borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: '0.8125rem',
                cursor: 'pointer',
              }}>Add</button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '13px 16px', width: '100%', background: 'transparent',
                border: '1.5px dashed #E5E7EB', borderRadius: 16,
                cursor: 'pointer', color: '#D1D5DB', fontSize: '0.875rem', fontWeight: 500,
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#A5B4FC'; e.currentTarget.style.color = '#4F46E5'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#D1D5DB'; }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#A5B4FC'; e.currentTarget.style.color = '#4F46E5'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#D1D5DB'; }}
            >
              <Plus size={15} />
              Add a habit
            </button>
          )}
        </div>
      </div>

      {/* ── Motivation footer ────────────────────────────── */}
      {done === habits.length && habits.length > 0 && (
        <div className="anim-scale-in" style={{
          margin: '16px 20px 0', padding: '14px 16px',
          background: '#ECFDF5', borderRadius: 14, border: '1px solid #D1FAE5',
        }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669', margin: 0 }}>
            🎉 All habits complete — streak extended!
          </p>
        </div>
      )}
    </div>
  );
}
