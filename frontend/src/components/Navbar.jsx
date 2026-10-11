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
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight hover:text-slate-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <FileCheck className="w-4 h-4" />
            </div>
            <span>OK-CV</span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1 border-l border-slate-800 pl-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`
              }
            >
              Auditor Workspace
            </NavLink>
            <NavLink
              to="/editor"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`
              }
            >
              Live CV Studio
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`
              }
            >
              Dashboard & History
            </NavLink>
          </nav>
        </div>

        {/* Right tools and user session */}
        <div className="flex items-center gap-3">
          {/* Theme Mode Toggle (Plain neutral button) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-750 transition-colors cursor-pointer"
            title={`Switch to ${isNight ? 'Day Mode' : 'Night Mode'}`}
          >
            {isNight ? (
              <>
                <Sparkle className="w-3.5 h-3.5 text-slate-400" />
                <span>Night Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-slate-400" />
                <span>Day Mode</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {user?.name}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-lg py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-sm font-semibold text-white truncate">
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
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    My Analysis History
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-950/20 transition-colors border-t border-slate-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={demoLogin}
                className="hidden sm:inline-flex px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Demo Profile
              </button>
              <button
                onClick={onOpenAuth}
                className="px-4 py-1.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
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
