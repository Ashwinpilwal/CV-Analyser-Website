import React, { useEffect } from 'react';
import { ArrowLeft, Printer, Download, FileText, Briefcase, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import ScoreGauge from './ScoreGauge';
import ExecutiveSummary from './ExecutiveSummary';
import SkillsMatrix from './SkillsMatrix';
import AtsChecklist from './AtsChecklist';
import StrengthsWeaknesses from './StrengthsWeaknesses';
import BulletRewriter from './BulletRewriter';
import { useToast } from './Toast';

export const AnalysisView = ({ data, onReset, onOpenEditor }) => {
  const { addToast } = useToast();

  useEffect(() => {
    // Fire subtle celebration confetti if candidate achieved an excellent score >= 80
    if (data?.overallScore >= 80) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#4ade80', '#38bdf8', '#f8fafc'],
        });
      } catch (_) {}
    }
  }, [data?.overallScore]);

  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `OK-CV_Audit_${data.targetRole?.replace(/\s+/g, '_') || 'Resume'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Audit JSON downloaded', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in print-page">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-surface-border no-print">
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white bg-surface-elevated hover:bg-surface-hover border border-surface-border rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Audit Another Resume</span>
          </button>
          <div className="h-5 w-px bg-surface-border" />
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-sm sm:text-base font-semibold text-white">
              {data.resumeName || 'Uploaded Resume'}
            </span>
            {data.resumeUrl && data.resumeUrl.startsWith('http') && !data.resumeUrl.includes('placeholder-resumes.internal') && (
              <a
                href={data.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/60 hover:text-cyan-200 rounded-lg transition-colors"
                title="View original uploaded CV in Cloudinary"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Original CV</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenEditor && (
            <button
              onClick={onOpenEditor}
              className="flex items-center gap-2 px-4 py-2 text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all shadow-md shadow-teal-500/25 hover:scale-[1.02] cursor-pointer"
            >
              <span>Edit in Live CV Studio</span>
            </button>
          )}
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white bg-surface-elevated hover:bg-surface-hover border border-surface-border rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-200 bg-surface-elevated hover:bg-surface-hover border border-surface-border rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Target Position & JD Benchmark Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-elevated/70 border border-surface-border rounded-2xl px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">
              Target Position:
            </span>
            <span className="text-base sm:text-lg font-bold text-white">
              {data.targetRole || 'Software Engineering Professional'}
            </span>
          </div>
          {data.jobDescription && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Tailored against Job Description</span>
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-slate-300">
          Evaluated: {new Date(data.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Primary Score Ring & Evaluation Pillars */}
      <ScoreGauge
        score={data.overallScore || 70}
        breakdown={data.scoreBreakdown}
        roleMatch={data.targetRoleMatch}
      />

      {/* Executive Summary */}
      <ExecutiveSummary
        summary={data.executiveSummary}
        stats={data.keyStats}
        aiModelUsed={data.aiModelUsed}
      />

      {/* Skills Matrix */}
      <SkillsMatrix skillsAnalysis={data.skillsAnalysis} />

      {/* ATS Parser Checklist */}
      <AtsChecklist checks={data.atsChecks} />

      {/* Strengths & Weaknesses */}
      <StrengthsWeaknesses
        strengths={data.strengths}
        weaknesses={data.weaknesses}
      />

      {/* Google X-Y-Z Bullet Rewriter */}
      <BulletRewriter suggestions={data.actionableSuggestions} />
    </div>
  );
};

export default AnalysisView;
