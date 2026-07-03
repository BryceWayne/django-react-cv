import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Shield } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-950">
      <div className="w-full max-w-md p-8 m-4 glass-panel flex flex-col items-center">
        <div className="p-4 bg-blue-500/10 rounded-full mb-6 ring-1 ring-blue-500/20">
          <Shield className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white font-display">Sentinel CV</h2>
        <p className="text-slate-400 mb-8 text-center">Secure authentication required for platform access</p>
        
        {error && (
          <div className="w-full p-3 mb-6 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white transition-all placeholder-slate-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white transition-all placeholder-slate-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
