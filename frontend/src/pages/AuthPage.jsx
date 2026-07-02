import { useState } from 'react';
import { logout, apiPost } from '../utils/api';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('Student'); // 'Student' or 'Mentor'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const payload = isLogin 
      ? { email, password }
      : { name, email, password, role };

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const data = await apiPost(endpoint, payload);

      // Wipe stale session data from any previous user
      localStorage.removeItem('bts_auth_token');
      localStorage.removeItem('bts_user_profile');

      const userProfile = {
        name: data.user.name,
        email: data.user.email,
        profileType: data.user.role,
        userId: data.user.userId,
        role: data.user.role === 'Student' ? 'Premium Member' : 'Verified Mentor',
        platformRole: data.user.role === 'Mentor' ? 'admin' : 'member',
        balance: data.user.role === 'Student' ? 1000 : 2500
      };

      // Pre-seed profile into localStorage so the app renders instantly
      localStorage.setItem('bts_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('bts_auth_token', data.token);

      // Trigger successful login callback in App.jsx
      onLoginSuccess(data.token, userProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden px-4">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full filter blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full filter blur-[120px] animate-pulse delay-1000"></div>

      <div className="z-10 w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-500/30 shadow-lg mb-2">
            <svg fill="none" className="w-8 h-8 text-yellow-500" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L4 8L16 14L28 8L16 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M4 16L16 22L28 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M4 24L16 30L28 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">BITSTACKS</h2>
          <p className="text-xs text-gray-400 font-medium">Decentralized Knowledge Marketplace</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              isLogin ? 'bg-yellow-500 text-gray-950 shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              !isLogin ? 'bg-yellow-500 text-gray-950 shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2 items-center text-red-400 text-xs font-semibold">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors placeholder:text-gray-600"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@bitstacks.io"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors placeholder:text-gray-600"
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors placeholder:text-gray-600"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Select Account Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('Student')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      role === 'Student'
                        ? 'border-yellow-500/50 bg-yellow-500/10 text-white'
                        : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs font-bold">Student</span>
                    <span className="text-[8px] text-gray-500 mt-0.5">Learn & Book Mentors</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Mentor')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      role === 'Mentor'
                        ? 'border-yellow-500/50 bg-yellow-500/10 text-white'
                        : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-bold">Mentor</span>
                    <span className="text-[8px] text-gray-500 mt-0.5">Teach & Earn Credits</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-gray-950 font-extrabold py-3 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/10 disabled:opacity-50 text-sm mt-4"
          >
            {loading ? 'Processing secure node...' : isLogin ? 'Authorize & Enter' : 'Register Secure Profile'}
          </button>
        </form>

        {/* Demo Details Hint */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-gray-500 font-medium">
            Demo Student: <span className="text-gray-400 font-bold">bob@bitstacks.io</span> / <span className="text-gray-400 font-bold">password</span>
          </p>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">
            Demo Mentor: <span className="text-gray-400 font-bold">alice@bitstacks.io</span> / <span className="text-gray-400 font-bold">password</span>
          </p>
        </div>

      </div>
    </div>
  );
}
