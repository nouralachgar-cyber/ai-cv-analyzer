const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { extractTextFromFile } = require('../services/documentService');
const { analyzeResume } = require('../services/aiService');

// @desc    رفع وتحليل سيرة ذاتية جديدة
// @route   POST /api/resumes/upload
exports.uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'المرجو إرفاق ملف السيرة الذاتية' });
    }

    // 1. استخراج النص
    const extractedText = await extractTextFromFile(req.file.path, req.file.mimetype);

    // 2. حفظ الـ Resume في قاعدة البيانات
    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl: req.file.path,
      extractedText,
      status: 'processing',
    });

    // 3. تحليل النص عبر الذكاء الاصطناعي
    const aiResults = await analyzeResume(extractedText);

    // 4. حفظ نتائج التحليل في قاعدة البيانات
    const analysis = await Analysis.create({
      resume: resume._id,
      user: req.user._id,
      score: aiResults.score || 70,
      profile: aiResults.profile,
      skills: aiResults.skills,
      experience: aiResults.experience,
      education: aiResults.education,
      certifications: aiResults.certifications,
      languages: aiResults.languages,
      projects: aiResults.projects,
      strengths: aiResults.strengths,
      weaknesses: aiResults.weaknesses,
      recommendations: aiResults.recommendations,
    });

    // تحديث حالة الـ Resume
    resume.status = 'analyzed';
    await resume.save();

    res.status(201).json({
      message: 'تم تحليل السيرة الذاتية بنجاح',
      resume,
      analysis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    جلب جميع السير الذاتية للمستخدم
// @route   GET /api/resumes
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};