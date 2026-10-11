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
      badge: 'AI Keywords',
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
      badge: 'Impact Formula',
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
      desc: 'Checks PDF/DOCX structure, columns, and contact headers for major ATS platforms.',
    },
    {
      title: 'Impact & Brevity',
      icon: PenTool,
      desc: 'Evaluates action verbs, quantifiable metrics (XYZ formula), and cuts filler words.',
    },
    {
      title: 'Keyword Alignment',
      icon: Target,
      desc: 'Benchmarks technical and soft skills against target job descriptions.',
    },
    {
      title: 'Red Flag Detection',
      icon: Flag,
      desc: 'Flags employment gaps, formatting errors, and unverified claims.',
    },
  ];

  return (
    <div className="space-y-16 pt-4 pb-12">
      {/* 1. Diagnostic Highlights (Explaining the hero preview graphic) */}
      <div className="border-y border-surface-border py-8">
        <div className="max-w-4xl mx-auto text-center space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Automated Audit
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            How OK-CV Grades Your Resume
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Simulates commercial ATS platforms and recruiter review in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
          <div className="bg-surface/80 border border-surface-border rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">ATS Score (0–100)</p>
              <p className="text-xs text-slate-400 mt-1">
                Overall score benchmarked across key ATS evaluation criteria.
              </p>
            </div>
          </div>

          <div className="bg-surface/80 border border-surface-border rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Passed vs. Flagged</p>
              <p className="text-xs text-slate-400 mt-1">
                Pinpoints exact bullet points that need stronger metrics or rewrites.
              </p>
            </div>
          </div>

          <div className="bg-surface/80 border border-surface-border rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Parse Rate & Layout</p>
              <p className="text-xs text-slate-400 mt-1">
                Ensures compatibility with Greenhouse, Lever, and Workday.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dual-Engine Evaluation (Simplified, clean presentation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        <div className="lg:col-span-5 flex justify-center">
          <div className="rounded-3xl border border-surface-border bg-surface/40 p-4 shadow-xl">
            <img
              src="/images/ats-checker.svg"
              alt="Two-Tier Evaluation"
              className="w-full max-w-[360px] h-auto object-contain select-none"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Dual-Layer System
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Scored for Both ATS Bots and Recruiters
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Most resumes are screened twice: first by parsing software, then by hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-surface/90 border border-surface-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-bold text-white">Machine Parsability</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tests that skills, job titles, and dates extract cleanly without formatting bugs.
              </p>
            </div>

            <div className="bg-surface/90 border border-surface-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-white">Recruiter Impact</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scores measurable impact, active verbs, and flags filler buzzwords.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Audit Pillars (Replaces the former 27 heavy bullet lists with 4 clean cards) */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
            Evaluation Pillars
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            What We Check
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Key areas audited across your entire resume.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {auditHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-surface/90 border border-surface-border rounded-2xl p-4.5 space-y-2 hover:border-emerald-500/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/25">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Video Demos (Clean & Compact) */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-5">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Preview Walkthroughs
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            See OK-CV in Action
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {videos.map((vid) => {
            const Icon = vid.icon;
            const isActive = activeVideoTab === vid.id;
            return (
              <button
                key={vid.id}
                onClick={() => setActiveVideoTab(vid.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-white border border-emerald-500/50'
                    : 'bg-surface hover:bg-surface-elevated text-slate-400 hover:text-white border border-surface-border'
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                {currentVideo.badge}
              </span>
              <h4 className="text-base font-bold text-white tracking-tight mt-1">
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
