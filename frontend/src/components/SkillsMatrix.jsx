import React, { useState } from 'react';
import { Check, Copy, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useToast } from './Toast';

export const SkillsMatrix = ({ skillsAnalysis = {} }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'matching', 'missing', 'additional'
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const matching = skillsAnalysis.matchingSkills || [];
  const missing = skillsAnalysis.missingSkills || [];
  const additional = skillsAnalysis.additionalCandidateSkills || [];

  const handleCopyMissing = () => {
    if (missing.length === 0) return;
    const textToCopy = missing.map((m) => m.name).join(', ');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    addToast('Copied missing skills list to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEvaluated = matching.length + missing.length;
  const matchRate = totalEvaluated > 0 ? Math.round((matching.length / totalEvaluated) * 100) : 100;

  return (
    <div className="bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 lg:p-10 shadow-subtle-card transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Skills Alignment Matrix
            </h3>
            <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              {matchRate}% Match Rate
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Candidate skills compared against parsed job keywords and ATS criteria
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-canvas-subtle p-1 rounded-xl border border-surface-border text-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({matching.length + missing.length + additional.length})
            </button>
            <button
              onClick={() => setFilter('matching')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
                filter === 'matching'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Matched ({matching.length})
            </button>
            <button
              onClick={() => setFilter('missing')}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
                filter === 'missing'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Missing ({missing.length})
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Matching Skills Grid */}
        {(filter === 'all' || filter === 'matching') && matching.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">
                Matching Skills Found ({matching.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matching.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-emerald-950/25 border border-emerald-500/35 rounded-2xl text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">{skill.name}</span>
                      {skill.category && (
                        <span className="text-[11px] text-slate-300 block">
                          {skill.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {skill.confidence && (
                    <span className="text-xs font-black text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {skill.confidence}% Match
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills Grid with Clear, Proportionate Action Cards */}
        {(filter === 'all' || filter === 'missing') && missing.length > 0 && (
          <div className="border-t border-surface-border pt-6">
            <div className="flex items-center gap-2 mb-3.5">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-black uppercase tracking-wider text-rose-400">
                Missing Requirements To Target ({missing.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missing.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-canvas-subtle border border-rose-500/30 hover:border-rose-500/50 rounded-2xl p-5 flex flex-col justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-bold text-white">
                      {skill.name}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        skill.importance === 'High'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-500/60'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/60'
                      }`}
                    >
                      {skill.importance || 'Target'} Priority
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {skill.recommendation || `Incorporate evidence of ${skill.name} usage in your experience or project sections.`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standout Candidate Skills */}
        {(filter === 'all' || filter === 'additional') && additional.length > 0 && (
          <div className="border-t border-surface-border pt-6">
            <div className="flex items-center gap-2 mb-3.5">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-black uppercase tracking-wider text-indigo-400">
                Additional Candidate Skills ({additional.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {additional.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-surface-elevated border border-surface-border text-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                >
                  {typeof item === 'object' ? item.name : item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsMatrix;
