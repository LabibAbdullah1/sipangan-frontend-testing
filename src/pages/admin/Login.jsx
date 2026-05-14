import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../api/services';
import { Shield, Lock, User, Loader2, Database } from 'lucide-react';

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
      const response = await authService.login({ username, password });
      
      if (response.data?.accessToken) {
        const { accessToken, refreshToken } = response.data;
        
        // Get role from response body or decode from JWT
        let role = response.data.role;
        
        if (!role) {
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            role = payload.role || 'operator';
          } catch (e) {
            console.error('Failed to decode token:', e);
            role = 'operator';
          }
        }

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userRole', role);
        navigate('/admin/manage');
      } else {
        setError('Respons server tidak valid.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal terhubung ke server.';
      if (err.response?.status === 401) {
        setError('Kredensial tidak valid. Silakan periksa kembali username dan password Anda.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-gray-100 relative overflow-hidden font-sans">
      {/* Shared Background Texture & Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.1),transparent_40%)]"></div>
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 1.2px)`,
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Database className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">SIPANGAN</h1>
            <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Administrator Access</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700 font-medium"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative group mt-4"
            >
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl px-4 py-5 flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Shield size={16} />
                    Secure Login
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              © 2026 SIPANGAN TECHNOLOGY • V1.0.4
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
