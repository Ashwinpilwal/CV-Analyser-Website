import React, { useState } from 'react';
import {
  FileText,
  Check,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Target,
  Users,
  Search,
  BookOpen,
  Award,
  Layers,
  Briefcase,
  PenTool,
  Flag,
  Crown,
  Play,
} from 'lucide-react';

export const FeatureShowcase = () => {
  const [activeVideoTab, setActiveVideoTab] = useState('tailoring');

  const videos = [
    {
      id: 'tailoring',
      title: 'Job Tailoring & Match',
      badge: 'AI Keyword Match',
      icon: Target,
      description:
        'See how our ATS engine matches your experience against job requirements and extracts high-priority keywords.',
      src: '/videos/checker_tailoring_4c48d62a7b.mp4',
    },
    {
      id: 'red_flags',
      title: 'Fix HR Red Flags',
      badge: 'Recruiter Audit',
      icon: Flag,
      description:
        'Spot and eliminate vague unquantified bullets, date inconsistencies, and resume formatting traps.',
      src: '/videos/checker_hr_red_flags_compressed_dc8de6e06e.mp4',
    },
    {
      id: 'tutorial',
      title: 'Resume Optimization Tutorial',
      badge: 'Google X-Y-Z Formula',
      icon: Sparkles,
      description:
        'Step-by-step guidance on transforming passive duties into quantifiable, interview-generating achievements.',
      src: '/videos/Resume_Builder_Tutorial_68b11fdab1.mp4',
    },
  ];

  const currentVideo = videos.find((v) => v.id === activeVideoTab) || videos[0];

  const checksCategories = [
    {
      title: 'ATS Essentials',
      icon: FileText,
      checks: [
        'File format and parsability (PDF/DOCX)',
        'ATS-friendly single & multi-column design',
        'Professional contact email address check',
        'Header links and portfolio compliance',
        'Resume file naming convention',
        'Dates and timeline format consistency',
      ],
    },
    {
      title: 'Resume Content & Impact',
      icon: PenTool,
      checks: [
        'ATS parse rate benchmark across platforms',
        'Quantifying impact with AI rewrite suggestions',
        'Repetition of words and overused buzzwords',
        'Spelling, grammar, and typography precision',
        'Bullet length, cadence, and action verb strength',
      ],
    },
    {
      title: 'Job Tailoring & Keywords',
      icon: Target,
      checks: [
        'Hard skills semantic alignment',
        'Soft skills contextual evidence',
        'High-impact action verbs and leadership tone',
        'Tailored target job title alignment',
      ],
    },
    {
      title: 'Resume Sections & Order',
      icon: Layers,
      checks: [
        'Essential core sections present (Summary, Experience, Skills, Education)',
        'Contact information hierarchy',
        'Reverse-chronological ordering standard',
      ],
    },
    {
      title: 'Recruiter Red Flags',
      icon: Flag,
      checks: [
        'Resume credibility and unverifiable claims',
        'Employment gaps and date discrepancies',
        'Peer benchmarking against top applicants',
        'LinkedIn and online profile consistency',
      ],
    },
    {
      title: 'Seniority & Progression',
      icon: Crown,
      checks: [
        'Career progression trajectory',
        'Measurable ownership and business impact',
        'Leadership, mentorship, and senior signals',
      ],
    },
  ];

  return (
    <div className="space-y-16 pt-6 pb-12">
      {/* 1. Resume Checker Overview & Diagnostics (Explaining the image above) */}
      <div className="border-y border-surface-border py-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Diagnostic Breakdown</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            How OK-CV Grades Your Resume
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The preview above illustrates our real-time audit engine at work—simulating commercial applicant tracking systems before a hiring manager opens your file.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 text-left">
            <div className="bg-surface/80 border border-surface-border rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">ATS Grader Score (0–100)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Calculates an overall alignment rating based on 27 ATS parameters and keyword density.
                </p>
              </div>
            </div>

            <div className="bg-surface/80 border border-surface-border rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Passed vs. Flagged Checks</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Separates verified strengths from items needing optimization like repetition and weak verbs.
                </p>
              </div>
            </div>

            <div className="bg-surface/80 border border-surface-border rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Parse Rate & Structure</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Validates section headers, fonts, and dates against Greenhouse, Lever, and Workday systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Enhancv Two-Tier Scoring System Section with ats-checker.svg */}
      <div className="scroll-mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual ATS Checker Machine Illustration (ats-checker.svg) */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[560px] p-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-teal-500/10 rounded-3xl blur-2xl -z-10" />
              <div className="rounded-3xl overflow-hidden border border-surface-border bg-surface/40 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
                <img
                  src="/images/ats-checker.svg"
                  alt="Resume Grader and Two-Tier ATS Evaluation"
                  className="w-full h-auto object-contain select-none drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Title, Explanations, and Tier Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 inline-block mb-3">
                Two-Tier Evaluation
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-3">
                OK-CV scores resumes with a{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  two-tier system
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Most resumes are screened by an ATS before reaching human recruiters. OK-CV checks both automated machine parsing and recruiter standards.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Tier 1 Box */}
              <div className="bg-surface/90 border border-surface-border hover:border-emerald-500/40 rounded-2xl p-5 shadow-subtle-card transition-all">
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                    1
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Machine Parsability
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pl-11">
                  Tests how cleanly Greenhouse, Lever, and Workday extract your experience, skills, and dates without layout errors.
                </p>
              </div>

              {/* Tier 2 Box */}
              <div className="bg-surface/90 border border-surface-border hover:border-cyan-500/40 rounded-2xl p-5 shadow-subtle-card transition-all">
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-sm flex items-center justify-center border border-cyan-500/30">
                    2
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Recruiter Quality Signals
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pl-11">
                  Evaluates quantifiable impact (Google XYZ formula), active verbs, and flags buzzwords or formatting pitfalls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The 27 Crucial Checks Across 6 Categories (Exact Enhancv Matrix) */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 inline-block mb-3">
            Comprehensive Auditing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            The AI-powered Resume Checker goes beyond typos
          </h2>
          <p className="text-base text-slate-300 leading-relaxed font-normal">
            We evaluate your resume across 27 crucial parameters across six different categories
            so you stand out in the applicant pool:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checksCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-surface/90 border border-surface-border hover:border-emerald-500/40 rounded-3xl p-6 shadow-subtle-card transition-all"
              >
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-surface-border">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/25">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">{cat.title}</h4>
                </div>

                <ul className="space-y-3">
                  {cat.checks.map((checkText, cIdx) => (
                    <li
                      key={cIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{checkText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive Video Demos Section */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 inline-block mb-3">
            Video Walkthroughs
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
            See the AI Diagnostics in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Watch how our ATS intelligence engine scans, identifies gaps, and transforms resumes.
          </p>
        </div>

        {/* Video Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {videos.map((vid) => {
            const Icon = vid.icon;
            const isActive = activeVideoTab === vid.id;
            return (
              <button
                key={vid.id}
                onClick={() => setActiveVideoTab(vid.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 text-white border border-emerald-500/50 scale-[1.02]'
                    : 'bg-surface hover:bg-surface-elevated text-slate-300 hover:text-white border border-surface-border'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{vid.title}</span>
              </button>
            );
          })}
        </div>

        {/* Video Player Card */}
        <div className="bg-surface/90 border border-surface-border rounded-3xl p-6 sm:p-8 shadow-subtle-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-surface-border bg-black shadow-inner">
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <video
                  key={currentVideo.src}
                  src={currentVideo.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 w-fit">
                {currentVideo.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentVideo.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {currentVideo.description}
              </p>
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Real-time analysis against industry ATS criteria</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
