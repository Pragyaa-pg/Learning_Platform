const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  subject:     { type: String, required: true },  // "DSA", "OS", "DBMS"
  semester:    { type: Number, required: true },
  branch:      [{ type: String }],                // ["CSE","IT"] or ["ALL"]
  thumbnail:   { type: String },                  // image URL
  pointsReward:{ type: Number, default: 100 },    // XP on full course completion

  // Which companies this course helps with
  relevantFor: [{ type: String }],                // ["TCS","Amazon","Google"]

  lessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson' 
  }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);