import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  Trash2,
  ExternalLink,
  ShieldCheck,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { analysisAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const DashboardView = ({ onSelectAnalysis, onStartNew }) => {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        analysisAPI.getHistory(),
        analysisAPI.getStats(),
      ]);

      if (historyRes.data.success) {
        setHistory(historyRes.data.data || []);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats || null);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  const handleOpenDeleteModal = (item, e) => {
    e.stopPropagation();
    setDeleteTarget({
      id: item._id,
      name: item.fileName || item.targetRole || 'Analysis Record',
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await analysisAPI.delete(deleteTarget.id);
      if (res.data.success) {
        setHistory((prev) => prev.filter((item) => item._id !== deleteTarget.id));
        addToast('Analysis record deleted', 'info');
      } else {
        addToast(res.data.message || 'Failed to delete record.', 'error');
      }
    } catch (err) {
      addToast('Failed to delete record.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) {
      return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60 shadow-sm shadow-emerald-500/20';
    }
    if (score >= 65) {
      return 'bg-amber-950/60 text-amber-300 border-amber-500/60 shadow-sm shadow-amber-500/20';
    }
    return 'bg-rose-950/60 text-rose-300 border-rose-500/60 shadow-sm shadow-rose-500/20';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / User Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Analysis History & Metrics
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            {isAuthenticated
              ? `Logged in as ${user?.name} (${user?.email})`
              : 'Sign in to save and compare your resume analyses.'}
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all shadow-lg shadow-teal-500/25 hover:scale-[1.02] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>New Resume Audit</span>
        </button>
      </div>

      {/* Guest Notice if not logged in */}
      {!isAuthenticated && (
        <div className="bg-surface/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 rounded-2xl text-amber-400 border border-amber-500/40 shadow-sm">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Guest Mode Active
              </h3>
              <p className="text-sm text-slate-300 mt-0.5">
                Sign in or launch a demo session to save your analysis history.
              </p>
            </div>
          </div>
          <button
            onClick={demoLogin}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/50 transition-all shrink-0 cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            Launch Demo Session
          </button>
        </div>
      )}

      {/* Metric Stat Cards with Individual Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Audits */}
        <div className="bg-surface/90 border border-blue-500/30 rounded-3xl p-6 shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-300">
              Total Audits
            </span>
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {stats ? stats.totalAnalyses : history.length}
          </div>
          <span className="text-xs text-blue-200/80 mt-1 block">
            Resumes indexed
          </span>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-surface/90 border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Average Score
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {stats?.averageScore ? `${stats.averageScore}%` : 'N/A'}
          </div>
          <span className="text-xs text-emerald-200/80 mt-1 block">
            Across all targets
          </span>
        </div>

        {/* Card 3: Top Benchmark */}
        <div className="bg-surface/90 border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-300">
              Top Benchmark
            </span>
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/30">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {stats?.highestScore ? `${stats.highestScore}%` : 'N/A'}
          </div>
          <span className="text-xs text-purple-200/80 mt-1 block">
            Highest ATS match
          </span>
        </div>

        {/* Card 4: Latest Target */}
        <div className="bg-surface/90 border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)] transition-all hover:scale-[1.01]">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Latest Target
            </span>
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30">
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="font-extrabold text-base text-white truncate mt-1">
            {stats?.recentRole || (history[0]?.targetRole || 'None')}
          </div>
          <span className="text-xs text-amber-200/80 mt-1 block">
            Most recent role
          </span>
        </div>
      </div>

      {/* History Table / Records */}
      <div className="bg-surface/90 border border-surface-border rounded-3xl p-6 sm:p-8 shadow-subtle-card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Audit Archive
            </h3>
          </div>
          <span className="text-sm font-bold text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
            {history.length} Saved Records
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 rounded-2xl border border-cyan-500/30 text-cyan-300 mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-white">
              No historical audits found
            </p>
            <p className="text-sm text-slate-300 max-w-sm mt-1 mb-5">
              Run your first resume audit to see it archived here.
            </p>
            <button
              onClick={onStartNew}
              className="px-5 py-2.5 text-sm font-bold bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Start First Audit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border text-slate-400 font-bold uppercase text-xs tracking-wider">
                  <th className="pb-3.5 pl-3">Candidate File</th>
                  <th className="pb-3.5">Target Role</th>
                  <th className="pb-3.5">ATS Score</th>
                  <th className="pb-3.5">Date</th>
                  <th className="pb-3.5 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {history.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => onSelectAnalysis(item._id)}
                    className="hover:bg-surface-elevated/70 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 pl-3 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
                        <span className="truncate max-w-xs">{item.resumeName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-200 font-medium">
                      {item.targetRole}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getScoreBadge(
                          item.overallScore
                        )}`}
                      >
                        {item.overallScore}%
                      </span>
                    </td>
                    <td className="py-4 text-slate-300 text-sm">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 pr-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.resumeUrl && item.resumeUrl.startsWith('http') && !item.resumeUrl.includes('placeholder-resumes.internal') && (
                          <a
                            href={item.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-cyan-400 hover:text-cyan-300 rounded-lg hover:bg-surface transition-colors"
                            title="View Original CV in Cloudinary"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAnalysis(item._id);
                          }}
                          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-surface transition-colors"
                          title="View Full Report"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleOpenDeleteModal(item, e)}
                          className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-surface transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Simple Delete Confirmation Popup */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Analysis Record"
        message="Are you sure you want to delete this analysis record? This will permanently remove the record and its stored resume file."
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DashboardView;
