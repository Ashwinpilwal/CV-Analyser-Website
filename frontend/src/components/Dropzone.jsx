import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  X,
  Briefcase,
  Lock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';
import { analysisAPI } from '../services/api';
import { useToast } from './Toast';

export const Dropzone = ({ onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
  const [isDragging, setIsDragging] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileName = selectedFile.name.toLowerCase();
    const isValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExt) {
      addToast('Please upload a PDF, DOCX, or TXT file.', 'error');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      addToast('File size must be under 10MB.', 'error');
      return;
    }

    setFile(selectedFile);
    addToast(`Loaded ${selectedFile.name}`, 'info');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const loadSample = async () => {
    try {
      const res = await analysisAPI.getSample();
      if (res.data.success) {
        setTargetRole(res.data.targetRole);
        setJobDescription(res.data.sampleJobDescription);
        setResumeText(res.data.sampleResumeText);
        setInputMode('text');
        setShowJobDescription(true);
        setFile(null);
        addToast('Loaded sample resume & job description', 'success');
      }
    } catch (err) {
      addToast('Could not load sample data.', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputMode === 'file' && !file) {
      addToast('Please select a resume file (PDF or DOCX).', 'error');
      return;
    }

    if (inputMode === 'text' && (!resumeText || resumeText.trim().length < 30)) {
      addToast('Please paste your resume text (at least 30 characters).', 'error');
      return;
    }

    if (inputMode === 'file') {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);
      formData.append('jobDescription', jobDescription);
      onAnalyze(formData, 'file');
    } else {
      onAnalyze(
        {
          resumeText,
          targetRole,
          jobDescription,
        },
        'text'
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="pt-2 sm:pt-4 pb-10">
      {/* Enhancv Split Fold Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Fold Intro + Interactive Upload Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Enhancv Category Pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              Resume Checker
            </span>
            <span className="text-xs font-medium text-slate-400">
              · Powered by 27 AI Diagnostics
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4">
            Is your resume{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              good enough?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8 max-w-xl">
            Audit your resume against 27 ATS parameters. Get instant scoring, keyword alignment, and actionable bullet rewrites.
          </p>

          {/* Upload & Form Workspace Card */}
          <div className="bg-surface/95 backdrop-blur-xl border border-surface-border hover:border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-subtle-card transition-all">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mode Switcher & Sample Loader */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-surface-border">
                <div className="flex bg-canvas-subtle p-1 rounded-xl border border-surface-border text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setInputMode('file')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      inputMode === 'file'
                        ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-white border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      inputMode === 'text'
                        ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-white border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>

                <button
                  type="button"
                  onClick={loadSample}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Sample</span>
                </button>
              </div>

              {/* Upload Drop Area */}
              {inputMode === 'file' ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? 'border-emerald-400 bg-emerald-950/25 scale-[1.01]'
                      : file
                      ? 'border-emerald-500/50 bg-emerald-950/15'
                      : 'border-surface-border hover:border-emerald-400/60 bg-canvas-subtle/70 hover:bg-emerald-950/10'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {file ? (
                    <div className="w-full flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden text-left">
                        <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl text-slate-950 font-bold shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm sm:text-base font-bold text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-emerald-400 font-semibold">
                            {formatFileSize(file.size)} · Ready to analyze
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="text-xs font-bold text-slate-200 hover:text-white px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-surface-border transition-colors cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shadow-md">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-white">
                          Drop your resume here or choose a file.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                          PDF & DOCX only. Max 10MB file size.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Resume Text Content
                    </label>
                    <span className="text-xs text-slate-400">
                      {resumeText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste complete resume text here..."
                    rows={6}
                    className="w-full bg-canvas-subtle border border-surface-border rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* Optional Job Description Tailoring & Benchmark Card */}
              <div className="pt-2 border-t border-surface-border/60">
                <div
                  onClick={() => setShowJobDescription(!showJobDescription)}
                  className="flex items-center justify-between w-full py-2.5 px-3 rounded-2xl bg-canvas-subtle hover:bg-surface-elevated border border-surface-border transition-all cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">Compare with Job Description (JD)</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Benchmark your CV keywords, skills, and scoring directly against specific job requirements
                      </p>
                    </div>
                  </div>
                  {showJobDescription ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                {showJobDescription && (
                  <div className="space-y-3.5 pt-3 animate-fade-in">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Target Job Title
                      </label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Senior Full Stack Engineer, Product Manager..."
                        className="w-full bg-canvas-subtle border border-surface-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Job Description Text / Responsibilities
                        </label>
                        {jobDescription && (
                          <button
                            type="button"
                            onClick={() => setJobDescription('')}
                            className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            Clear JD
                          </button>
                        )}
                      </div>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the target job description or requirements here to benchmark ATS keyword alignment, missing skills, and role match..."
                        rows={4}
                        className="w-full bg-canvas-subtle border border-surface-border rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all resize-y leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Big Enhancv CTA Button */}
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3.5 px-6 rounded-2xl text-base font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Grading Your Resume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Upload Your Resume & Check</span>
                  </>
                )}
              </button>

              {/* Security & Privacy Guarantee */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>We never share your data with 3rd parties or use it for AI model training.</span>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Enhancv Resume Checker SVG Illustration + Live Badges */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Ambient Glow Aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 rounded-3xl blur-2xl -z-10" />

          {/* Graphic Container with Floating Badges */}
          <div className="relative w-full max-w-[500px] p-2">
            {/* SVG Visual Graphic */}
            <div className="relative rounded-3xl overflow-hidden border border-surface-border/80 bg-surface/50 shadow-2xl p-4 sm:p-6 backdrop-blur-sm">
              <img
                src="/images/resume-checker.svg"
                alt="Enhancv ATS Resume Checker"
                className="w-full h-auto object-contain select-none drop-shadow-md"
              />
            </div>

            {/* Floating Live Badge 1: Top Right Score Gauge */}
            <div className="absolute -top-3 -right-3 sm:-right-4 bg-surface-elevated/95 border border-emerald-500/50 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3 animate-fade-in">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex flex-col items-center justify-center text-slate-950 font-black shadow-md">
                <span className="text-sm leading-none">85</span>
                <span className="text-[9px] font-bold leading-none mt-0.5">/100</span>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>ATS Grader Score</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[11px] font-semibold text-emerald-400">
                  Excellent Alignment
                </div>
              </div>
            </div>

            {/* Floating Live Badge 2: Bottom Left Check Count */}
            <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-surface-elevated/95 border border-cyan-500/40 rounded-2xl px-3.5 py-2.5 shadow-xl backdrop-blur-md flex items-center gap-2.5 animate-fade-in">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">
                  ✓ 22 Passed Checks
                </div>
                <div className="text-[11px] text-amber-400 font-semibold">
                  ⚠️ 5 Need Optimization
                </div>
              </div>
            </div>

            {/* Floating Live Badge 3: Middle Right Metric Pill */}
            <div className="hidden sm:flex absolute top-1/2 -right-5 transform -translate-y-1/2 bg-surface/90 border border-emerald-500/30 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur-md items-center gap-2 text-xs font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>94% ATS Parsability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
