const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    profile: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      summary: String,
    },
    skills: [
      {
        name: String,
        category: String,
        level: String,
      },
    ],
    experience: [mongoose.Schema.Types.Mixed],
    education: [mongoose.Schema.Types.Mixed],
    certifications: [mongoose.Schema.Types.Mixed],
    languages: [mongoose.Schema.Types.Mixed],
    projects: [mongoose.Schema.Types.Mixed],
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);