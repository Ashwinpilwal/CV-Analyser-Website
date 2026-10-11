import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Target,
  PenTool,
  Flag,
} from 'lucide-react';

export const FeatureShowcase = () => {
  const [activeVideoTab, setActiveVideoTab] = useState('tailoring');

  const videos = [
    {
      id: 'tailoring',
      title: 'Job Match & Keywords',
      badge: 'Keywords',
      icon: Target,
      description: 'Match your experience against job requirements and discover missing skills.',
      src: '/videos/checker_tailoring_4c48d62a7b.mp4',
    },
    {
      id: 'red_flags',
      title: 'Recruiter Red Flags',
      badge: 'Recruiter Audit',
      icon: Flag,
      description: 'Spot weak phrasing, formatting traps, and date discrepancies.',
      src: '/videos/checker_hr_red_flags_compressed_dc8de6e06e.mp4',
    },
    {
      id: 'tutorial',
      title: 'Optimization Guide',
      badge: 'Impact',
      icon: Sparkles,
      description: 'Turn passive job duties into quantifiable, high-impact achievements.',
      src: '/videos/Resume_Builder_Tutorial_68b11fdab1.mp4',
    },
  ];

  const currentVideo = videos.find((v) => v.id === activeVideoTab) || videos[0];

  const auditHighlights = [
    {
      title: 'ATS Parsability',
      icon: FileText,
      desc: 'Validates file format, columns, and contact headers.',
    },
    {
      title: 'Impact & Brevity',
      icon: PenTool,
      desc: 'Checks active verbs and quantifiable impact metrics.',
    },
    {
      title: 'Keyword Match',
      icon: Target,
      desc: 'Benchmarks skills against target job descriptions.',
    },
    {
      title: 'Red Flags',
      icon: Flag,
      desc: 'Detects date gaps, formatting errors, and typos.',
    },
  ];

  return (
    <div className="space-y-14 pt-4 pb-12">
      {/* 1. Diagnostic Highlights */}
      <div className="border-y border-surface-border py-7">
        <div className="max-w-4xl mx-auto text-center space-y-1.5 mb-5">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            How OK-CV Grades Your Resume
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Simulates commercial ATS platforms and recruiter review in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
          <div className="bg-surface/80 border border-surface-border rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700/80 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">ATS Score (0–100)</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Overall score benchmarked across key ATS criteria.
              </p>
            </div>
          </div>

          <div className="bg-surface/80 border border-surface-border rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700/80 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Passed vs. Flagged</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Pinpoints bullets needing stronger metrics.
              </p>
            </div>
          </div>

          <div className="bg-surface/80 border border-surface-border rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700/80 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Parse Rate & Layout</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Ensures Greenhouse, Lever, and Workday compatibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dual-Engine Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        <div className="lg:col-span-5 flex justify-center">
          <div className="rounded-3xl border border-surface-border bg-surface/40 p-4 shadow-xl">
            <img
              src="/images/ats-checker.svg"
              alt="Two-Tier Evaluation"
              className="w-full max-w-[340px] h-auto object-contain select-none opacity-90"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Scored for Both ATS and Recruiters
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Screened for automated parsing software and human hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface/90 border border-surface-border rounded-2xl p-4">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center border border-slate-700">
                  1
                </span>
                <h4 className="text-sm font-semibold text-slate-200">Machine Parsability</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts skills, job titles, and dates without layout errors.
              </p>
            </div>

            <div className="bg-surface/90 border border-surface-border rounded-2xl p-4">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center border border-slate-700">
                  2
                </span>
                <h4 className="text-sm font-semibold text-slate-200">Recruiter Impact</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scores measurable impact, active verbs, and flags buzzwords.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Audit Pillars */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 text-center tracking-tight mb-5">
          What We Check
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {auditHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-surface/90 border border-surface-border rounded-2xl p-4 hover:border-slate-700 transition-colors flex flex-col justify-start"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700/80 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 tracking-tight">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Video Demos */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-5">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            See OK-CV in Action
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {videos.map((vid) => {
            const Icon = vid.icon;
            const isActive = activeVideoTab === vid.id;
            return (
              <button
                key={vid.id}
                onClick={() => setActiveVideoTab(vid.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                    : 'bg-surface hover:bg-surface-elevated text-slate-400 hover:text-slate-200 border border-surface-border'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{vid.title}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-surface/90 border border-surface-border rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-8 overflow-hidden rounded-xl border border-surface-border bg-black">
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <video
                  key={currentVideo.src}
                  src={currentVideo.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                {currentVideo.badge}
              </span>
              <h4 className="text-base font-semibold text-slate-100 tracking-tight mt-1">
                {currentVideo.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentVideo.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
