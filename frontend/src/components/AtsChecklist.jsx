import React, { useState } from 'react';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const AtsChecklist = ({ checks = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'passed', 'failed'

  const passedCount = checks.filter((c) => c.passed).length;
  const failedCount = checks.length - passedCount;

  const filteredChecks = checks.filter((c) => {
    if (activeFilter === 'passed') return c.passed;
    if (activeFilter === 'failed') return !c.passed;
    return true;
  });

  return (
    <div className="bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 lg:p-10 shadow-subtle-card transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ATS Parser Compatibility
            </h3>
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 shadow-sm">
              {passedCount} of {checks.length} Passed
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Formatting, contact info, and keyword readability checks
          </p>
        </div>

        <div className="flex bg-canvas-subtle p-1 rounded-xl border border-surface-border text-sm">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-lg transition-all font-bold ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({checks.length})
          </button>
          <button
            onClick={() => setActiveFilter('passed')}
            className={`px-4 py-1.5 rounded-lg transition-all font-bold ${
              activeFilter === 'passed'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Passed ({passedCount})
          </button>
          <button
            onClick={() => setActiveFilter('failed')}
            className={`px-4 py-1.5 rounded-lg transition-all font-bold ${
              activeFilter === 'failed'
                ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Needs Work ({failedCount})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredChecks.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`p-5 rounded-2xl border transition-all duration-200 ${
              item.passed
                ? 'bg-emerald-950/15 border-emerald-500/25 hover:border-emerald-500/40 shadow-sm'
                : 'bg-rose-950/20 border-rose-500/35 hover:border-rose-500/50 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 shrink-0">
                {item.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="text-base font-bold text-white">
                    {item.label}
                  </span>
                  {item.category && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface text-slate-200 border border-surface-border">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {item.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AtsChecklist;
