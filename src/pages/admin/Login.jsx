import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Documentation uses 'username' and 'password' in payload
      const response = await authService.login({ username, password });
      
      // If success, documentation implies token might be in data
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/admin/manage');
      } else {
        // Fallback if token is purely cookie-based
        navigate('/admin/manage');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-gray-100">
      <div className="w-full max-w-md bg-[#0f0f0f] border border-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-md mx-auto flex items-center justify-center font-bold text-white text-xl mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            S
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-gray-400 mt-2">Sign in to manage SIPANGAN data.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-crimson-500/10 border border-crimson-500/20 text-crimson-500 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-gray-600"
              placeholder="user_sipangan"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-gray-600"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-semibold rounded-md px-4 py-2.5 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
