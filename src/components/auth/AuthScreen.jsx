import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff, Zap, AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); // login | signup | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password || !agencyName) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { agency_name: agencyName } }
    });
    if (error) setError(error.message);
    else setSuccess('Account created! Check your email to confirm, then log in.');
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) { setError('Enter your email address.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setSuccess('Password reset email sent — check your inbox.');
    setLoading(false);
  };

  const handleSubmit = () => {
    if (mode === 'login') handleLogin();
    else if (mode === 'signup') handleSignup();
    else handleReset();
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'var(--brand-primary-subtle)',
        borderRadius: '50%', filter: 'blur(120px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        padding: '0 20px',
        position: 'relative', zIndex: 1,
        animation: 'slideUp 300ms ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: 14,
            background: 'var(--brand-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 32px var(--brand-primary-glow)',
          }}>
            <Zap size={26} color="#0A0A0C" fill="#0A0A0C" />
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28, fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
          }}>
            APEX CRM
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {mode === 'login' && 'Sign in to your agency dashboard'}
            {mode === 'signup' && 'Create your agency account'}
            {mode === 'reset' && 'Reset your password'}
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 28px',
        }}>
          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              background: 'var(--color-danger-bg)',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px', marginBottom: 18,
              fontSize: 13, color: 'var(--color-danger)',
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}
          {/* Success */}
          {success && (
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              background: 'var(--color-success-bg)',
              border: '1px solid rgba(74,222,128,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px', marginBottom: 18,
              fontSize: 13, color: 'var(--color-success)',
            }}>
              <CheckCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {success}
            </div>
          )}

          {/* Agency name (signup only) */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="input-label">Agency Name</label>
              <input
                className="input"
                placeholder="e.g. Sunscape Digital"
                value={agencyName}
                onChange={e => setAgencyName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="input-label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="you@agency.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Password */}
          {mode !== 'reset' && (
            <div className="form-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ paddingRight: 40 }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)', padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          {/* Forgot password link */}
          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 16 }}>
              <button
                onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                style={{ background: 'none', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', justifyContent: 'center',
              padding: '11px',
              fontSize: 14, fontWeight: 600,
              opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
          </button>

          {/* Mode switcher */}
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-secondary)' }}>
            {mode === 'login' && (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                  style={{ background: 'none', color: 'var(--brand-primary)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                  Sign up free
                </button>
              </>
            )}
            {mode === 'signup' && (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  style={{ background: 'none', color: 'var(--brand-primary)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                  Sign in
                </button>
              </>
            )}
            {mode === 'reset' && (
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                style={{ background: 'none', color: 'var(--brand-primary)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                ← Back to sign in
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--text-muted)' }}>
          Your data is encrypted and stored securely
        </div>
      </div>
    </div>
  );
}
