import React, { useState, useEffect } from 'react';
import { Cpu, Check } from 'lucide-react';

export const LoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Parsing resume text and structure...',
    'Checking ATS keyword match & formatting...',
    'Matching skills against job requirements...',
    'Generating AI score and bullet recommendations...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface border border-surface-border rounded-2xl p-8 sm:p-12 shadow-subtle-card flex flex-col items-center justify-center text-center animate-fade-in my-8 max-w-xl mx-auto">
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-accent-sage/30 animate-ping opacity-75" />
        <div className="w-16 h-16 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-accent-sage shadow-md">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight mb-1">
        Analyzing Your Resume
      </h3>
      <p className="text-sm text-slate-300 max-w-md mb-8">
        Running ATS compatibility checks and generating AI suggestions with Gemini
      </p>

      {/* Progress sequence */}
      <div className="w-full space-y-3.5 text-left">
        {steps.map((text, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-surface-elevated border-slate-600 text-white shadow-sm'
                  : isDone
                  ? 'bg-canvas-subtle border-surface-border text-slate-300'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-accent-sage/20 border border-accent-sage/60 flex items-center justify-center text-accent-sage">
                    <Check className="w-3 h-3" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-accent-sage border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700" />
                )}
              </div>
              <span className="text-sm font-medium">{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingScreen;
