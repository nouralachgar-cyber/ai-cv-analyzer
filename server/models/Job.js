const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: String,
    location: String,
    description: {
      type: String,
      required: true,
    },
    source: String,
    url: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);