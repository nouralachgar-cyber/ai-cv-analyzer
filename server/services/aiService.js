const axios = require('axios');

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

// 1. تحليل السيرة الذاتية واستخراج البيانات وصياغة النتيجة كـ JSON محدد
const analyzeResume = async (resumeText) => {
  try {
    const prompt = `
You are an expert resume analysis assistant.
Analyze the following resume and extract structured information.
Return ONLY a valid JSON object matching this exact schema:

{
  "profile": {
    "fullName": "String",
    "email": "String",
    "phone": "String",
    "location": "String",
    "summary": "String"
  },
  "skills": [
    { "name": "String", "category": "String", "level": "String" }
  ],
  "experience": [],
  "education": [],
  "certifications": [],
  "languages": [],
  "projects": [],
  "score": 80,
  "strengths": ["String"],
  "weaknesses": ["String"],
  "recommendations": ["String"]
}

Resume Text:
${resumeText}
`;

    const response = await axios.post(
      XAI_API_URL,
      {
        model: process.env.XAI_MODEL || 'grok-4.7',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    // تنظيف النتيجة لضمان استخراج JSON فقط
    const cleanJson = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('AI Analysis Error:', error.response?.data || error.message);
    throw new Error('فشل في تحليل السيرة الذاتية بواسطة الذكاء الاصطناعي');
  }
};

// 2. مطابقة السيرة الذاتية مع الوظيفة
const matchResumeWithJob = async (resumeText, jobDescription) => {
  try {
    const prompt = `
You are an AI career matching assistant.
Compare the candidate resume against the job description and generate compatibility analysis.
Return ONLY a valid JSON object matching this schema:

{
  "overallScore": 85,
  "matchingSkills": ["Skill1", "Skill2"],
  "missingSkills": ["Skill3"],
  "matchingExperience": "Summary of experience match",
  "educationCompatibility": "Compatible / Highly Compatible / Incompatible",
  "recommendations": "Detailed recommendation"
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await axios.post(
      XAI_API_URL,
      {
        model: process.env.XAI_MODEL || 'grok-4.7',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const cleanJson = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Job Matching Error:', error.response?.data || error.message);
    throw new Error('فشل في مطابقة السيرة الذاتية مع الوظيفة');
  }
};

module.exports = {
  analyzeResume,
  matchResumeWithJob,
};