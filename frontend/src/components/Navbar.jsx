import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Sparkles,
  LogOut,
  Sun,
  Sparkle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { theme, toggleTheme, isNight } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-surface-border transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/35 transition-all">
              <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent block leading-none">
                OK-<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">CV</span>
              </span>
            </div>
          </Link>

          {/* Navigation links with real endpoints */}
          <nav className="hidden md:flex items-center gap-2 border-l border-surface-border pl-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-teal-500/20 text-white border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-surface-elevated'
                }`
              }
            >
              Auditor Workspace
            </NavLink>
            <NavLink
              to="/editor"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-teal-500/20 text-white border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-surface-elevated'
                }`
              }
            >
              Live CV Studio
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-teal-500/20 text-white border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-surface-elevated'
                }`
              }
            >
              Dashboard & History
            </NavLink>
          </nav>
        </div>

        {/* Right tools and user session */}
        <div className="flex items-center gap-3">
          {/* Theme Mode Toggle (Night vs Day) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-elevated border border-surface-border hover:border-cyan-500/50 text-xs sm:text-sm font-bold text-slate-200 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            title={`Switch to ${isNight ? 'Day Mode' : 'Night Mode'}`}
          >
            {isNight ? (
              <>
                <Sparkle className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Night Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span className="text-slate-800 font-extrabold">Day Mode</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-surface-elevated border border-transparent hover:border-surface-border transition-colors cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500/50 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-sm font-bold text-slate-200 hidden sm:inline">
                  {user?.name}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface border border-surface-border rounded-2xl shadow-elevated-card py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-surface-border">
                    <p className="text-sm font-bold text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-surface-elevated transition-colors cursor-pointer"
                  >
                    My Analysis History
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-950/20 transition-colors border-t border-surface-border mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={demoLogin}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Demo Profile</span>
              </button>
              <button
                onClick={onOpenAuth}
                className="px-5 py-2 text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all shadow-md shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
