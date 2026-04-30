const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  subject:    { type: String, required: true }, // "DSA", "OS", "DBMS"
  semester:   { type: Number, required: true },
  branch:     [{ type: String }],               // ["CSE","IT"] or ["ALL"]
  youtubeId:  { type: String },                 // YouTube video ID
  notes:      { type: String },                 // short text notes
  duration:   { type: String },                 // "18 mins"
  xpReward:   { type: Number, default: 10 },

  // Which companies need this topic
  relevantFor: [{ type: String }]               // ["TCS","Amazon","Google"]
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);