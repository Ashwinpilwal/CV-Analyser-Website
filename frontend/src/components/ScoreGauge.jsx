import React, { useEffect, useState } from 'react';
import { ShieldCheck, Award, Zap, Layers } from 'lucide-react';

export const ScoreGauge = ({ score = 0, breakdown = {}, roleMatch = '' }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color schemes based on score tier
  const getTheme = (val) => {
    if (val >= 80) {
      return {
        gradientId: 'gaugeEmerald',
        textColor: 'text-emerald-400',
        badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/50 shadow-emerald-500/10',
        tier: 'Excellent Alignment',
      };
    }
    if (val >= 65) {
      return {
        gradientId: 'gaugeAmber',
        textColor: 'text-amber-400',
        badge: 'bg-amber-950/50 text-amber-300 border-amber-500/50 shadow-amber-500/10',
        tier: 'Moderate Fit · Needs Optimization',
      };
    }
    return {
      gradientId: 'gaugeRose',
      textColor: 'text-rose-400',
      badge: 'bg-rose-950/50 text-rose-300 border-rose-500/50 shadow-rose-500/10',
      tier: 'High ATS Risk · Significant Gaps',
    };
  };

  const theme = getTheme(score);
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const metrics = [
    {
      label: 'ATS Parsability',
      score: breakdown.atsCompatibility || 75,
      icon: ShieldCheck,
      desc: 'Machine-readability & header structure',
      color: 'from-cyan-400 to-blue-500',
      iconColor: 'text-cyan-400',
      bgGlow: 'bg-cyan-500/10 border-cyan-500/30',
    },
    {
      label: 'Skills & Keywords',
      score: breakdown.skillsMatch || 70,
      icon: Zap,
      desc: 'Match against target job expectations',
      color: 'from-emerald-400 to-teal-500',
      iconColor: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      label: 'Content & Impact',
      score: breakdown.contentQuality || 72,
      icon: Award,
      desc: 'Measurable achievements and KPIs',
      color: 'from-amber-400 to-orange-500',
      iconColor: 'text-amber-400',
      bgGlow: 'bg-amber-500/10 border-amber-500/30',
    },
    {
      label: 'Formatting & Layout',
      score: breakdown.structureFormatting || 80,
      icon: Layers,
      desc: 'Clear sections and chronological order',
      color: 'from-purple-400 to-indigo-500',
      iconColor: 'text-purple-400',
      bgGlow: 'bg-purple-500/10 border-purple-500/30',
    },
  ];

  return (
    <div className="bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 lg:p-10 shadow-subtle-card transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radial Gauge Container */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
              <defs>
                <linearGradient id="gaugeEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="gaugeAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="gaugeRose" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              {/* Background Track */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-800/80"
                fill="transparent"
              />
              {/* Progress Stroke */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke={`url(#${theme.gradientId})`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-6xl font-black tracking-tight text-white drop-shadow-md">
                {animatedScore}
              </span>
              <span className="text-sm font-bold text-slate-300 mt-1">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-2">
            <span className={`px-4 py-1.5 text-sm font-bold rounded-full border shadow-sm ${theme.badge}`}>
              {theme.tier}
            </span>
            {roleMatch && (
              <p className="text-sm text-slate-300 max-w-sm mt-1 leading-relaxed text-center font-medium">
                {roleMatch}
              </p>
            )}
          </div>
        </div>

        {/* 4-Pillar Sub-metrics Breakdown */}
        <div className="lg:col-span-7 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-surface-border pt-6 lg:pt-0 lg:pl-10">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>Evaluation Pillars</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Component Scores
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`bg-canvas-subtle border rounded-2xl p-4 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-md ${item.bgGlow}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      <span className="text-sm sm:text-base font-bold text-white">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-white bg-surface px-2.5 py-0.5 rounded-lg border border-surface-border shadow-sm">
                      {item.score}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${item.color}`}
                      style={{
                        width: `${item.score}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
