import { useState } from 'react';
import { useApp } from '../AppContext';

const BENEFITS = [
  { icon: '📸', label: 'Unlimited AI meal scans',      sub: 'Log every meal with one snap' },
  { icon: '🧠', label: 'Smart macro suggestions',      sub: 'Personalised AI-driven plans' },
  { icon: '📊', label: 'Advanced nutrition charts',    sub: 'Weekly & monthly macro trends' },
  { icon: '⚡', label: 'Priority streak insights',     sub: 'Real-time health scoring' },
  { icon: '🔒', label: 'No ads, ever',                 sub: 'A serene, distraction-free experience' },
];

export default function ProTab({ onToast }) {
  const { isPremium, setPremium, resetScans } = useApp();
  const [plan,    setPlan]    = useState('annual');
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      setPremium(true);
      setLoading(false);
      onToast?.('Welcome to Pro — unlimited scans unlocked.', '⚡');
    }, 1400);
  };

  const handleReset = () => {
    setPremium(false);
    resetScans();
    onToast?.('Reset to free tier', '↺');
  };

  /* ── Already Pro ─────────────────────────────────────── */
  if (isPremium) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
        <div style={{ padding: '22px 20px 0' }} className="anim-fade-up">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
            HabitAI Pro
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Your Plan
          </h2>
        </div>

        {/* Pro badge card */}
        <div style={{ padding: '0 20px' }} className="anim-scale-in">
          <div className="card" style={{ padding: '28px 20px', textAlign: 'center', marginBottom: 16 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(79,70,229,0.28)',
            }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              HabitAI Pro
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
              Unlimited access · Active
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
            Included with your plan
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BENEFITS.map(b => (
              <div key={b.label} className="card anim-fade-up" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>
                  {b.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0 }}>{b.label}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '2px 0 0' }}>{b.sub}</p>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px 20px 0' }}>
          <button onClick={handleReset} style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: 'transparent', border: '1.5px solid #E5E7EB',
            color: '#9CA3AF', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Reset to Free (Demo)
          </button>
        </div>
      </div>
    );
  }

  /* ── Paywall ─────────────────────────────────────────── */
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>

      <div style={{ padding: '22px 20px 0' }} className="anim-fade-up">
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
          HabitAI Pro
        </p>
        <h2 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Unlock unlimited<br />AI scanning
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 20px', lineHeight: 1.55 }}>
          Join 50,000+ people transforming their health with AI-powered nutrition tracking.
        </p>
      </div>

      {/* Benefits */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BENEFITS.map((b, i) => (
            <div key={b.label} className="card anim-fade-up" style={{ animationDelay: `${i * 0.04}s`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>
                {b.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0 }}>{b.label}</p>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '2px 0 0' }}>{b.sub}</p>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: '20px 20px 0' }} className="anim-fade-up">
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
          Choose a plan
        </p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { id: 'monthly', label: 'Monthly', price: '$9.99',  sub: '/mo',   note: 'Flexible, cancel anytime', badge: null },
            { id: 'annual',  label: 'Annual',  price: '$79.99', sub: '/year', note: 'Save 33% vs monthly',      badge: 'Best Value' },
          ].map(p => (
            <div key={p.id} onClick={() => setPlan(p.id)} style={{
              flex: 1, padding: '16px 12px', borderRadius: 14, cursor: 'pointer',
              border: plan === p.id ? '2px solid #4F46E5' : '1.5px solid #E5E7EB',
              boxShadow: plan === p.id ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
              position: 'relative', background: 'white',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}>
              {p.badge && (
                <span style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: '#4F46E5', color: 'white',
                  fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.04em',
                  borderRadius: 999, padding: '3px 9px', whiteSpace: 'nowrap',
                }}>{p.badge}</span>
              )}
              <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 5px', fontWeight: 500 }}>{p.label}</p>
              <p style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                {p.price}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#9CA3AF' }}>{p.sub}</span>
              </p>
              <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', margin: '5px 0 0' }}>{p.note}</p>
            </div>
          ))}
        </div>

        <button onClick={handleStart} disabled={loading} style={{
          width: '100%', padding: '15px', borderRadius: 12, border: 'none',
          background: '#4F46E5', color: 'white', fontWeight: 600, fontSize: '1rem',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: loading ? 0.8 : 1, transition: 'opacity 0.15s', fontFamily: 'inherit',
        }}>
          {loading
            ? <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%' }} className="anim-spin" />
            : 'Start Pro Trial — 7 Days Free'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', marginTop: 10, marginBottom: 0 }}>
          Cancel anytime · No charge until trial ends · Secure payment
        </p>
      </div>

      {/* Social proof */}
      <div style={{ padding: '16px 20px 0' }} className="anim-fade-up">
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: '0.875rem' }}>★</span>)}
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: 6 }}>4.9 · 12k reviews</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 8px', lineHeight: 1.55, fontStyle: 'italic' }}>
            "The AI scanning is insanely accurate. I've lost 8kg in 3 months."
          </p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>— Sarah M., verified user</p>
        </div>
      </div>
    </div>
  );
}
