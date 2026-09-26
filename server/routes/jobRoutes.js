const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createJob,
  getJobs,
  matchJobWithResume,
} = require('../controllers/jobController');

router.post('/', protect, createJob);
router.get('/', protect, getJobs);
router.post('/:jobId/match/:resumeId', protect, matchJobWithResume);

module.exports = router;