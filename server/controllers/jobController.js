const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { matchResumeWithJob } = require('../services/aiService');

// @desc    إضافة وظيفة جديدة (يدوياً)
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, source, url } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'المرجو إدخال عنوان وتفاصيل الوظيفة' });
    }

    const job = await Job.create({
      user: req.user._id,
      title,
      company,
      location,
      description,
      source: source || 'Manual Entry',
      url,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    جلب جميع الوظائف الخاصة بالمستخدم
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    مطابقة الـ CV مع الوظيفة بالذكاء الاصطناعي
// @route   POST /api/jobs/:jobId/match/:resumeId
exports.matchJobWithResume = async (req, res) => {
  try {
    const { jobId, resumeId } = req.params;

    const job = await Job.findById(jobId);
    const resume = await Resume.findById(resumeId);

    if (!job || !resume) {
      return res.status(404).json({ message: 'لم يتم العثور على السيرة الذاتية أو الوظيفة' });
    }

    // استدعاء خدمة الذكاء الاصطناعي للمطابقة
    const matchResults = await matchResumeWithJob(resume.extractedText, job.description);

    res.json({
      job,
      resume,
      matchResults,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};