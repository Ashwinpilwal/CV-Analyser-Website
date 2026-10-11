const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Allows anonymous guest audits as well as linked user audits
      index: true,
    },
    resumeName: {
      type: String,
      required: true,
      default: 'Resume.pdf',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    targetRole: {
      type: String,
      default: 'General Professional',
    },
    jobDescription: {
      type: String,
      default: '',
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    analysisData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);
