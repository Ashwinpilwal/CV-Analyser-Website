import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  Palette,
  Type,
  Maximize2,
  Minimize2,
  Eye,
  Sliders,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Check,
  ChevronDown,
  Layout,
  Layers,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useToast } from './Toast';

// Default initial candidate data
const INITIAL_DATA = {
  personal: {
    name: 'Alexa Chen',
    title: 'Senior Full Stack Software Engineer',
    email: 'alexa.chen.eng@gmail.com',
    phone: '+1 (415) 890-2341',
    location: 'San Francisco, CA',
    website: 'alexachen.dev',
    linkedin: 'linkedin.com/in/alexachen-dev',
    github: 'github.com/alexa-codes',
  },
  summary:
    'Results-driven Senior Full Stack Engineer with 5+ years of experience architecting distributed web systems, resilient microservices, and reactive user interfaces using React, Node.js, and TypeScript. Spearheaded cloud migrations that slashed infrastructure expenditure by 34% while scaling to 450,000 active users.',
  experience: [
    {
      id: 'exp-1',
      role: 'Staff Engineer / Full Stack Lead',
      company: 'Vertex Media Solutions',
      location: 'San Francisco, CA',
      period: 'March 2022 – Present',
      bullets: [
        'Architected and delivered multi-tenant analytics dashboard serving 150+ enterprise clients using React and Node.js microservices.',
        'Boosted core web vitals and slashed initial page load latency by 48% through server-side rendering and asset prefetching.',
        'Designed distributed event pipelines and caching layers with Redis and MongoDB, accommodating peak bursts of 8,500 req/sec.',
        'Mentored 6 software engineers across code reviews, unit testing methodologies, and architectural design patterns.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Full Stack Software Engineer',
      company: 'Horizon Digital Labs',
      location: 'Austin, TX',
      period: 'July 2019 – February 2022',
      bullets: [
        'Developed scalable REST APIs using Express.js and TypeScript connected to MongoDB and PostgreSQL data layers.',
        'Integrated automated end-to-end testing with Jest and Cypress, elevating test coverage from 52% to 89% and cutting production bugs by 35%.',
        'Automated containerized Docker deployments via GitHub Actions pipelines, decreasing deploy downtime to zero.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science (Magna Cum Laude)',
      school: 'University of Washington',
      location: 'Seattle, WA',
      period: '2015 – 2019',
      details: 'Relevant Coursework: Distributed Systems, Algorithms, Cloud Architecture.',
    },
  ],
  skills: [
    'React',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Express.js',
    'Tailwind CSS',
    'Redis',
    'Git & CI/CD',
    'REST APIs',
    'System Design',
  ],
};

const PALETTE_GRADIENT =
  'linear-gradient(to right, #0f172a, #1e3a8a, #2563eb, #0284c7, #06b6d4, #0d9488, #10b981, #16a34a, #d97706, #ea580c, #dc2626, #e11d48, #db2777, #9333ea, #7c3aed, #4f46e5, #475569, #0f172a)';

const PALETTE_STOPS = [
  { r: 15, g: 23, b: 42 },    // #0f172a Obsidian
  { r: 30, g: 58, b: 138 },   // #1e3a8a Navy
  { r: 37, g: 99, b: 235 },   // #2563eb Blue
  { r: 2, g: 132, b: 199 },   // #0284c7 Ocean
  { r: 6, g: 182, b: 212 },   // #06b6d4 Cyan
  { r: 13, g: 148, b: 136 },  // #0d9488 Teal
  { r: 16, g: 185, b: 129 },  // #10b981 Emerald
  { r: 22, g: 163, b: 74 },   // #16a34a Forest
  { r: 217, g: 119, b: 6 },   // #d97706 Amber
  { r: 234, g: 88, b: 12 },   // #ea580c Orange
  { r: 220, g: 38, b: 38 },   // #dc2626 Red
  { r: 225, g: 29, b: 72 },   // #e11d48 Rose
  { r: 219, g: 39, b: 119 },  // #db2777 Magenta
  { r: 147, g: 51, b: 234 },  // #9333ea Purple
  { r: 124, g: 58, b: 237 },  // #7c3aed Violet
  { r: 79, g: 70, b: 229 },   // #4f46e5 Indigo
  { r: 71, g: 85, b: 105 },   // #475569 Slate
  { r: 15, g: 23, b: 42 },    // #0f172a
];

const getColorAtRatio = (ratio) => {
  const clamped = Math.max(0, Math.min(1, ratio));
  const scaled = clamped * (PALETTE_STOPS.length - 1);
  const index = Math.floor(scaled);
  const t = scaled - index;
  const c1 = PALETTE_STOPS[index];
  const c2 = PALETTE_STOPS[Math.min(PALETTE_STOPS.length - 1, index + 1)];
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
};

const ColorPalettePicker = ({ value, onChange }) => {
  const trackRef = useRef(null);
  const [thumbPercent, setThumbPercent] = useState(33);

  const handlePointer = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = x / rect.width;
    setThumbPercent(ratio * 100);
    const hex = getColorAtRatio(ratio);
    onChange(hex);
  };

  const onPointerDown = (e) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    handlePointer(e.clientX);
  };

  const onPointerMove = (e) => {
    handlePointer(e.clientX);
  };

  const onPointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  return (
    <div className="space-y-3">
      {/* Interactive Drag & Hover Gradient Bar */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative h-9 sm:h-10 w-full rounded-2xl cursor-crosshair border border-white/20 shadow-inner select-none touch-none"
        style={{ background: PALETTE_GRADIENT }}
        title="Hover or drag across palette to select color"
      >
        {/* Thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white shadow-xl pointer-events-none transition-transform scale-110"
          style={{
            left: `${thumbPercent}%`,
            backgroundColor: value,
          }}
        />
      </div>

      {/* Selected Color Readout */}
      <div className="flex items-center justify-between gap-3 bg-canvas-subtle px-3 py-2 rounded-xl border border-surface-border">
        <div className="flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded-md border border-white/20 shadow-sm shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">{value}</span>
        </div>
        <span className="text-[11px] text-slate-400">Drag or hover slider to adjust</span>
      </div>
    </div>
  );
};

const FONT_OPTIONS = [
  { name: 'Plus Jakarta Sans (Modern)', value: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Inter (Clean Neutral)', value: "'Inter', sans-serif" },
  { name: 'Merriweather (Executive Serif)', value: "'Merriweather', Georgia, serif" },
  { name: 'Georgia (Classic Editorial)', value: "Georgia, serif" },
  { name: 'JetBrains Mono (Technical)', value: "'JetBrains Mono', monospace" },
];

const DENSITY_PRESETS = [
  {
    id: 'compact',
    label: 'Compact',
    hint: 'Fit 1-Page',
    values: { fontSize: '10px', lineHeight: '1.35', pagePadding: '18px', sectionSpacing: '10px' },
  },
  {
    id: 'balanced',
    label: 'Balanced',
    hint: 'Standard ATS',
    values: { fontSize: '11px', lineHeight: '1.4', pagePadding: '20px', sectionSpacing: '12px' },
  },
  {
    id: 'spacious',
    label: 'Spacious',
    hint: 'Roomy',
    values: { fontSize: '12px', lineHeight: '1.45', pagePadding: '24px', sectionSpacing: '14px' },
  },
];

/**
 * Parses raw CV text into structured sections for Live CV Studio
 */
const parseResumeTextToCvData = (rawText, analysisData) => {
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 20) {
    return null;
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // 1. Candidate Name (usually the 1st prominent non-empty line)
  let candidateName = 'Candidate';
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/^(curriculum vitae|resume|cv)\s*:?/i, '').trim();
    if (firstLine && firstLine.length <= 45 && !firstLine.includes('@')) {
      candidateName = firstLine;
    }
  }

  // 2. Email, Phone, Links
  const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,5}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const linkedinMatch = rawText.match(/(?:linkedin\.com\/in\/[\w-]+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  const githubMatch = rawText.match(/(?:github\.com\/[\w-]+)/i);
  const github = githubMatch ? githubMatch[0] : '';

  const locationMatch = rawText.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2,}(?:\s+\d{5})?|[A-Z][a-zA-Z\s]+,\s*India|[A-Z][a-zA-Z\s]+,\s*USA)/i);
  const location = locationMatch ? locationMatch[0].trim() : '';

  // 3. Target Role / Title
  const title = analysisData?.targetRole || 'Software Professional';

  // 4. Section partitioning
  const sectionKeywords = [
    { key: 'summary', regex: /^(professional summary|profile|about me|summary|objective)/i },
    { key: 'experience', regex: /^(experience|work experience|employment history|professional experience|work history)/i },
    { key: 'education', regex: /^(education|academic background|academics|qualifications)/i },
    { key: 'projects', regex: /^(projects|academic projects|key projects|personal projects)/i },
    { key: 'skills', regex: /^(skills|technical skills|core competencies|areas of expertise|technologies)/i },
  ];

  const sections = {
    summary: [],
    experience: [],
    education: [],
    projects: [],
    skills: [],
    other: [],
  };

  let currentSection = 'summary';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = sectionKeywords.find((sk) => sk.regex.test(line));

    if (headerMatch) {
      currentSection = headerMatch.key;
      continue;
    }

    if (sections[currentSection]) {
      sections[currentSection].push(line);
    }
  }

  // 5. Summary Text
  let summary = '';
  if (sections.summary.length > 0) {
    summary = sections.summary.slice(0, 5).join(' ');
  } else if (analysisData?.executiveSummary) {
    summary = analysisData.executiveSummary;
  } else {
    summary = `Experienced ${title} with a track record of building performant systems and delivering high-impact solutions.`;
  }

  // 6. Experience Entries
  const expEntries = [];
  const expLines = sections.experience.length > 0 ? sections.experience : sections.projects;
  
  if (expLines.length > 0) {
    let currentExp = null;

    expLines.forEach((line) => {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line);
      const cleanLine = line.replace(/^[•\-*]\s*|^\d+\.\s*/, '').trim();

      // Detect new company or role header
      const looksLikeHeader =
        !isBullet &&
        (line.includes('|') || line.includes('–') || line.includes('-') || line.length < 65) &&
        !/\b(and|the|with|for|which)\b/i.test(line.slice(0, 15));

      if (looksLikeHeader && (!currentExp || currentExp.bullets.length > 0)) {
        if (currentExp) expEntries.push(currentExp);
        const parts = line.split(/[|–—]/).map((p) => p.trim());
        currentExp = {
          id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          role: parts[0] || 'Software Engineer',
          company: parts[1] || 'Organization / Company',
          location: parts[2] || location || 'Remote',
          period: 'Recent',
          bullets: [],
        };
      } else if (currentExp) {
        if (cleanLine.length > 8) {
          currentExp.bullets.push(cleanLine);
        }
      } else {
        // First entry before header recognized
        currentExp = {
          id: `exp-${Date.now()}-first`,
          role: title,
          company: 'Professional Experience',
          location: location || 'Remote',
          period: 'Recent',
          bullets: [cleanLine],
        };
      }
    });

    if (currentExp && (currentExp.bullets.length > 0 || currentExp.role)) {
      expEntries.push(currentExp);
    }
  }

  // 7. Education Entries
  const eduEntries = [];
  if (sections.education.length > 0) {
    let currentEdu = null;
    sections.education.forEach((line) => {
      const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
      const isDegree = /bachelor|master|b\.tech|b\.e|m\.tech|b\.s|m\.s|degree|diploma|phd/i.test(cleanLine);

      if (isDegree || !currentEdu) {
        if (currentEdu) eduEntries.push(currentEdu);
        const parts = cleanLine.split(/[|–—,]/).map((p) => p.trim());
        currentEdu = {
          id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          degree: parts[0] || 'Bachelor of Science / Technology',
          school: parts[1] || 'University / Institution',
          location: location || '',
          period: 'Graduated',
          details: parts.slice(2).join(' ') || 'Relevant coursework & academic foundation.',
        };
      } else if (currentEdu && cleanLine) {
        currentEdu.details += ` ${cleanLine}`;
      }
    });
    if (currentEdu) eduEntries.push(currentEdu);
  }

  // 8. Skills
  let skillsList = [];
  if (analysisData?.skillsAnalysis?.matchingSkills?.length > 0) {
    skillsList = analysisData.skillsAnalysis.matchingSkills.map((s) => s.name);
    if (analysisData?.skillsAnalysis?.additionalCandidateSkills?.length > 0) {
      skillsList = [...skillsList, ...analysisData.skillsAnalysis.additionalCandidateSkills];
    }
  }

  if (skillsList.length < 4 && sections.skills.length > 0) {
    const rawSkills = sections.skills
      .join(' ')
      .split(/[,|•\n/]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 30);
    skillsList = [...new Set([...skillsList, ...rawSkills])];
  }

  if (skillsList.length === 0) {
    skillsList = INITIAL_DATA.skills;
  }

  return {
    personal: {
      name: candidateName,
      title: title,
      email: email || INITIAL_DATA.personal.email,
      phone: phone || INITIAL_DATA.personal.phone,
      location: location || INITIAL_DATA.personal.location,
      website: '',
      linkedin: linkedin || '',
      github: github || '',
    },
    summary: summary || INITIAL_DATA.summary,
    experience: expEntries.length > 0 ? expEntries : INITIAL_DATA.experience,
    education: eduEntries.length > 0 ? eduEntries : INITIAL_DATA.education,
    skills: skillsList.slice(0, 22),
  };
};

const cleanNameFromFileName = (fileName) => {
  if (!fileName) return 'Candidate';
  let clean = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b(cv|resume|semester\d*|version\d*|ver\d*|for\s+\w+|final|latest|draft)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Capitalize properly
  clean = clean
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return clean.length >= 2 ? clean : 'Candidate';
};

const buildCvDataFromAnalysis = (analysis) => {
  if (!analysis) return INITIAL_DATA;

  const candidateName =
    analysis.parsedResume?.personal?.name ||
    cleanNameFromFileName(analysis.resumeName);

  const skillsFromAnalysis =
    analysis.parsedResume?.skills?.length > 0
      ? analysis.parsedResume.skills
      : analysis.skillsAnalysis?.matchingSkills?.map((s) => s.name)?.concat(
          analysis.skillsAnalysis?.additionalCandidateSkills || []
        ) || [];

  // If parsedResume has structured data from Gemini
  if (analysis.parsedResume && analysis.parsedResume.personal?.name) {
    return {
      personal: {
        name: candidateName,
        title: analysis.parsedResume.personal?.title || analysis.targetRole || 'Software Professional',
        email: analysis.parsedResume.personal?.email || '',
        phone: analysis.parsedResume.personal?.phone || '',
        location: analysis.parsedResume.personal?.location || '',
        website: analysis.parsedResume.personal?.website || '',
        linkedin: analysis.parsedResume.personal?.linkedin || '',
        github: analysis.parsedResume.personal?.github || '',
      },
      summary:
        analysis.parsedResume.summary ||
        analysis.executiveSummary ||
        `Experienced ${analysis.targetRole || 'Software Professional'} with proven track record in engineering and architecture.`,
      experience:
        analysis.parsedResume.experience?.length > 0
          ? analysis.parsedResume.experience
          : [
              {
                id: 'exp-1',
                role: analysis.targetRole || 'Software Engineer',
                company: analysis.resumeName?.includes('Scaler') ? 'Scaler Academy' : 'Professional Experience',
                location: 'Remote / Bengaluru',
                period: '2022 – Present',
                bullets: [
                  'Architected and delivered scalable web applications with modern frontend and backend frameworks.',
                  'Engineered performant database queries and optimized API endpoints, reducing response times.',
                  'Collaborated across cross-functional engineering teams to implement production-ready features.',
                ],
              },
            ],
      education:
        analysis.parsedResume.education?.length > 0
          ? analysis.parsedResume.education
          : [
              {
                id: 'edu-1',
                degree: 'Bachelor of Technology in Computer Science',
                school: analysis.resumeName?.includes('Scaler') ? 'Scaler School of Technology' : 'University / College',
                location: '',
                period: '2019 – 2023',
                details: 'Core Coursework: Data Structures, Algorithms, Distributed Systems, Web Development.',
              },
            ],
      skills: skillsFromAnalysis.length > 0 ? [...new Set(skillsFromAnalysis)] : INITIAL_DATA.skills,
    };
  }

  // If raw resume text exists, parse it
  const parsed = parseResumeTextToCvData(analysis.resumeText, analysis);
  if (parsed) {
    if (!parsed.personal.name || parsed.personal.name === 'Candidate') {
      parsed.personal.name = candidateName;
    }
    return parsed;
  }

  // Fallback without raw text
  return {
    personal: {
      name: candidateName,
      title: analysis.targetRole || 'Software Professional',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
    },
    summary:
      analysis.executiveSummary ||
      `Experienced ${analysis.targetRole || 'Software Professional'} with demonstrated technical capabilities.`,
    experience: [
      {
        id: 'exp-1',
        role: analysis.targetRole || 'Software Engineer',
        company: analysis.resumeName?.includes('Scaler') ? 'Scaler Academy' : 'Professional Organization',
        location: 'Bengaluru, India',
        period: '2022 – Present',
        bullets: [
          'Engineered and delivered core software solutions meeting stringent ATS and production standards.',
          'Optimized distributed services and responsive user interfaces with high reliability.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Technology (Computer Science)',
        school: analysis.resumeName?.includes('Scaler') ? 'Scaler School of Technology' : 'Engineering Institution',
        location: '',
        period: '2019 – 2023',
        details: 'Foundational coursework in computer science and full-stack software development.',
      },
    ],
    skills: skillsFromAnalysis.length > 0 ? [...new Set(skillsFromAnalysis)] : INITIAL_DATA.skills,
  };
};

export const CvEditor = ({ initialAnalysisData, onBack }) => {
  const [data, setData] = useState(() => buildCvDataFromAnalysis(initialAnalysisData));

  const [activeTab, setActiveTab] = useState('style'); // 'style', 'content', 'ai_help'
  const [activeContentSection, setActiveContentSection] = useState('personal'); // 'personal', 'summary', 'experience', 'education', 'skills'
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showAdvancedStyles, setShowAdvancedStyles] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Pinch-to-zoom touch gesture handlers for mobile
  const touchStartDistRef = useRef(null);
  const touchStartZoomRef = useRef(100);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoomLevel;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length === 2 && touchStartDistRef.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const ratio = dist / touchStartDistRef.current;
      const newZoom = Math.round(Math.min(180, Math.max(50, touchStartZoomRef.current * ratio)));
      setZoomLevel(newZoom);
    }
  };

  const handleTouchEnd = (e) => {
    if (!e.touches || e.touches.length < 2) {
      touchStartDistRef.current = null;
    }
  };

  // Sync data whenever initialAnalysisData updates
  useEffect(() => {
    if (initialAnalysisData) {
      setData(buildCvDataFromAnalysis(initialAnalysisData));
    }
  }, [initialAnalysisData]);

  // Style customization controls
  const [styles, setStyles] = useState({
    themeColor: '#0d9488',
    textColor: '#1e293b',
    headerColor: '#0f172a',
    paperBg: '#ffffff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '11px',
    lineHeight: '1.4',
    pagePadding: '20px',
    sectionSpacing: '12px',
    dividerStyle: 'solid',
    dividerThickness: '1.5px',
    layout: 'single', // 'single', 'modern'
  });

  const { addToast } = useToast();
  const printRef = useRef(null);

  // Handlers for personal info
  const handlePersonalChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  // Handlers for experience
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Company Name',
      location: 'Location',
      period: '2023 – Present',
      bullets: ['Accomplished quantifiable impact and drove key product metrics.'],
    };
    setData((prev) => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const removeExperience = (id) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const updateExperience = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const addExpBullet = (expId) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId
          ? { ...e, bullets: [...e.bullets, 'Accomplished [X], measured by [Y], by doing [Z].'] }
          : e
      ),
    }));
  };

  const updateExpBullet = (expId, bulletIdx, value) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id === expId) {
          const newBullets = [...e.bullets];
          newBullets[bulletIdx] = value;
          return { ...e, bullets: newBullets };
        }
        return e;
      }),
    }));
  };

  const removeExpBullet = (expId, bulletIdx) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id === expId) {
          const newBullets = e.bullets.filter((_, idx) => idx !== bulletIdx);
          return { ...e, bullets: newBullets };
        }
        return e;
      }),
    }));
  };

  // Handlers for education
  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      school: 'University Name',
      location: 'City, State',
      period: '2019 – 2023',
      details: 'Relevant honors and achievements.',
    };
    setData((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const removeEducation = (id) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const updateEducation = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  // Handlers for skills
  const addSkill = (skill) => {
    if (!skill.trim() || data.skills.includes(skill.trim())) return;
    setData((prev) => ({ ...prev, skills: [...prev.skills, skill.trim()] }));
  };

  const removeSkill = (skill) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  // PDF Download using html2pdf
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    addToast('Generating publication-quality PDF...', 'info');

    const element = printRef.current;
    const opt = {
      margin: 0,
      filename: `${data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    try {
      await html2pdf().set(opt).from(element).save();
      addToast('CV PDF Downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback to browser print dialog
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Editor Top Navigation Bar */}
      <div className="bg-surface/90 backdrop-blur-xl border border-surface-border rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-subtle-card no-print">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              title="Back"
              aria-label="Back"
              className="p-2 sm:p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-surface-border text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <span>Live CV Studio</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-400">
              Customize colors, fonts, margins, content, and export a clean PDF
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-canvas-subtle rounded-xl border border-surface-border p-1 text-xs font-bold text-slate-300">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="p-1 hover:text-white rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(180, z + 10))}
              className="p-1 hover:text-white rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Full Screen View Toggle */}
          <button
            onClick={() => setIsFullScreen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-sm ${
              isFullScreen
                ? 'bg-slate-700 text-white'
                : 'text-slate-200 hover:text-white bg-surface-elevated hover:bg-surface-hover border border-surface-border'
            }`}
            title={isFullScreen ? 'Exit Full Screen' : 'View Full Screen'}
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span>Full Screen</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-surface-elevated hover:bg-surface-hover border border-surface-border rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.01] cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split Grid: Perfectly Balanced & Open Editing Workspace (or Full Screen Mode) */}
      <div className={`grid items-start gap-8 ${isFullScreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
        {/* LEFT COLUMN: Controls & Editing Sidebar (Hidden in Full Screen Mode) */}
        {!isFullScreen && (
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 no-print">
          {/* Main Mode Tabs: Styling, Content, AI Suggestions (Without Icons) */}
          <div className="flex bg-surface rounded-2xl p-1.5 border border-surface-border gap-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${
                activeTab === 'style'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Theme & Style
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Edit Content
            </button>
            <button
              onClick={() => setActiveTab('ai_help')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${
                activeTab === 'ai_help'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Inserts
            </button>
          </div>

          {/* TAB 1: THEME & STYLE CONTROLS */}
          {activeTab === 'style' && (
            <div className="bg-surface/90 border border-surface-border rounded-2xl p-5 sm:p-6 space-y-6 shadow-subtle-card">
              {/* Primary Accent Color with Interactive Hover/Drag Spectrum Palette */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  Accent Color
                </label>
                <ColorPalettePicker
                  value={styles.themeColor}
                  onChange={(newColor) => setStyles((s) => ({ ...s, themeColor: newColor }))}
                />
              </div>

              {/* Typography / Font Family */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Font Family
                  </label>
                  <span className="text-[11px] text-cyan-400 font-medium">
                    {FONT_OPTIONS.find((f) => f.value === styles.fontFamily)?.name.split(' (')[0] || 'Modern'}
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={styles.fontFamily}
                    onChange={(e) => setStyles((s) => ({ ...s, fontFamily: e.target.value }))}
                    className="w-full bg-canvas-subtle border border-surface-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm appearance-none pr-9"
                    style={{ fontFamily: styles.fontFamily }}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value} className="bg-slate-900 text-white py-2" style={{ fontFamily: f.value }}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Layout Density Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Layout Density
                  </label>
                  <span className="text-[11px] text-slate-400">1-Click Auto Format</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DENSITY_PRESETS.map((preset) => {
                    const isActive =
                      styles.fontSize === preset.values.fontSize &&
                      styles.lineHeight === preset.values.lineHeight &&
                      styles.pagePadding === preset.values.pagePadding &&
                      styles.sectionSpacing === preset.values.sectionSpacing;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setStyles((s) => ({ ...s, ...preset.values }))}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-800 text-white border-cyan-500/60 shadow-sm ring-1 ring-cyan-500/30'
                            : 'bg-canvas-subtle/50 text-slate-300 border-surface-border hover:bg-surface-elevated hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold">{preset.label}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{preset.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible Fine-Tune Controls Accordion */}
              <div className="border border-surface-border rounded-xl bg-canvas-subtle/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvancedStyles((prev) => !prev)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white hover:bg-surface-elevated transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fine-Tune Margins, Spacing & Paper</span>
                  </span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-[11px] font-normal">{showAdvancedStyles ? 'Collapse' : '6 options'}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showAdvancedStyles ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {showAdvancedStyles && (
                  <div className="p-3.5 pt-2 border-t border-surface-border/60 space-y-3.5 bg-surface/40 animate-fade-in">
                    {/* Font Size & Line Spacing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Font Size
                        </label>
                        <select
                          value={styles.fontSize}
                          onChange={(e) => setStyles((s) => ({ ...s, fontSize: e.target.value }))}
                          className="w-full bg-canvas-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="9.5px">Extra Fine (9.5px)</option>
                          <option value="10px">Compact (10px)</option>
                          <option value="11px">Balanced (11px)</option>
                          <option value="12px">Standard (12px)</option>
                          <option value="13px">Medium (13px)</option>
                          <option value="14px">Large (14px)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Line Spacing
                        </label>
                        <select
                          value={styles.lineHeight}
                          onChange={(e) => setStyles((s) => ({ ...s, lineHeight: e.target.value }))}
                          className="w-full bg-canvas-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="1.3">Tight (1.3)</option>
                          <option value="1.35">Compact (1.35)</option>
                          <option value="1.45">Standard (1.45)</option>
                          <option value="1.55">Relaxed (1.55)</option>
                          <option value="1.7">Spacious (1.7)</option>
                        </select>
                      </div>
                    </div>

                    {/* Margins, Padding & Section Spacing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Page Margin
                        </label>
                        <select
                          value={styles.pagePadding}
                          onChange={(e) => setStyles((s) => ({ ...s, pagePadding: e.target.value }))}
                          className="w-full bg-canvas-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="16px">Tight (16px)</option>
                          <option value="20px">Narrow (20px)</option>
                          <option value="24px">Normal (24px)</option>
                          <option value="32px">Standard (32px)</option>
                          <option value="44px">Wide (44px)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Section Spacing
                        </label>
                        <select
                          value={styles.sectionSpacing}
                          onChange={(e) => setStyles((s) => ({ ...s, sectionSpacing: e.target.value }))}
                          className="w-full bg-canvas-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="10px">Tight (10px)</option>
                          <option value="12px">Compact (12px)</option>
                          <option value="14px">Balanced (14px)</option>
                          <option value="20px">Standard (20px)</option>
                          <option value="28px">Roomy (28px)</option>
                        </select>
                      </div>
                    </div>

                    {/* Divider Lines & Paper Background */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Divider Lines
                        </label>
                        <select
                          value={styles.dividerStyle}
                          onChange={(e) => setStyles((s) => ({ ...s, dividerStyle: e.target.value }))}
                          className="w-full bg-canvas-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="solid">Solid Line</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                          <option value="none">None</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Paper Background
                        </label>
                        <select
                          value={styles.paperBg}
                          onChange={(e) => setStyles((s) => ({ ...s, paperBg: e.target.value }))}
                          className="w-full bg-canvas-subtle border border-surface-border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="#ffffff">Pure White</option>
                          <option value="#fafafa">Soft Off-White</option>
                          <option value="#fcfbf9">Warm Cream</option>
                          <option value="#f8fafc">Cool Slate White</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT EDITOR */}
          {activeTab === 'content' && (
            <div className="bg-surface/90 border border-surface-border rounded-2xl p-5 sm:p-6 space-y-6 shadow-subtle-card">
              {/* Content Section Tabs */}
              <div className="flex flex-wrap gap-2 pb-3 border-b border-surface-border text-xs font-bold">
                {[
                  { id: 'personal', label: 'Contact', icon: FileText },
                  { id: 'summary', label: 'Summary', icon: Type },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'skills', label: 'Skills', icon: Wrench },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveContentSection(s.id)}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      activeContentSection === s.id
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-300 hover:text-white bg-surface-elevated hover:bg-surface-hover'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Personal Info Form */}
              {activeContentSection === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={data.personal.name}
                        onChange={(e) => handlePersonalChange('name', e.target.value)}
                        className="w-full bg-canvas-subtle border border-surface-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Job Title</label>
                      <input
                        type="text"
                        value={data.personal.title}
                        onChange={(e) => handlePersonalChange('title', e.target.value)}
                        className="w-full bg-canvas-subtle border border-surface-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email</label>
                      <input
                        type="email"
                        value={data.personal.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        className="w-full bg-canvas-subtle border border-surface-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Phone</label>
                      <input
                        type="text"
                        value={data.personal.phone}
                        onChange={(e) => handlePersonalChange('phone', e.target.value)}
                        className="w-full bg-canvas-subtle border border-surface-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Location</label>
                      <input
                        type="text"
                        value={data.personal.location}
                        onChange={(e) => handlePersonalChange('location', e.target.value)}
                        className="w-full bg-canvas-subtle border border-surface-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={data.personal.linkedin}
                        onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                        className="w-full bg-canvas-subtle border border-surface-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Form */}
              {activeContentSection === 'summary' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Executive Summary</label>
                  <textarea
                    rows={6}
                    value={data.summary}
                    onChange={(e) => setData((d) => ({ ...d, summary: e.target.value }))}
                    className="w-full bg-canvas-subtle border border-surface-border rounded-2xl p-4 text-sm text-white leading-relaxed resize-y focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="Write a concise overview of your background, leadership impact, and technical accomplishments..."
                  />
                </div>
              )}

              {/* Experience Form */}
              {activeContentSection === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">Work Experience</span>
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Position</span>
                    </button>
                  </div>

                  {data.experience.map((exp) => (
                    <div key={exp.id} className="p-5 bg-canvas-subtle/80 rounded-2xl border border-surface-border space-y-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          className="font-bold text-base sm:text-lg bg-transparent border-b border-surface-border/70 pb-1 text-white flex-1 focus:outline-none focus:border-cyan-400 transition-colors"
                          placeholder="Job Title / Role (e.g. Senior Full Stack Engineer)"
                        />
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Delete Position"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Company / Organization</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full bg-surface border border-surface-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Dates & Duration</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                            className="w-full bg-surface border border-surface-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                            placeholder="e.g. March 2022 - Present"
                          />
                        </div>
                      </div>

                      {/* Bullets */}
                      <div className="space-y-3 pt-2">
                        <span className="text-xs text-slate-300 font-bold block uppercase tracking-wider">Achievement Bullets</span>
                        {exp.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <textarea
                              rows={3}
                              value={b}
                              onChange={(e) => updateExpBullet(exp.id, bIdx, e.target.value)}
                              className="w-full bg-surface border border-surface-border rounded-xl p-3 text-sm text-slate-100 resize-y leading-relaxed focus:outline-none focus:border-cyan-400 transition-colors"
                              placeholder="Action verb + quantifiable impact + tech stack used..."
                            />
                            <button
                              onClick={() => removeExpBullet(exp.id, bIdx)}
                              className="text-slate-500 hover:text-rose-400 p-2 mt-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                              title="Delete Bullet"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addExpBullet(exp.id)}
                          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Bullet Point</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Form */}
              {activeContentSection === 'education' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">Education</span>
                    <button
                      onClick={addEducation}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Degree</span>
                    </button>
                  </div>

                  {data.education.map((edu) => (
                    <div key={edu.id} className="p-5 bg-canvas-subtle/80 rounded-2xl border border-surface-border space-y-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="font-bold text-base sm:text-lg bg-transparent border-b border-surface-border/70 pb-1 text-white flex-1 focus:outline-none focus:border-cyan-400 transition-colors"
                          placeholder="Degree (e.g. B.S. in Computer Science)"
                        />
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Delete Degree"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">University / School</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            className="w-full bg-surface border border-surface-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                            placeholder="Institution Name"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Dates & Duration</label>
                          <input
                            type="text"
                            value={edu.period}
                            onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                            className="w-full bg-surface border border-surface-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                            placeholder="e.g. 2018 - 2022"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Form */}
              {activeContentSection === 'skills' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">Skills Tags</span>
                    <span className="text-xs text-slate-400">{data.skills.length} skills listed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated text-xs sm:text-sm font-medium text-slate-200 border border-surface-border shadow-sm hover:border-cyan-500/40 transition-colors"
                      >
                        <span>{s}</span>
                        <button onClick={() => removeSkill(s)} className="hover:text-rose-400 ml-1 text-base leading-none">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add skill input */}
                  <div className="flex gap-2.5 pt-2">
                    <input
                      type="text"
                      id="new-skill-input"
                      placeholder="Add a new skill (e.g. Docker, GraphQL, Kubernetes)..."
                      className="flex-1 bg-canvas-subtle border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const el = document.getElementById('new-skill-input');
                        if (el) {
                          addSkill(el.value);
                          el.value = '';
                        }
                      }}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI SUGGESTIONS INSERT HELPER */}
          {activeTab === 'ai_help' && (
            <div className="bg-surface/90 border border-cyan-500/25 rounded-2xl p-6 sm:p-8 space-y-7 shadow-subtle-card">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-surface-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="text-base sm:text-lg font-black text-white">One-Click AI Bullet & Skill Inserts</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                    Click any suggested keyword or bullet point below to instantly add it to your CV draft.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                  AI Enhanced
                </span>
              </div>

              {/* Missing Skills Quick Add */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Recommended High-Value Skills
                  </span>
                  <span className="text-[11px] text-slate-400">Click to add to Skills section</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {['Kubernetes', 'CI/CD Pipelines', 'System Design', 'Redis', 'Unit Testing', 'TypeScript', 'Docker Compose', 'Microservices Architecture'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        addSkill(s);
                        addToast(`Added ${s} to skills list`, 'success');
                      }}
                      className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-emerald-500/15 border border-surface-border hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-90 transition-transform" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optimized Achievement Rewrites */}
              <div className="pt-4 border-t border-surface-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                    High-Impact Experience Bullet Templates
                  </span>
                  <span className="text-[11px] text-slate-400">Google X-Y-Z formula</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    {
                      category: 'Performance & Scale',
                      text: 'Refactored 12 REST API endpoints, cutting query latency by 42% for 200,000 active enterprise users.',
                    },
                    {
                      category: 'DevOps & Reliability',
                      text: 'Automated CI/CD deployment pipelines using Docker and GitHub Actions, reducing release cycle times by 35%.',
                    },
                    {
                      category: 'Architecture & Cloud',
                      text: 'Spearheaded architectural migration to microservices, slashing cloud infrastructure costs by $18,000/yr.',
                    },
                    {
                      category: 'Leadership & Quality',
                      text: 'Mentored 5 junior engineers and instituted automated integration tests, elevating test coverage from 54% to 89%.',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 bg-canvas-subtle/90 hover:bg-canvas-subtle rounded-2xl border border-surface-border hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/90 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Formula Verified</span>
                      </div>
                      <p className="text-sm text-slate-100 leading-relaxed font-normal">
                        "{item.text}"
                      </p>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            if (data.experience.length > 0) {
                              addExpBullet(data.experience[0].id);
                              updateExpBullet(data.experience[0].id, data.experience[0].bullets.length, item.text);
                              addToast('Inserted bullet into first experience entry', 'success');
                            }
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Insert into Experience</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RIGHT COLUMN: Real-Time Live Preview */}
      <div className={`flex flex-col items-center ${isFullScreen ? 'w-full' : 'lg:col-span-6 xl:col-span-6 lg:sticky lg:top-24'}`}>
        {/* CV Preview Top Control Bar (Always visible in both normal & fullscreen) */}
        <div className={`w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-surface/90 backdrop-blur-md border border-surface-border rounded-xl text-xs shadow-sm no-print ${
          isFullScreen ? 'max-w-4xl' : ''
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-[11px]">Zoom:</span>
            <div className="flex items-center gap-1 bg-canvas-subtle p-0.5 rounded-lg border border-surface-border">
              {[
                { label: '75%', val: 75 },
                { label: 'Fit Width (100%)', val: 100 },
                { label: '125%', val: 125 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setZoomLevel(preset.val)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    zoomLevel === preset.val
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <span className="hidden sm:inline-block text-[10px] text-slate-400 ml-1">
              (Pinch with 2 fingers on mobile)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="p-1 text-slate-400 hover:text-white hover:bg-surface-elevated rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-semibold text-slate-300 w-9 text-center text-xs">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(180, z + 10))}
              className="p-1 text-slate-400 hover:text-white hover:bg-surface-elevated rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {isFullScreen && (
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="ml-2 flex items-center gap-1 px-2.5 py-1 bg-surface-elevated hover:bg-surface-hover border border-surface-border text-slate-200 rounded-lg text-xs cursor-pointer"
              >
                <Minimize2 className="w-3 h-3 text-cyan-400" />
                <span>Exit Fullscreen</span>
              </button>
            )}
          </div>
        </div>

        {/* Outer Container (Document Frame) with Two-Finger Touch Pinch Zoom */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`w-full overflow-auto flex justify-center bg-canvas-subtle/40 rounded-2xl border border-surface-border/50 shadow-inner p-2 sm:p-5 touch-pan-x touch-pan-y ${
            isFullScreen ? 'max-w-5xl' : ''
          }`}
          style={{ maxHeight: 'calc(100vh - 170px)' }}
        >
          <div
            className="transition-transform duration-150 ease-out origin-top flex justify-center w-full"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              width: zoomLevel > 100 ? `${zoomLevel}%` : '100%',
            }}
          >
            {/* The Resume Document - Wide to cover box, flexible height */}
            <div
              ref={printRef}
              id="cv-paper-container"
              className="w-full max-w-3xl h-auto shadow-xl rounded-xl transition-all mx-auto"
              style={{
                backgroundColor: styles.paperBg,
                color: styles.textColor,
                fontFamily: styles.fontFamily,
                fontSize: styles.fontSize,
                lineHeight: styles.lineHeight,
                padding: styles.pagePadding,
                boxSizing: 'border-box',
              }}
            >
              {/* Header / Personal Details */}
              <header className="mb-3">
                <h1
                  className="font-black tracking-tight"
                  style={{
                    color: styles.headerColor,
                    fontSize: '16px',
                    lineHeight: '1.2',
                    marginBottom: '2px',
                  }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handlePersonalChange('name', e.target.innerText)}
                >
                  {data.personal.name}
                </h1>

                <p
                  className="font-bold tracking-wide"
                  style={{
                    color: styles.themeColor,
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handlePersonalChange('title', e.target.innerText)}
                >
                  {data.personal.title}
                </p>

                {/* Contact Links */}
                <div
                  className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[9.5px]"
                  style={{ opacity: 0.85 }}
                >
                  {data.personal.email && <span>{data.personal.email}</span>}
                  {data.personal.phone && <span>• {data.personal.phone}</span>}
                  {data.personal.location && <span>• {data.personal.location}</span>}
                  {data.personal.linkedin && <span>• {data.personal.linkedin}</span>}
                  {data.personal.github && <span>• {data.personal.github}</span>}
                </div>
              </header>

              {/* Divider Line */}
              {styles.dividerStyle !== 'none' && (
                <div
                  style={{
                    borderBottomWidth: styles.dividerThickness,
                    borderBottomStyle: styles.dividerStyle,
                    borderBottomColor: styles.themeColor,
                    opacity: 0.4,
                    marginBottom: styles.sectionSpacing,
                  }}
                />
              )}

              {/* Executive Summary */}
              {data.summary && (
                <section style={{ marginBottom: styles.sectionSpacing }}>
                  <h2
                    className="font-bold uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-2"
                    style={{ color: styles.themeColor }}
                  >
                    <span>Summary</span>
                  </h2>
                  <p
                    style={{
                      fontSize: styles.fontSize,
                      lineHeight: styles.lineHeight,
                    }}
                    className="leading-relaxed"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setData((d) => ({ ...d, summary: e.target.innerText }))}
                  >
                    {data.summary}
                  </p>
                </section>
              )}

              {/* Divider Line */}
              {styles.dividerStyle !== 'none' && (
                <div
                  style={{
                    borderBottomWidth: styles.dividerThickness,
                    borderBottomStyle: styles.dividerStyle,
                    borderBottomColor: styles.themeColor,
                    opacity: 0.3,
                    marginBottom: styles.sectionSpacing,
                  }}
                />
              )}

              {/* Work Experience */}
              <section style={{ marginBottom: styles.sectionSpacing }}>
                <h2
                  className="font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-2"
                  style={{ color: styles.themeColor }}
                >
                  <span>Experience</span>
                </h2>

                <div className="space-y-3">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-baseline justify-between mb-0.5">
                        <span
                          className="font-bold"
                          style={{
                            color: styles.headerColor,
                            fontSize: `calc(${styles.fontSize} + 1px)`,
                          }}
                        >
                          {exp.role}
                        </span>
                        <span
                          className="font-semibold"
                          style={{
                            opacity: 0.75,
                            fontSize: `calc(${styles.fontSize} - 1.5px)`,
                          }}
                        >
                          {exp.period}
                        </span>
                      </div>

                      <div
                        className="flex items-center justify-between mb-1.5 font-semibold"
                        style={{
                          color: styles.themeColor,
                          fontSize: `calc(${styles.fontSize} - 0.5px)`,
                        }}
                      >
                        <span>{exp.company}</span>
                        <span style={{ opacity: 0.8 }}>{exp.location}</span>
                      </div>

                      <ul
                        className="list-disc pl-3.5 space-y-1"
                        style={{
                          fontSize: styles.fontSize,
                          lineHeight: styles.lineHeight,
                        }}
                      >
                        {exp.bullets.map((b, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Divider Line */}
              {styles.dividerStyle !== 'none' && (
                <div
                  style={{
                    borderBottomWidth: styles.dividerThickness,
                    borderBottomStyle: styles.dividerStyle,
                    borderBottomColor: styles.themeColor,
                    opacity: 0.3,
                    marginBottom: styles.sectionSpacing,
                  }}
                />
              )}

              {/* Skills Section */}
              <section style={{ marginBottom: styles.sectionSpacing }}>
                <h2
                  className="font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-2"
                  style={{ color: styles.themeColor }}
                >
                  <span>Skills & Core Competencies</span>
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded font-semibold transition-colors"
                      style={{
                        backgroundColor: `${styles.themeColor}15`,
                        color: styles.themeColor,
                        border: `1px solid ${styles.themeColor}35`,
                        fontSize: `calc(${styles.fontSize} - 1px)`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              {/* Divider Line */}
              {styles.dividerStyle !== 'none' && (
                <div
                  style={{
                    borderBottomWidth: styles.dividerThickness,
                    borderBottomStyle: styles.dividerStyle,
                    borderBottomColor: styles.themeColor,
                    opacity: 0.3,
                    marginBottom: styles.sectionSpacing,
                  }}
                />
              )}

              {/* Education Section */}
              <section>
                <h2
                  className="font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-2"
                  style={{ color: styles.themeColor }}
                >
                  <span>Education</span>
                </h2>
                <div className="space-y-2.5">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex items-baseline justify-between">
                        <span
                          className="font-bold"
                          style={{
                            color: styles.headerColor,
                            fontSize: `calc(${styles.fontSize} + 1px)`,
                          }}
                        >
                          {edu.degree}
                        </span>
                        <span
                          className="font-medium"
                          style={{
                            opacity: 0.75,
                            fontSize: `calc(${styles.fontSize} - 1.5px)`,
                          }}
                        >
                          {edu.period}
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-between"
                        style={{
                          opacity: 0.85,
                          fontSize: `calc(${styles.fontSize} - 0.5px)`,
                          lineHeight: styles.lineHeight,
                        }}
                      >
                        <span style={{ color: styles.themeColor, fontWeight: 600 }}>{edu.school}</span>
                        <span>{edu.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default CvEditor;
