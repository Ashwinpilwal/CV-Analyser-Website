import React, { useState, Component } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dropzone } from './components/Dropzone';
import { AnalysisView } from './components/AnalysisView';
import { DashboardView } from './components/DashboardView';
import { CvEditor } from './components/CvEditor';
import { LoadingScreen } from './components/LoadingScreen';
import { FeatureShowcase } from './components/FeatureShowcase';
import AuthModal from './components/AuthModal';
import { ToastProvider, useToast } from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { analysisAPI } from './services/api';
import { Database, Cloud, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Something went wrong while rendering</h2>
          <p className="text-sm text-slate-400 max-w-md">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { loading: authLoading, user } = useAuth();
  const [analysisResult, setAnalysisResult] = useState(() => {
    try {
      const cached = sessionStorage.getItem('auracv_active_analysis');
      return cached ? JSON.parse(cached) : null;
    } catch (_) {
      return null;
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { addToast } = useToast();
  const { isNight } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const updateAnalysis = (result) => {
    setAnalysisResult(result);
    try {
      if (result) {
        sessionStorage.setItem('auracv_active_analysis', JSON.stringify(result));
      } else {
        sessionStorage.removeItem('auracv_active_analysis');
      }
    } catch (_) {}
  };

  const handleAnalyze = async (payload, mode = 'file') => {
    setIsAnalyzing(true);
    try {
      let res;
      if (mode === 'file') {
        res = await analysisAPI.analyze(payload);
      } else {
        res = await analysisAPI.analyzeText(payload);
      }

      if (res.data.success) {
        updateAnalysis(res.data.data);
        addToast('Resume audit completed successfully', 'success');
        navigate('/report');
      } else {
        addToast(res.data.message || 'Analysis could not be completed.', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to process resume analysis.';
      addToast(msg, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectAnalysis = async (id) => {
    try {
      const res = await analysisAPI.getById(id);
      if (res.data.success) {
        updateAnalysis(res.data.data);
        navigate('/report');
      }
    } catch (err) {
      addToast('Failed to load past audit report.', 'error');
    }
  };

  const isEditorPage = location.pathname.startsWith('/editor');

  // Do not load website until session cookie is sent to server and verified
  if (authLoading) {
    return (
      <div className={`min-h-screen ${isNight ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col items-center justify-center space-y-4`}>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <ShieldCheck className="w-8 h-8 text-emerald-400 absolute" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-bold text-white tracking-wide">Validating Secure Session</p>
          <p className="text-xs text-slate-400">Authenticating cookie with server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-canvas ${isNight ? 'text-slate-200 bg-mesh-night' : 'text-slate-900 bg-mesh-day'} flex flex-col font-sans relative overflow-x-hidden`}>
      {/* Clean Lightweight Radial Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" />

      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main className={`flex-1 w-full mx-auto py-6 sm:py-8 relative z-10 ${isEditorPage ? 'max-w-[1920px] px-3 sm:px-6 xl:px-8' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
        {/* Loading Scanning State */}
        {isAnalyzing && <LoadingScreen />}

        <ErrorBoundary onReset={() => navigate('/')}>
          <Routes>
            {/* Route 1: Home / Auditor Workspace (/) */}
            <Route
              path="/"
              element={
                !isAnalyzing && (
                  <>
                    <Dropzone onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                    <FeatureShowcase />
                  </>
                )
              }
            />

            {/* Route 2: Analysis Report (/report) */}
            <Route
              path="/report"
              element={
                !isAnalyzing && (
                  analysisResult ? (
                    <AnalysisView
                      data={analysisResult}
                      onReset={() => navigate('/')}
                      onOpenEditor={() => navigate('/editor')}
                    />
                  ) : (
                    <div className="text-center py-16 space-y-4">
                      <p className="text-slate-300">No active audit data found. Upload a resume to get started.</p>
                      <button
                        onClick={() => navigate('/')}
                        className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl cursor-pointer"
                      >
                        Go to Auditor Workspace
                      </button>
                    </div>
                  )
                )
              }
            />

            {/* Route 3: Live CV Studio (/editor) */}
            <Route
              path="/editor"
              element={
                !isAnalyzing && (
                  <CvEditor
                    initialAnalysisData={analysisResult}
                    onBack={() => navigate(analysisResult ? '/report' : '/')}
                  />
                )
              }
            />

            {/* Route 4: Dashboard & History (/dashboard) */}
            <Route
              path="/dashboard"
              element={
                !isAnalyzing && (
                  <DashboardView
                    onSelectAnalysis={handleSelectAnalysis}
                    onStartNew={() => navigate('/')}
                  />
                )
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-6 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-200 font-semibold">OK-CV</span>
            <span>·</span>
            <span>Precision ATS Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>MERN Stack</span>
            <span>·</span>
            <span>Tailwind CSS</span>
            <span>·</span>
            <span>Gemini AI</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
