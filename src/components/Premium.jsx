import { useState, useEffect } from 'react';

const PREMIUM_KEY = 'is_premium';

const BENEFITS = [
  { icon: '📸', title: 'Unlimited AI Scans',       sub: 'Log every meal with one snap' },
  { icon: '🧠', title: 'Smart Meal Suggestions',   sub: 'Personalised AI-driven plans' },
  { icon: '📊', title: 'Advanced Nutrition Charts', sub: 'Weekly & monthly macro trends' },
  { icon: '⚡', title: 'Instant Health Insights',  sub: 'Real-time scoring dashboard' },
  { icon: '🔒', title: 'No Ads, Ever',             sub: 'A clean, distraction-free experience' },
];

export default function Premium({ onPurchased, onToast }) {
  const [isPro,        setIsPro]        = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');

  useEffect(() => {
    setIsPro(localStorage.getItem(PREMIUM_KEY) === 'true');
  }, []);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(PREMIUM_KEY, 'true');
      setIsPro(true);
      setLoading(false);
      onPurchased?.();
    }, 1400);
  };

  /* ── Already Pro ─────────────────────────────────────────── */
  if (isPro) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
        <div style={{ padding: '20px 20px 0' }} className="anim-fade-up">
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', fontWeight: 500, marginBottom: 4 }}>
            Membership
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Your Plan
          </h2>
        </div>

        {/* Pro badge */}
        <div style={{ padding: '0 20px' }} className="anim-scale-in">
          <div className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--indigo), #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
            }}>
              <span style={{ fontSize: '1.4rem' }}>⚡</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              HabitAI Pro
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', margin: 0 }}>
              You're all set. Enjoy unlimited access.
            </p>
          </div>
        </div>

        {/* What you have */}
        <div style={{ padding: '16px 20px 0' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
            Included
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BENEFITS.map(b => (
              <div key={b.title} className="card anim-fade-up" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'var(--indigo-lt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontSize: '1.1rem',
                }}>
                  {b.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>{b.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', margin: '2px 0 0' }}>{b.sub}</p>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--emerald-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset for demo */}
        <div style={{ padding: '20px 20px 0' }}>
          <button
            onClick={() => { localStorage.removeItem(PREMIUM_KEY); localStorage.removeItem('food_scan_count'); setIsPro(false); onToast?.('Reset to free tier', '↺'); }}
            className="btn-ghost"
            style={{ fontSize: '0.8125rem' }}
          >
            Reset to Free (Demo)
          </button>
        </div>
      </div>
    );
  }

  /* ── Paywall ─────────────────────────────────────────────── */
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0' }} className="anim-fade-up">
        <p style={{ fontSize: '0.8125rem', color: 'var(--indigo)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          HabitAI Pro
        </p>
        <h2 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Unlock the full<br />experience
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', margin: '0 0 20px', lineHeight: 1.6 }}>
          Join 50,000+ people transforming their health with AI-powered nutrition tracking.
        </p>
      </div>

      {/* Benefits list */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="card anim-fade-up" style={{ animationDelay: `${i * 0.04}s`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--indigo-lt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: '1.1rem',
              }}>
                {b.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>{b.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', margin: '2px 0 0' }}>{b.sub}</p>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--emerald-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing toggle */}
      <div style={{ padding: '20px 20px 0' }} className="anim-fade-up">
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
          Choose a plan
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { id: 'monthly', label: 'Monthly', price: '$9.99', per: '/mo',   badge: null,      note: 'Flexible, cancel anytime' },
            { id: 'annual',  label: 'Annual',  price: '$4.99', per: '/mo',   badge: 'Save 50%', note: 'Billed as $59.99/year' },
          ].map(p => (
            <div
              key={p.id}
              className={`price-card ${selectedPlan === p.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(p.id)}
              style={{ position: 'relative', userSelect: 'none' }}
            >
              {p.badge && (
                <span style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--indigo)', color: '#fff',
                  fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.04em',
                  borderRadius: 999, padding: '3px 9px', whiteSpace: 'nowrap',
                }}>{p.badge}</span>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', margin: '0 0 6px', fontWeight: 500 }}>{p.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.03em' }}>
                {p.price}
                <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-4)' }}>{p.per}</span>
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-4)', margin: '5px 0 0' }}>{p.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '20px 20px 0' }} className="anim-fade-up">
        <button className="btn-primary" onClick={handleStart} disabled={loading}
          style={{ paddingTop: 15, paddingBottom: 15, fontSize: '1rem' }}>
          {loading ? (
            <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%' }} className="spin-slow" />
          ) : 'Start Pro Trial — 7 Days Free'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-4)', marginTop: 10 }}>
          Cancel anytime · No charge until trial ends · Secure payment
        </p>
      </div>

      {/* Social proof */}
      <div style={{ padding: '16px 20px 0' }} className="anim-fade-up">
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: '#F59E0B', fontSize: '0.875rem' }}>★</span>
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginLeft: 6 }}>4.9 · 12k reviews</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', margin: '0 0 8px', lineHeight: 1.5, fontStyle: 'italic' }}>
            "The AI scanning is insanely accurate. I've lost 8kg in 3 months."
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', margin: 0 }}>— Sarah M., verified user</p>
        </div>
      </div>
    </div>
  );
}
