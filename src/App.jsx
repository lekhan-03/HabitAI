import { useState, useCallback, useRef, useEffect } from 'react';
import { Home, BookOpen, Sparkles, UserCircle, Plus, X } from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
import HomeTab    from './tabs/Home';
import DiaryTab   from './tabs/Diary';
import ProTab     from './tabs/Pro';
import AccountTab from './tabs/Account';

/* ── Toast ──────────────────────────────────────────────────────── */
function Toast({ id, message, icon, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3700); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="anim-toast" style={{
      position: 'absolute', bottom: 84, left: 16, right: 16, zIndex: 95,
      background: '#111827', color: 'white',
      borderRadius: 14, padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      fontSize: '0.875rem', fontWeight: 500,
    }}>
      <span style={{ fontSize: '1rem' }}>{icon ?? '✓'}</span>
      <span>{message}</span>
    </div>
  );
}

/* ── Paywall bottom-sheet modal ─────────────────────────────────── */
function PaywallModal({ onClose }) {
  const { setPremium } = useApp();
  const [loading, setLoading]     = useState(false);
  const [plan, setPlan]           = useState('annual');

  const BENEFITS = [
    'Unlimited AI meal scans',
    'Smart meal suggestions',
    'Advanced macro analytics',
    'Priority support',
    'No ads, ever',
  ];

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      setPremium(true);
      setLoading(false);
      onClose('pro');
    }, 1400);
  };

  return (
    <div className="anim-fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: 'rgba(17,24,39,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={() => onClose(null)}>
      <div className="anim-sheet" onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: '24px 24px 0 0',
        width: '100%', maxHeight: '92vh', overflowY: 'auto',
        paddingBottom: 24,
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: '#E5E7EB', borderRadius: 2, margin: '14px auto 22px' }} />

        <div style={{ padding: '0 20px' }}>
          {/* Header */}
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            HabitAI Pro
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Unlock unlimited<br />AI scanning
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 22, lineHeight: 1.55 }}>
            You've used your free scans. Upgrade to continue logging meals with AI.
          </p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
            {BENEFITS.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 450 }}>{b}</span>
              </div>
            ))}
          </div>

          {/* Plan toggle */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[
              { id: 'monthly', label: 'Monthly', price: '$9.99', sub: '/month', note: 'Flexible' },
              { id: 'annual',  label: 'Annual',  price: '$79.99', sub: '/year', note: 'Save 33%', badge: 'Best Value' },
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
                    background: '#4F46E5', color: 'white', fontSize: '0.625rem', fontWeight: 700,
                    letterSpacing: '0.04em', borderRadius: 999, padding: '3px 9px', whiteSpace: 'nowrap',
                  }}>{p.badge}</span>
                )}
                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 5px', fontWeight: 500 }}>{p.label}</p>
                <p style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                  {p.price}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#9CA3AF' }}>{p.sub}</span>
                </p>
                <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', margin: '4px 0 0' }}>{p.note}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button onClick={handleStart} disabled={loading} style={{
            width: '100%', padding: '15px', borderRadius: 12,
            background: '#4F46E5', color: 'white', border: 'none',
            fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'opacity 0.15s',
            opacity: loading ? 0.8 : 1,
          }}>
            {loading
              ? <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%' }} className="anim-spin" />
              : 'Start Pro Trial — 7 Days Free'}
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', marginTop: 10 }}>
            Cancel anytime · No charge until trial ends
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Bottom Navigation ──────────────────────────────────────────── */
const TABS = [
  { id: 'home',    label: 'Home',   Icon: Home },
  { id: 'diary',   label: 'Diary',  Icon: BookOpen },
  { id: 'pro',     label: 'Pro',    Icon: Sparkles },
  { id: 'account', label: 'Me',     Icon: UserCircle },
];

function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(16px)',
      borderTop: '1px solid #F3F4F6',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 6px)',
    }}>
      {TABS.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => onChange(id)} className={`nav-tab ${active === id ? 'active' : ''}`}>
          <Icon size={20} strokeWidth={active === id ? 2.2 : 1.6} />
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── Shell ──────────────────────────────────────────────────────── */
function Shell() {
  const [tab, setTab]             = useState('home');
  const [showPaywall, setPaywall] = useState(false);
  const [toast, setToast]         = useState(null);
  const toastRef                  = useRef(0);

  const fireToast = useCallback((msg, icon) => {
    const id = ++toastRef.current;
    setToast({ id, msg, icon });
  }, []);

  const handlePaywallNeeded = useCallback(() => setPaywall(true), []);

  const handlePaywallClose = useCallback((goTo) => {
    setPaywall(false);
    if (goTo) setTab(goTo);
    if (goTo === 'pro') fireToast('Welcome to Pro — unlimited scans unlocked.', '⚡');
  }, [fireToast]);

  return (
    <div style={{
      width: '100%', maxWidth: 430,
      height: '100svh', maxHeight: 900,
      background: '#F9FAFB',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 24px 80px rgba(0,0,0,0.16)',
    }}>
      {/* Tabs */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {TABS.map(({ id }) => (
          <div key={id} style={{
            position: 'absolute', inset: 0,
            opacity: tab === id ? 1 : 0,
            pointerEvents: tab === id ? 'auto' : 'none',
            transition: 'opacity 0.18s ease',
          }}>
            {id === 'home'    && <HomeTab    onToast={fireToast} />}
            {id === 'diary'   && <DiaryTab   onPaywallNeeded={handlePaywallNeeded} onToast={fireToast} />}
            {id === 'pro'     && <ProTab     onToast={fireToast} />}
            {id === 'account' && <AccountTab onToast={fireToast} />}
          </div>
        ))}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {showPaywall && <PaywallModal onClose={handlePaywallClose} />}
      {toast && <Toast key={toast.id} message={toast.msg} icon={toast.icon} onDone={() => setToast(null)} />}
    </div>
  );
}

/* ── App root ───────────────────────────────────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Shell />
      </div>
    </AppProvider>
  );
}
