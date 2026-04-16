import { useState } from 'react';
import { useApp } from '../AppContext';
import { UserCircle } from 'lucide-react';

/* ── Toggle row ─────────────────────────────────────────────── */
function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 500, color: '#111827', margin: 0 }}>{label}</p>
        {sub && <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '2px 0 0' }}>{sub}</p>}
      </div>
      <div className={`toggle-wrap ${value ? 'on' : ''}`} onClick={() => onChange(!value)}>
        <div className="toggle-knob" />
      </div>
    </div>
  );
}

/* ── Section header ─────────────────────────────────────────── */
function SectionHeader({ title }) {
  return (
    <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '22px 0 12px' }}>
      {title}
    </p>
  );
}

/* ── Account Tab ────────────────────────────────────────────── */
export default function AccountTab({ onToast }) {
  const { user, setUser, isPremium, setPremium, resetScans } = useApp();

  const update = (key, val) => setUser({ [key]: val });

  const handleSave = () => onToast?.('Settings saved', '✓');

  /* Dummy toggles local state (cosmetic only for some) */
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [biometricLock, setBiometric]   = useState(false);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>

      {/* ── Profile ─────────────────────────────────────── */}
      <div style={{ padding: '22px 20px 0' }} className="anim-fade-up">
        <p style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 500, margin: '0 0 3px' }}>
          Account
        </p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Profile & Settings
        </h2>

        {/* Avatar + Name */}
        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #EEF2FF, #C7D2FE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, border: '2px solid #E0E7FF',
          }}>
            <UserCircle size={30} color="#4F46E5" strokeWidth={1.5} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 4px', fontWeight: 500 }}>Your name</p>
            <input
              className="goal-input"
              style={{ padding: '8px 10px', fontSize: '1rem' }}
              value={user.name}
              onChange={e => update('name', e.target.value)}
              onBlur={handleSave}
            />
          </div>
        </div>
      </div>

      {/* ── Goals ───────────────────────────────────────── */}
      <div style={{ padding: '0 20px' }} className="anim-fade-up">
        <SectionHeader title="Daily Goals" />
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Daily Calorie Target
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="goal-input"
                type="number"
                value={user.calorieGoal}
                onChange={e => update('calorieGoal', e.target.value)}
                onBlur={handleSave}
                min={500} max={5000}
              />
              <span style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>kcal</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Current Weight
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="goal-input"
                type="number"
                placeholder="e.g. 72"
                value={user.weight}
                onChange={e => update('weight', e.target.value)}
                onBlur={handleSave}
              />
              <span style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Preferences ─────────────────────────────────── */}
      <div style={{ padding: '0 20px' }} className="anim-fade-up">
        <SectionHeader title="Preferences" />
        <div className="card" style={{ padding: '0 18px' }}>
          <ToggleRow
            label="Push Notifications"
            sub="Daily reminders to log meals & habits"
            value={user.notifs}
            onChange={v => { update('notifs', v); handleSave(); }}
          />
          <ToggleRow
            label="Dark Mode"
            sub="Coming soon"
            value={user.darkMode}
            onChange={v => { update('darkMode', v); handleSave(); }}
          />
          <ToggleRow
            label="Weekly Report"
            sub="Get a summary every Monday"
            value={weeklyReport}
            onChange={setWeeklyReport}
          />
          <ToggleRow
            label="Biometric Lock"
            sub="Face ID / Touch ID on open"
            value={biometricLock}
            onChange={setBiometric}
          />
        </div>
      </div>

      {/* ── Subscription ────────────────────────────────── */}
      <div style={{ padding: '0 20px' }} className="anim-fade-up">
        <SectionHeader title="Subscription" />
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: '0 0 3px', fontWeight: 500 }}>Current Plan</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: isPremium ? '#4F46E5' : '#111827', margin: 0 }}>
                {isPremium ? '⚡ HabitAI Pro' : 'Free'}
              </p>
            </div>
            {isPremium && (
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#10B981', background: '#ECFDF5', borderRadius: 999, padding: '4px 10px', border: '1px solid #D1FAE5' }}>
                Active
              </span>
            )}
          </div>

          {isPremium ? (
            <button
              onClick={() => { setPremium(false); resetScans(); onToast?.('Subscription cancelled', '↺'); }}
              style={{
                width: '100%', padding: '11px', borderRadius: 10, border: '1.5px solid #E5E7EB',
                background: 'transparent', color: '#9CA3AF', fontWeight: 500, fontSize: '0.875rem',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              Cancel Subscription
            </button>
          ) : (
            <button
              onClick={() => onToast?.('No purchases found to restore', 'ℹ')}
              style={{
                width: '100%', padding: '11px', borderRadius: 10, border: '1.5px solid #E5E7EB',
                background: 'transparent', color: '#4F46E5', fontWeight: 500, fontSize: '0.875rem',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              Restore Purchases
            </button>
          )}
        </div>
      </div>

      {/* ── App info ────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 0', textAlign: 'center' }} className="anim-fade-up">
        <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0 }}>HabitAI · v2.0.0 · Built with ❤️</p>
      </div>
    </div>
  );
}
