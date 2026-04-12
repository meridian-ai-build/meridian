import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

export default function AuthModal({ onClose, user, onUserChange }) {
  const [tab, setTab] = useState(user ? 'account' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else { onUserChange(data.user); onClose(); }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess('Check your email to confirm your account, then sign in.');
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    onUserChange(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#111118] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="font-playfair text-lg tracking-widest text-white">MERIDIAN</span>
            <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors text-xl leading-none">×</button>
          </div>
        </div>

        {!isSupabaseConfigured ? (
          <div className="px-6 py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
            </div>
            <p className="text-white/60 text-sm font-inter leading-relaxed">
              Authentication requires a Supabase project.<br />
              Copy <span className="text-white/80 font-mono text-xs bg-white/[0.08] px-1.5 py-0.5 rounded">.env.example</span> to{' '}
              <span className="text-white/80 font-mono text-xs bg-white/[0.08] px-1.5 py-0.5 rounded">.env.local</span> and add your credentials.
            </p>
          </div>
        ) : user ? (
          <div className="px-6 py-6 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.08] flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <p className="text-white/80 text-sm font-inter">{user.email}</p>
              <p className="text-white/30 text-xs font-inter mt-1">Signed in</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 rounded border border-white/[0.1] text-white/50 text-sm font-inter hover:border-white/30 hover:text-white/70 transition-all"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-white/[0.06]">
              {['signin', 'signup'].map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                  className={`flex-1 py-3 text-xs font-inter tracking-widest uppercase transition-colors ${
                    tab === t ? 'text-white/80 border-b border-white/50 -mb-px' : 'text-white/25 hover:text-white/45'
                  }`}
                >
                  {t === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="px-6 py-5 space-y-3">
              {tab === 'signup' && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2.5 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2.5 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2.5 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
              />

              {error && <p className="text-red-400/80 text-xs font-inter">{error}</p>}
              {success && <p className="text-emerald-400/80 text-xs font-inter">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded text-sm font-inter font-medium tracking-wider transition-all mt-1 ${
                  loading ? 'bg-white/[0.05] text-white/25' : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
