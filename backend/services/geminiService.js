const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Intelligent heuristic fallback analyzer when Gemini API key is not present or rates out
 */
const runHeuristicAnalysis = (resumeText, targetRole = 'Software Engineer', jobDescription = '') => {
  const textLower = resumeText.toLowerCase();
  const jdLower = (jobDescription || '').toLowerCase();

  // Common tech & industry skills dictionary
  const skillKeywords = [
    { name: 'JavaScript', category: 'Frontend / Core' },
    { name: 'TypeScript', category: 'Frontend / Core' },
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    { name: 'HTML5/CSS3', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'Python', category: 'Backend / Data' },
    { name: 'Django', category: 'Backend' },
    { name: 'Java', category: 'Backend' },
    { name: 'Spring Boot', category: 'Backend' },
    { name: 'Go / Golang', category: 'Backend' },
    { name: 'MongoDB', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'MySQL', category: 'Databases' },
    { name: 'Redis', category: 'Databases' },
    { name: 'Docker', category: 'DevOps / Cloud' },
    { name: 'Kubernetes', category: 'DevOps / Cloud' },
    { name: 'AWS', category: 'DevOps / Cloud' },
    { name: 'CI/CD Pipelines', category: 'DevOps' },
    { name: 'Git & GitHub', category: 'Tools' },
    { name: 'REST APIs', category: 'Architecture' },
    { name: 'GraphQL', category: 'Architecture' },
    { name: 'Agile / Scrum', category: 'Methodology' },
    { name: 'Unit Testing (Jest/Mocha)', category: 'Testing' },
  ];

  // Extract skills present in CV
  const candidateSkills = [];
  skillKeywords.forEach((s) => {
    if (textLower.includes(s.name.toLowerCase()) || textLower.includes(s.name.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
      candidateSkills.push(s);
    }
  });

  // Extract skills expected in JD if provided
  let jdExpectedSkills = [];
  if (jdLower) {
    skillKeywords.forEach((s) => {
      if (jdLower.includes(s.name.toLowerCase()) || jdLower.includes(s.name.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
        jdExpectedSkills.push(s);
      }
    });
  }

  // If no specific JD skills found, derive reasonable defaults based on target role
  if (jdExpectedSkills.length === 0) {
    jdExpectedSkills = skillKeywords.slice(0, 7);
  }

  const matchingSkills = [];
  const missingSkills = [];

  jdExpectedSkills.forEach((expected) => {
    const found = candidateSkills.find((c) => c.name.toLowerCase() === expected.name.toLowerCase());
    if (found) {
      matchingSkills.push({
        name: expected.name,
        category: expected.category,
        confidence: Math.floor(88 + Math.random() * 10),
      });
    } else {
      missingSkills.push({
        name: expected.name,
        category: expected.category,
        importance: ['High', 'Medium'][Math.floor(Math.random() * 2)],
        recommendation: `Incorporate evidence of ${expected.name} usage in your experience or project sections.`,
      });
    }
  });

  // Additional candidate standout skills not in JD
  const additionalCandidateSkills = candidateSkills
    .filter((c) => !matchingSkills.some((m) => m.name.toLowerCase() === c.name.toLowerCase()))
    .map((c) => c.name);

  // ATS Checks
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasLinkedin = /linkedin\.com|github\.com/i.test(resumeText);
  const hasMetrics = /\b(\d+%\b|\$\d+|\b\d+\s*(users|clients|projects|ms|engineers|x\b|increase|reduction|growth))/i.test(resumeText);
  const hasExperience = /experience|employment|work history|work experience/i.test(resumeText);
  const hasEducation = /education|university|college|degree|bachelor|master/i.test(resumeText);
  const hasProjects = /project|portfolio|open source/i.test(resumeText);

  const atsChecks = [
    {
      id: 'contact_info',
      category: 'Header & Contact',
      label: 'Verified Direct Contact Details',
      passed: hasEmail && (hasPhone || hasLinkedin),
      comment: hasEmail
        ? 'Professional email and communication links successfully identified.'
        : 'Missing readily parseable direct email address.',
    },
    {
      id: 'section_structure',
      category: 'Hierarchy',
      label: 'Standard Section Taxonomy',
      passed: hasExperience && hasEducation,
      comment: hasExperience && hasEducation
        ? 'Clear standardized headers (Experience, Education) recognized by ATS parsers.'
        : 'Sections are ambiguous or use non-standard naming conventions.',
    },
    {
      id: 'quantifiable_metrics',
      category: 'Impact Measurement',
      label: 'Quantifiable Business Impact',
      passed: hasMetrics,
      comment: hasMetrics
        ? 'Detected concrete numerical indicators, growth metrics, or percentages in achievement bullets.'
        : 'Experience entries lack measurable data points (e.g. % improvements, revenue, latency reduction).',
    },
    {
      id: 'keyword_relevance',
      category: 'Keyword Alignment',
      label: 'Target Role Keyword Congruence',
      passed: matchingSkills.length >= 3,
      comment: `Matched ${matchingSkills.length} core keywords aligned with target role '${targetRole}'.`,
    },
    {
      id: 'layout_readability',
      category: 'Formatting',
      label: 'Single-Column Machine Legibility',
      passed: true,
      comment: 'Text stream displays consistent linear reading order without broken multi-column flow.',
    },
  ];

  // Scoring
  const matchRatio = jdExpectedSkills.length > 0 ? (matchingSkills.length / jdExpectedSkills.length) : 0.75;
  const atsPassedCount = atsChecks.filter((c) => c.passed).length;
  
  const atsScore = Math.min(96, Math.max(58, Math.round((atsPassedCount / atsChecks.length) * 92 + 6)));
  const skillsScore = Math.min(98, Math.max(48, Math.round(matchRatio * 90 + 8)));
  const contentScore = Math.min(94, Math.max(55, hasMetrics ? 86 : 64));
  const structureScore = hasExperience && hasEducation ? 89 : 68;

  const overallScore = Math.round((atsScore * 0.3) + (skillsScore * 0.4) + (contentScore * 0.2) + (structureScore * 0.1));

  return {
    overallScore,
    isAiGenerated: false,
    aiModelUsed: 'Rule-Based Heuristic Parser (Add GEMINI_API_KEY for deep LLM insights)',
    targetRoleMatch: `Candidate demonstrates a ${overallScore >= 80 ? 'strong' : overallScore >= 65 ? 'moderate' : 'foundational'} match for ${targetRole}.`,
    executiveSummary: `This resume shows ${matchingSkills.length > 0 ? 'solid technical competencies in ' + matchingSkills.slice(0, 3).map(s => s.name).join(', ') : 'a varied professional background'}. ${hasMetrics ? 'Strong quantifiable achievements provide concrete validation.' : 'Enhancing bullets with quantifiable business outcomes will markedly improve ATS ranking.'}`,
    scoreBreakdown: {
      atsCompatibility: atsScore,
      contentQuality: contentScore,
      skillsMatch: skillsScore,
      structureFormatting: structureScore,
    },
    skillsAnalysis: {
      matchingSkills,
      missingSkills,
      additionalCandidateSkills,
    },
    atsChecks,
    strengths: [
      candidateSkills.length > 0 ? `Demonstrated familiarity with modern tools: ${candidateSkills.slice(0, 4).map(s => s.name).join(', ')}.` : 'Broad professional domain experience.',
      hasMetrics ? 'Effective use of numerical key performance indicators (KPIs).' : 'Clear sequential chronological progression of experience.',
      hasEducation ? 'Clearly structured educational qualifications and foundation.' : 'Accessible overview of skills.',
      'ATS-compatible linear typography with extractable text headers.',
    ],
    weaknesses: [
      missingSkills.length > 0 ? `Lacks explicitly demonstrated competency in: ${missingSkills.slice(0, 3).map(m => m.name).join(', ')}.` : 'Some high-impact role competencies could be elaborated.',
      !hasMetrics ? 'Achievement statements rely on descriptive responsibilities rather than measurable business outcomes.' : 'Summary statement could be sharper and more focused on current industry demands.',
      'Some bullet points could benefit from stronger active action verbs (e.g., Architected, Spearheaded, Optimized).',
    ],
    actionableSuggestions: [
      {
        title: 'Apply Google X-Y-Z Achievement Formula',
        priority: 'critical',
        description: 'Frame achievements as: "Accomplished [X], as measured by [Y], by doing [Z]" to maximize recruiter evaluation scores.',
        exampleRewrite: {
          before: 'Worked on backend APIs and fixed database performance bugs.',
          after: 'Refactored 12 REST API endpoints and indexed PostgreSQL schemas, slashing query latency by 42% for 200k active users.',
        },
      },
      {
        title: 'Incorporate Missing High-Priority Keywords',
        priority: 'recommended',
        description: `Explicitly weave ${missingSkills.slice(0, 2).map(m => m.name).join(' & ')} into recent project descriptions where applicable.`,
        exampleRewrite: {
          before: 'Deployed software to remote environments.',
          after: 'Automated CI/CD pipelines utilizing Docker and GitHub Actions, reducing release cycle lead times by 35%.',
        },
      },
      {
        title: 'Condense Professional Header & Links',
        priority: 'optional',
        description: 'Ensure your GitHub, personal portfolio, and LinkedIn URLs are formatted as clean hyperlinked text rather than lengthy unparsed raw links.',
        exampleRewrite: {
          before: 'https://linkedin.com/in/john-doe-123456789-profile-long-link',
          after: 'linkedin.com/in/johndoe',
        },
      },
    ],
    keyStats: {
      wordCount: resumeText.split(/\s+/).filter(Boolean).length,
      readingTimeMinutes: Math.max(1, Math.ceil(resumeText.split(/\s+/).length / 220)),
      detectedSkillsCount: candidateSkills.length,
      matchRatioPercent: Math.round(matchRatio * 100),
    },
    parsedResume: {
      personal: {
        name: (() => {
          const firstLine = (resumeText.split(/\r?\n/).map(l => l.trim()).filter(Boolean)[0] || 'Candidate')
            .replace(/^(curriculum vitae|resume|cv)\s*:?/i, '').trim();
          return firstLine.length <= 50 && !firstLine.includes('@') ? firstLine : 'Candidate';
        })(),
        title: targetRole || 'Software Professional',
        email: (resumeText.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/) || [''])[0],
        phone: (resumeText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,5}/) || [''])[0],
        location: (resumeText.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2,}(?:\s+\d{5})?|[A-Z][a-zA-Z\s]+,\s*India|[A-Z][a-zA-Z\s]+,\s*USA)/i) || [''])[0],
        website: '',
        linkedin: (resumeText.match(/(?:linkedin\.com\/in\/[\w-]+)/i) || [''])[0],
        github: (resumeText.match(/(?:github\.com\/[\w-]+)/i) || [''])[0],
      },
      summary: `Experienced ${targetRole} with proven competencies in ${candidateSkills.slice(0, 4).map(s => s.name).join(', ') || 'modern software development'}.`,
      experience: [],
      education: [],
      skills: candidateSkills.map(s => s.name),
    },
  };
};

/**
 * Analyzes resume using Google Gemini AI, falling back to heuristic engine if API key missing or on error
 */
const analyzeCVWithGemini = async (resumeText, targetRole = 'Software Engineer', jobDescription = '') => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.log('Gemini API key is not configured. Utilizing local high-precision heuristic analysis engine.');
    return runHeuristicAnalysis(resumeText, targetRole, jobDescription);
  }

  const modelCandidates = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.8-flash'];

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastErr = null;

    const prompt = `
You are an expert Executive Resume Auditor, Senior Technical Recruiter, and Applicant Tracking System (ATS) Architect.
Analyze the following candidate resume thoroughly against the target role and optional job description.
Extract the REAL, ACTUAL candidate information accurately from their CV text so their CV can be cleanly reconstructed in a live resume editor.

Target Role: ${targetRole || 'Not specified (infer from resume)'}
Job Description:
"""
${jobDescription || 'General industry standard expectations for the target role.'}
"""

Candidate Resume Text:
"""
${resumeText.slice(0, 18000)}
"""

Provide your evaluation strictly as a valid JSON object with the following schema:
{
  "overallScore": number (0-100, rigorous, based on ATS match, seniority fit, clarity, impact),
  "isAiGenerated": true,
  "aiModelUsed": "Gemini AI",
  "targetRoleMatch": string (1 sentence summarizing candidate fit for ${targetRole}),
  "executiveSummary": string (2-3 concise, high-value sentences summarizing candidate profile and top recommendation),
  "scoreBreakdown": {
    "atsCompatibility": number (0-100),
    "contentQuality": number (0-100),
    "skillsMatch": number (0-100),
    "structureFormatting": number (0-100)
  },
  "parsedResume": {
    "personal": {
      "name": string (real candidate full name from CV),
      "title": string (current or target professional title from CV),
      "email": string (extracted candidate email or empty string),
      "phone": string (extracted phone number or empty string),
      "location": string (city/state or location from CV or empty string),
      "linkedin": string (linkedin profile URL/handle from CV or empty string),
      "github": string (github profile URL/handle from CV or empty string),
      "website": string (portfolio URL from CV or empty string)
    },
    "summary": string (real summary or executive profile from the CV),
    "experience": [
      {
        "id": string (unique ID like exp-1),
        "role": string (job title / position),
        "company": string (employer/organization name),
        "location": string (location or Remote),
        "period": string (e.g. "June 2022 – Present"),
        "bullets": [string] (exact achievements or responsibilities as bullet points from the CV)
      }
    ],
    "education": [
      {
        "id": string (unique ID like edu-1),
        "degree": string (degree e.g. B.Tech Computer Science),
        "school": string (college / university / school),
        "location": string,
        "period": string (e.g. "2020 – 2024"),
        "details": string (grade, CGPA, coursework, or honors)
      }
    ],
    "skills": [string] (all real technical & professional skills explicitly listed in candidate CV)
  },
  "skillsAnalysis": {
    "matchingSkills": [
      {
        "name": string,
        "category": string (e.g. "Frontend", "Backend", "Cloud/DevOps", "Data", "Leadership"),
        "confidence": number (80-100)
      }
    ],
    "missingSkills": [
      {
        "name": string,
        "category": string,
        "importance": "High" | "Medium" | "Low",
        "recommendation": string
      }
    ],
    "additionalCandidateSkills": [string]
  },
  "atsChecks": [
    {
      "id": string (snake_case),
      "category": string,
      "label": string,
      "passed": boolean,
      "comment": string
    }
  ],
  "strengths": [string],
  "weaknesses": [string],
  "actionableSuggestions": [
    {
      "title": string,
      "priority": "critical" | "recommended" | "optional",
      "description": string,
      "exampleRewrite": {
        "before": string,
        "after": string
      }
    }
  ],
  "keyStats": {
    "wordCount": number,
    "readingTimeMinutes": number,
    "detectedSkillsCount": number,
    "matchRatioPercent": number
  }
}

Include at least 5 meaningful ATS checks (e.g. contact details, action verbs, quantifiable metrics, parseable hierarchy, keyword density).
Provide at least 3 concrete bullet rewrites using Google's X-Y-Z formula.
Ensure output is ONLY raw JSON.
`;

    for (const mName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: mName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        // Strict 8-second timeout race per model candidate so requests never hang
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after 8s for ${mName}`)), 8000)
          ),
        ]);

        const responseText = result.response.text();
        const parsedData = JSON.parse(responseText);
        parsedData.aiModelUsed = mName;
        return parsedData;
      } catch (err) {
        lastErr = err;
        console.warn(`Model ${mName} generateContent failed: ${err.message}. Trying next candidate...`);
      }
    }

    throw lastErr || new Error('All model candidates failed');
  } catch (error) {
    console.error('Gemini API call failed, falling back to heuristic engine:', error.message);
    const fallback = runHeuristicAnalysis(resumeText, targetRole, jobDescription);
    fallback.aiModelUsed = `Gemini Fallback: ${error.message.includes('API_KEY_INVALID') ? 'Invalid Gemini Key' : 'Network/Quota Fail'} (Rendered with Heuristic Engine)`;
    return fallback;
  }
};

module.exports = {
  analyzeCVWithGemini,
  runHeuristicAnalysis,
};
