import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, UtensilsCrossed, Camera, X } from 'lucide-react';

/* ── Local Storage Keys ─────────────────────────────────────────────── */
const DIARY_KEY    = () => `food_diary_${new Date().toISOString().split('T')[0]}`;
const SCAN_KEY     = 'food_scan_count';
const PREMIUM_KEY  = 'is_premium';
const GOAL_CALS    = 2000;

/* ── Mock AI result (randomised slightly for demo realism) ─────────── */
function getMockResult() {
  const meals = [
    { name: 'Grilled Chicken Salad', calories: 350, protein: 32, carbs: 14, fat: 9  },
    { name: 'Avocado Toast',         calories: 290, protein: 10, carbs: 28, fat: 16 },
    { name: 'Greek Yoghurt Bowl',    calories: 220, protein: 18, carbs: 24, fat: 5  },
    { name: 'Salmon & Quinoa',       calories: 480, protein: 40, carbs: 30, fat: 14 },
    { name: 'Egg White Omelette',    calories: 180, protein: 22, carbs: 4,  fat: 7  },
  ];
  return { ...meals[Math.floor(Math.random() * meals.length)] };
}

/* ── Macro Pill ─────────────────────────────────────────────────────── */
function MacroCell({ label, value, unit, onChange, color }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal]     = useState(String(value));
  const inputRef = useRef(null);

  useEffect(() => { setLocal(String(value)); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = () => {
    const n = parseFloat(local);
    if (!isNaN(n) && n >= 0) onChange(n);
    else setLocal(String(value));
    setEditing(false);
  };

  return (
    <div
      className="macro-cell"
      style={{
        flex: 1, padding: '12px 8px', borderRadius: 12,
        border: '1.5px solid var(--border)', textAlign: 'center',
        cursor: 'text', transition: 'background 0.15s, border-color 0.15s',
        background: 'var(--surface)',
      }}
      onClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); }}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            textAlign: 'center', fontWeight: 700, fontSize: '1.125rem',
            color: 'var(--text-1)', width: '100%',
          }}
        />
      ) : (
        <p style={{ fontSize: '1.125rem', fontWeight: 700, color: color || 'var(--text-1)', margin: 0 }}>
          {value}{unit}
        </p>
      )}
      <p style={{ fontSize: '0.6875rem', color: 'var(--text-4)', margin: '4px 0 0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </p>
      {!editing && (
        <p style={{ fontSize: '0.625rem', color: 'var(--indigo)', margin: '2px 0 0', opacity: 0.7 }}>tap to edit</p>
      )}
    </div>
  );
}

/* ── Meal Row ───────────────────────────────────────────────────────── */
function MealRow({ meal, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="anim-fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '13px 16px',
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        border: '1px solid var(--border-sm)',
        position: 'relative',
        transition: 'box-shadow 0.15s',
        boxShadow: hovered ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: 'var(--indigo-lt)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <UtensilsCrossed size={16} color="var(--indigo)" strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {meal.name}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', margin: '2px 0 0' }}>
          P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g · {meal.time}
        </p>
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', flexShrink: 0 }}>
        {meal.calories} kcal
      </span>
      {hovered && onDelete && (
        <button
          onClick={onDelete}
          className="anim-scale-in"
          style={{
            position: 'absolute', right: -8, top: -8,
            width: 22, height: 22, borderRadius: '50%',
            background: '#EF4444', border: '2px solid var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={10} color="#fff" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

/* ── Analysing Overlay ─────────────────────────────────────────────── */
function AnalyzingOverlay({ preview }) {
  return (
    <div className="analyzing-overlay">
      {preview && (
        <div style={{
          width: 120, height: 120, borderRadius: 20, overflow: 'hidden',
          boxShadow: 'var(--shadow-md)', flexShrink: 0,
        }}>
          <img src={preview} alt="meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Pulsing rings */}
      <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid var(--indigo)',
            opacity: 0,
            animation: `fade-in 1.5s ease-in-out ${i * 0.5}s infinite`,
          }} />
        ))}
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--indigo-lt)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Camera size={20} color="var(--indigo)" strokeWidth={1.8} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p className="analyzing-text">Analyzing macro-composition...</p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: 6 }}>
          AI is identifying ingredients &amp; nutrients
        </p>
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['Protein', 'Carbs', 'Fats', 'Calories'].map((t, i) => (
          <span key={t} style={{
            fontSize: '0.6875rem', fontWeight: 500,
            background: 'var(--indigo-lt)', color: 'var(--indigo)',
            borderRadius: 999, padding: '4px 10px',
            animation: `pulse-dot 1.8s ease-in-out ${i * 0.3}s infinite`,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main FoodLogger ────────────────────────────────────────────────── */
export default function FoodLogger({ onPaywallNeeded, onToast }) {
  const [diary,    setDiary]    = useState(() => {
    const s = localStorage.getItem(DIARY_KEY());
    return s ? JSON.parse(s) : [];
  });
  const [phase,    setPhase]    = useState('diary'); // diary | analyzing | result
  const [preview,  setPreview]  = useState(null);
  const [result,   setResult]   = useState(null);   // editable macro object
  const fileRef = useRef(null);

  const isPremium  = () => localStorage.getItem(PREMIUM_KEY) === 'true';
  const getScanCnt = () => parseInt(localStorage.getItem(SCAN_KEY) || '0', 10);

  const saveDiary = useCallback(meals => {
    setDiary(meals);
    localStorage.setItem(DIARY_KEY(), JSON.stringify(meals));
  }, []);

  /* ── File chosen ─────────────────────────────────────────── */
  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const scanCount = getScanCnt();

    // Intercept on 3rd scan (0-indexed: after 2 successful scans)
    if (!isPremium() && scanCount >= 2) {
      onPaywallNeeded();
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setPhase('analyzing');

    setTimeout(() => {
      const mock = getMockResult();
      setResult(mock);
      localStorage.setItem(SCAN_KEY, String(scanCount + 1));
      setPhase('result');
    }, 2500);
  };

  /* ── Save to diary ───────────────────────────────────────── */
  const handleSave = () => {
    const meal = {
      ...result,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: Date.now(),
    };
    saveDiary([...diary, meal]);
    onToast?.('Meal saved to diary', '✓');
    setPhase('diary');
    setPreview(null);
    setResult(null);
  };

  const handleDelete = id => {
    saveDiary(diary.filter(m => m.id !== id));
  };

  /* totals */
  const totalCals    = diary.reduce((a, m) => a + (m.calories || 0), 0);
  const totalProtein = diary.reduce((a, m) => a + (m.protein  || 0), 0);
  const calPct       = Math.min((totalCals / GOAL_CALS) * 100, 100);

  /* ──────────────── RENDER ─────────────────────────────────── */

  /* Analyzing overlay */
  if (phase === 'analyzing') return <AnalyzingOverlay preview={preview} />;

  /* Result card */
  if (phase === 'result' && result) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
        <div style={{ padding: '20px 20px 0' }} className="anim-fade-up">
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>
            AI Result
          </p>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Meal Analysis
          </h2>
        </div>

        {/* Image preview */}
        {preview && (
          <div style={{ margin: '0 20px', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 180 }} className="anim-fade-up">
            <img src={preview} alt="meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Identified label */}
        <div style={{ padding: '12px 20px 0' }} className="anim-fade-up">
          <div className="card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Identified
              </span>
            </div>
            <input
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-1)', width: '100%',
                letterSpacing: '-0.01em',
              }}
              value={result.name}
              onChange={e => setResult(r => ({ ...r, name: e.target.value }))}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', margin: '4px 0 0' }}>
              Tap any value below to adjust
            </p>
          </div>
        </div>

        {/* Macro cells */}
        <div style={{ padding: '10px 20px 0', display: 'flex', gap: 8 }} className="anim-fade-up">
          <MacroCell label="Calories" value={result.calories} unit="" color="var(--text-1)"
            onChange={v => setResult(r => ({ ...r, calories: Math.round(v) }))} />
          <MacroCell label="Protein"  value={result.protein}  unit="g" color="#3B82F6"
            onChange={v => setResult(r => ({ ...r, protein: Math.round(v) }))} />
          <MacroCell label="Carbs"    value={result.carbs}    unit="g" color="#F59E0B"
            onChange={v => setResult(r => ({ ...r, carbs: Math.round(v) }))} />
          <MacroCell label="Fat"      value={result.fat}      unit="g" color="#EF4444"
            onChange={v => setResult(r => ({ ...r, fat: Math.round(v) }))} />
        </div>

        {/* Action buttons */}
        <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }} className="anim-fade-up">
          <button className="btn-primary" onClick={handleSave}>
            Save to Diary
          </button>
          <button className="btn-ghost" onClick={() => { setPhase('diary'); setPreview(null); setResult(null); }}>
            Discard
          </button>
        </div>
      </div>
    );
  }

  /* ── Diary view (main) ─────────────────────────────────────── */
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80, position: 'relative' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0' }} className="anim-fade-up">
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Food Diary
        </h2>
      </div>

      {/* Calorie summary card */}
      <div style={{ padding: '0 20px' }} className="anim-fade-up" style={{ animationDelay: '0.04s' }}>
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Calories
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {totalCals}
                <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-3)', marginLeft: 4 }}>
                  / {GOAL_CALS}
                </span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', margin: '0 0 2px' }}>Protein today</p>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#3B82F6', margin: 0 }}>{totalProtein}g</p>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ background: 'var(--border-sm)', borderRadius: 999, height: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              background: totalCals > GOAL_CALS ? '#EF4444' : 'var(--indigo)',
              width: `${calPct}%`,
              transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-4)' }}>0</span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-4)' }}>{GOAL_CALS} goal</span>
          </div>
        </div>
      </div>

      {/* Meals list */}
      <div style={{ padding: '16px 20px 0' }}>
        {diary.length === 0 ? (
          <div className="anim-fade-up" style={{
            textAlign: 'center', padding: '48px 24px',
            background: 'var(--surface)', borderRadius: 'var(--r-lg)',
            border: '1.5px dashed var(--border)',
          }}>
            <p style={{ fontSize: '2rem', marginBottom: 10 }}>🍽️</p>
            <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-2)', margin: '0 0 6px' }}>
              No meals logged yet
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', margin: 0 }}>
              Tap the + button to snap a meal
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {diary.map((meal, i) => (
              <MealRow key={meal.id ?? i} meal={meal} onDelete={() => handleDelete(meal.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Scan counter hint */}
      {!isPremium() && (
        <div style={{ padding: '14px 20px 0' }} className="anim-fade-up">
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--r)',
            background: 'var(--indigo-lt)', border: '1px solid var(--indigo-md)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: '0.875rem' }}>📸</span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--indigo)', margin: 0, fontWeight: 500 }}>
              {Math.max(0, 2 - getScanCnt())} free scan{Math.max(0, 2 - getScanCnt()) !== 1 ? 's' : ''} remaining
              {getScanCnt() >= 2 ? ' — upgrade for unlimited' : ''}
            </p>
          </div>
        </div>
      )}

      {/* FAB */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={handleFile} />

      <button
        onClick={() => fileRef.current?.click()}
        style={{
          position: 'absolute', bottom: 92, right: 20,
          width: 52, height: 52, borderRadius: '50%',
          background: 'var(--indigo)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          zIndex: 10,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(79,70,229,0.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,70,229,0.35)'; }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.95)'; }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
      >
        <Plus size={22} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  );
}
