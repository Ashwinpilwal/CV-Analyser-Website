import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export const AuthModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { login, register, demoLogin } = useAuth();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);

    try {
      if (tab === 'login') {
        const res = await login(email, password);
        if (res.success) {
          addToast('Signed in successfully', 'success');
          onClose();
        } else {
          setLocalError(res.message);
        }
      } else {
        if (!name.trim()) {
          setLocalError('Please enter your full name.');
          setSubmitting(false);
          return;
        }
        const res = await register(name, email, password);
        if (res.success) {
          addToast('Account created successfully', 'success');
          onClose();
        } else {
          setLocalError(res.message);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setSubmitting(true);
    setLocalError(null);
    const res = await demoLogin();
    setSubmitting(false);
    if (res.success) {
      addToast('Authenticated with Demo Profile', 'success');
      onClose();
    } else {
      setLocalError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in no-print">
      <div className="w-full max-w-md bg-surface border border-surface-border rounded-2xl shadow-elevated-card overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-sage" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Sign In to OK-CV
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-surface-border bg-canvas-subtle text-sm">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLocalError(null);
            }}
            className={`flex-1 py-3.5 text-center font-semibold transition-colors ${
              tab === 'login'
                ? 'bg-surface text-white border-b-2 border-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setLocalError(null);
            }}
            className={`flex-1 py-3.5 text-center font-semibold transition-colors ${
              tab === 'register'
                ? 'bg-surface text-white border-b-2 border-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 sm:p-7">
          {localError && (
            <div className="mb-5 p-3.5 rounded-xl bg-accent-rose-dim/30 border border-accent-rose-muted/50 flex items-center gap-3 text-sm text-accent-rose">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full bg-canvas-subtle border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full bg-canvas-subtle border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-canvas-subtle border border-surface-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-white hover:bg-slate-100 text-slate-900 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Instant 1-Click Demo Section */}
          <div className="mt-6 pt-5 border-t border-surface-border">
            <button
              type="button"
              onClick={handleDemo}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-surface-elevated hover:bg-surface-hover border border-surface-border transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-accent-sage" />
              <span>One-Click Demo Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
