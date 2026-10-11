import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

export const BulletRewriter = ({ suggestions = [] }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { addToast } = useToast();

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    addToast('Copied optimized bullet point to clipboard', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 lg:p-10 shadow-subtle-card transition-all">
      <div className="mb-8 pb-6 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Bullet Rewrites & Recommendations
          </h3>
        </div>
        <p className="text-sm text-slate-300 mt-1">
          Turn passive duties into quantified, high-impact achievement statements
        </p>
      </div>

      <div className="space-y-6">
        {suggestions.map((item, idx) => {
          const isCopied = copiedIndex === idx;
          const priority = (item.priority || 'recommended').toLowerCase();

          return (
            <div
              key={idx}
              className="bg-canvas-subtle border border-surface-border rounded-2xl p-5 sm:p-6 transition-all hover:border-slate-500"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-sm font-bold text-cyan-300">
                    0{idx + 1}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {item.title}
                  </h4>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${
                    priority === 'critical'
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500/60'
                      : priority === 'recommended'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/60'
                      : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/60'
                  }`}
                >
                  {priority} Priority
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 mb-5 leading-relaxed font-normal">
                {item.description}
              </p>

              {item.exampleRewrite && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 block flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>Original / Weak</span>
                      </span>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                        "{item.exampleRewrite.before}"
                      </p>
                    </div>
                  </div>

                  {/* After */}
                  <div className="bg-emerald-950/25 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm shadow-emerald-500/10">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Optimized / Quantified</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.exampleRewrite.after, idx)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                        "{item.exampleRewrite.after}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BulletRewriter;
