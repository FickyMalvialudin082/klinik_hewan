import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Harap masukkan email dan password.');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Kredensial tidak valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        {/* Brand/Logo Header */}
        <div className="text-center">
          <span className="text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-1.5 font-sans">
            Ficky<span className="text-teal-600">Admin</span> 🐾
          </span>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 font-sans">
            Masuk ke Panel Pengelola
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Hanya untuk staf klinik Ficky Busuk yang berwenang.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 flex items-start gap-2 animate-shake">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fickybusuk.com"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3 rounded-xl font-bold text-sm tracking-wide shadow-md"
              icon={LogIn}
            >
              Masuk Panel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
