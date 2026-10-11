import React from 'react';
import { ThumbsUp, AlertCircle } from 'lucide-react';

export const StrengthsWeaknesses = ({ strengths = [], weaknesses = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-subtle-card transition-all">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-surface-border">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Key Resume Strengths
          </h3>
        </div>
        <ul className="space-y-4">
          {strengths.map((str, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-sm shadow-emerald-400/50" />
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-subtle-card transition-all">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-surface-border">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Areas for Improvement
          </h3>
        </div>
        <ul className="space-y-4">
          {weaknesses.map((weak, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-2 shrink-0 shadow-sm shadow-amber-400/50" />
              <span>{weak}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StrengthsWeaknesses;
