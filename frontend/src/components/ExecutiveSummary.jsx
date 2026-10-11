import React from 'react';
import { Quote, Clock, FileText, CheckCircle, Cpu } from 'lucide-react';

export const ExecutiveSummary = ({ summary = '', stats = {}, aiModelUsed = '' }) => {
  return (
    <div className="bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 lg:p-10 shadow-subtle-card transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
            <Quote className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Executive Summary & Verdict
          </h3>
        </div>
        {aiModelUsed && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-bold text-cyan-300 shadow-sm">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{aiModelUsed}</span>
          </div>
        )}
      </div>

      <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
        {summary || 'Review the diagnostic breakdown below for strategic improvements.'}
      </p>

      {/* Document Key Metrics Strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-surface-border">
          <div className="bg-gradient-to-tr from-cyan-950/20 to-blue-950/20 rounded-2xl p-4 border border-cyan-500/30">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Length
            </span>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-base font-extrabold text-white">
                {stats.wordCount || 0} words
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-teal-950/20 to-emerald-950/20 rounded-2xl p-4 border border-teal-500/30">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
              Read Time
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span className="text-base font-extrabold text-white">
                ~{stats.readingTimeMinutes || 2} min
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-emerald-950/20 to-green-950/20 rounded-2xl p-4 border border-emerald-500/30">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Identified Skills
            </span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-base font-extrabold text-white">
                {stats.detectedSkillsCount || 0} skills
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-indigo-950/20 to-purple-950/20 rounded-2xl p-4 border border-indigo-500/30">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-1">
              Keyword Density
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <span className="text-base font-extrabold text-white">
                {stats.matchRatioPercent || 75}% fit
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveSummary;
