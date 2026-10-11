const { analyzeCVWithGemini } = require('./services/geminiService');
require('dotenv').config();

const sampleCV = `Ashwani Kumar
ashwani.kumar.scaler@gmail.com | +91 9876543210 | Bengaluru, India
LinkedIn: linkedin.com/in/ashwanikumar | GitHub: github.com/ashwani-dev

SUMMARY
Dedicated Software Engineer with 3 years experience building full-stack web applications using React, Node.js, Express, and MongoDB.

WORK EXPERIENCE
Software Developer | Scaler Academy | Bengaluru
July 2022 - Present
- Designed microservices architecture reducing API response latency by 35%.
- Built automated student code grading platform handling 50k submissions daily.
- Spearheaded migration to Docker and AWS ECS with zero downtime.

Junior Developer | TechCorp India | New Delhi
Aug 2021 - June 2022
- Developed responsive frontends with React and Tailwind CSS.
- Optimized database indexing in MongoDB and PostgreSQL.

EDUCATION
B.Tech in Computer Science and Engineering | Scaler School of Technology
2018 - 2022 | CGPA: 8.8/10

TECHNICAL SKILLS
JavaScript, TypeScript, React, Node.js, Express.js, MongoDB, Docker, AWS, Git`;

analyzeCVWithGemini(sampleCV, 'Software Engineer', '')
  .then(res => {
    console.log('AI Model Used:', res.aiModelUsed);
    console.log('parsedResume:', JSON.stringify(res.parsedResume, null, 2));
  })
  .catch(err => console.error('Error:', err));
