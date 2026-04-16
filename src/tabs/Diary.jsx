import { useState, useRef, useCallback } from 'react';
import { useApp } from '../AppContext';
import { Plus, UtensilsCrossed, Camera, X, Edit2 } from 'lucide-react';

 

const MOCK_MEALS = [
  { name: 'Grilled Chicken Salad', calories: 350, protein: 30, carbs: 15, fat: 10 },
  { name: 'Avocado Toast',         calories: 290, protein: 10, carbs: 28, fat: 16 },
  { name: 'Greek Yoghurt Bowl',    calories: 220, protein: 18, carbs: 24, fat: 5  },
  { name: 'Salmon & Quinoa',       calories: 480, protein: 40, carbs: 30, fat: 14 },
];

/* ── Editable macro cell ──────────────────────────────────────── */
function MacroCell({ label, value, unit, color, onChange }) {
  const [editing, setEditing] = useState(false);
  const [local,   setLocal]   = useState(String(value));
  const inputRef = useRef(null);

  const commit = () => {
    const n = parseFloat(local);
    onChange(!isNaN(n) && n >= 0 ? Math.round(n) : value);
    setEditing(false);
  };

  return (
    <div
      className="macro-cell"
      onClick={() => { setEditing(true); setLocal(String(value)); setTimeout(() => inputRef.current?.select(), 30); }}
    >
      {editing ? (
        <input ref={inputRef} className="macro-cell input" value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={commit} onKeyDown={e => e.key === 'Enter' && commit()}
          style={{ fontSize: '1.1rem', fontWeight: 700, color }}
        />
      ) : (
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color, margin: 0 }}>{value}{unit}</p>
      )}
      <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
        {label}
      </p>
      {!editing && (
        <p style={{ fontSize: '0.6rem', color: '#A5B4FC', margin: '2px 0 0' }}>tap to edit</p>
      )}
    </div>
  );
}

/* ── Meal row ─────────────────────────────────────────────────── */
function MealRow({ meal, onDelete }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="card anim-fade-up" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <UtensilsCrossed size={16} color="#4F46E5" strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {meal.name}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '2px 0 0' }}>
          P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g · {meal.time}
        </p>
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', flexShrink: 0 }}>
        {meal.calories} kcal
      </span>
      {hov && onDelete && (
        <button onClick={onDelete} className="anim-scale-in" style={{
          position: 'absolute', right: -8, top: -8,
          width: 22, height: 22, borderRadius: '50%',
          background: '#EF4444', border: '2.5px solid #F9FAFB',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <X size={10} color="white" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

/* ── Analyzing Overlay ────────────────────────────────────────── */
function AnalyzingOverlay({ preview }) {
  return (
    <div className="anim-fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 80,
      background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
    }}>
      {preview && (
        <div style={{ width: 110, height: 110, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <img src={preview} alt="meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      {/* Pulse rings */}
      <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[0, 0.5, 1].map(d => (
          <div key={d} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid #4F46E5', opacity: 0,
            animation: `ring-grow 2s ease-out ${d}s infinite`,
          }} />
        ))}
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Camera size={22} color="#4F46E5" strokeWidth={1.8} />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p className="anim-analyze" style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: '0 0 6px' }}>
          Analyzing macro-composition...
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>
          AI is identifying ingredients &amp; nutrients
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Protein', 'Carbs', 'Fats', 'Calories'].map((t, i) => (
          <span key={t} style={{
            fontSize: '0.6875rem', fontWeight: 500,
            background: '#EEF2FF', color: '#4F46E5',
            borderRadius: 999, padding: '4px 10px',
            animation: `pulse-dot 1.8s ease-in-out ${i * 0.28}s infinite`,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Diary Tab ────────────────────────────────────────────────── */
export default function DiaryTab({ onPaywallNeeded, onToast }) {
  const { user, diary, setDiary, isPremium, scanCount, incrementScan } = useApp();
  const [phase,   setPhase]   = useState('diary'); // diary | analyzing | result
  const [preview, setPreview] = useState(null);
  const [result,  setResult]  = useState(null);
  const fileRef = useRef(null);
  
  const GOAL_CALS = Number(user.calorieGoal) || 2000;

  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    // Intercept on 3rd scan if not premium
    if (!isPremium && scanCount >= 2) {
      onPaywallNeeded();
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setPhase('analyzing');

    setTimeout(() => {
      const mock = { ...MOCK_MEALS[Math.floor(Math.random() * MOCK_MEALS.length)] };
      setResult(mock);
      incrementScan();
      setPhase('result');
    }, 2500);
  };

  const handleSave = () => {
    const meal = {
      ...result,
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setDiary(d => [...d, meal]);
    onToast?.('Meal saved to diary', '✓');
    setPhase('diary'); setPreview(null); setResult(null);
  };

  const deleteMeal = id => setDiary(d => d.filter(m => m.id !== id));

  const totalCals    = diary.reduce((a, m) => a + Number(m.calories || 0), 0);
  const totalProtein = diary.reduce((a, m) => a + Number(m.protein  || 0), 0);
  const calPct       = Math.min((totalCals / GOAL_CALS) * 100, 100);

  /* Analyzing */
  if (phase === 'analyzing') return <AnalyzingOverlay preview={preview} />;

  /* Result */
  if (phase === 'result' && result) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
        <div style={{ padding: '22px 20px 0' }} className="anim-fade-up">
          <p style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
            ✓ AI Analysis Complete
          </p>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: '0 0 18px', letterSpacing: '-0.02em' }}>
            Review & Edit
          </h2>
        </div>

        {preview && (
          <div style={{ margin: '0 20px', borderRadius: 16, overflow: 'hidden', height: 180 }} className="anim-fade-up">
            <img src={preview} alt="meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ padding: '14px 20px 0' }} className="anim-fade-up">
          <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 4px', fontWeight: 500 }}>Identified as</p>
            <input
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1.125rem', fontWeight: 700, color: '#111827', background: 'transparent', fontFamily: 'inherit' }}
              value={result.name}
              onChange={e => setResult(r => ({ ...r, name: e.target.value }))}
            />
            <p style={{ fontSize: '0.75rem', color: '#A5B4FC', margin: '4px 0 0' }}>Tap any value to adjust</p>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <MacroCell label="Calories" value={result.calories} unit=""  color="#111827" onChange={v => setResult(r => ({ ...r, calories: v }))} />
            <MacroCell label="Protein"  value={result.protein}  unit="g" color="#3B82F6" onChange={v => setResult(r => ({ ...r, protein:  v }))} />
            <MacroCell label="Carbs"    value={result.carbs}    unit="g" color="#F59E0B" onChange={v => setResult(r => ({ ...r, carbs:    v }))} />
            <MacroCell label="Fat"      value={result.fat}      unit="g" color="#EF4444" onChange={v => setResult(r => ({ ...r, fat:      v }))} />
          </div>

          <button onClick={handleSave} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: '#111827', color: 'white', fontWeight: 600, fontSize: '0.9375rem',
            cursor: 'pointer', marginBottom: 8, transition: 'opacity 0.15s',
          }}>
            Save to Diary
          </button>
          <button onClick={() => { setPhase('diary'); setPreview(null); setResult(null); }} style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: 'transparent', color: '#6B7280', fontWeight: 500, fontSize: '0.875rem',
            border: '1.5px solid #E5E7EB', cursor: 'pointer',
          }}>
            Discard
          </button>
        </div>
      </div>
    );
  }

  /* Diary view */
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80, position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '22px 20px 0' }} className="anim-fade-up">
        <p style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 500, margin: '0 0 3px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
          Food Diary
        </h2>
      </div>

      {/* Nutrition summary */}
      <div style={{ padding: '0 20px' }} className="anim-fade-up">
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, margin: '0 0 3px' }}>Calories</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {totalCals}
                <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#9CA3AF', marginLeft: 4 }}>/ {GOAL_CALS}</span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 2px' }}>Protein</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#3B82F6', margin: 0 }}>{totalProtein}g</p>
            </div>
          </div>
          <div style={{ background: '#F3F4F6', borderRadius: 999, height: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${calPct}%`, borderRadius: 999,
              background: totalCals > GOAL_CALS ? '#EF4444' : '#4F46E5',
              transition: 'width 0.6s cubic-bezier(.16,1,.3,1)',
            }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 6, marginBottom: 0 }}>
            {Math.max(0, GOAL_CALS - totalCals)} kcal remaining
          </p>
        </div>
      </div>

      {/* Meals */}
      <div style={{ padding: '16px 20px 0' }}>
        {diary.length === 0 ? (
          <div className="anim-fade-up" style={{
            textAlign: 'center', padding: '52px 20px',
            border: '1.5px dashed #E5E7EB', borderRadius: 16,
          }}>
            <p style={{ fontSize: '2rem', margin: '0 0 10px' }}>🍽️</p>
            <p style={{ fontWeight: 500, color: '#374151', margin: '0 0 6px' }}>No meals logged yet</p>
            <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>Tap the + button to snap a meal</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {diary.map((m, i) => <MealRow key={m.id ?? i} meal={m} onDelete={() => deleteMeal(m.id)} />)}
          </div>
        )}
      </div>

      {/* Free scan hint */}
      {!isPremium && (
        <div style={{ padding: '14px 20px 0' }} className="anim-fade-up">
          <div style={{ padding: '10px 14px', borderRadius: 12, background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
            <p style={{ fontSize: '0.8125rem', color: '#4F46E5', margin: 0, fontWeight: 500 }}>
              📸 {Math.max(0, 2 - scanCount)} free scan{Math.max(0, 2 - scanCount) !== 1 ? 's' : ''} remaining
              {scanCount >= 2 ? ' — upgrade for unlimited scans' : ''}
            </p>
          </div>
        </div>
      )}

      {/* FAB */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFile} />
      <button className="fab" onClick={() => fileRef.current?.click()}>
        <Plus size={22} color="white" strokeWidth={2.5} />
      </button>
    </div>
  );
}
