const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch:   { type: String, enum: ['CSE','IT','ECE','ME'] },
  college:  { type: String },
  semester: { type: Number, default: 1 },
  // Add inside userSchema, after the xp field:
  streak:        { type: Number, default: 0 },
  lastLoginDate: { type: String, default: '' },
  xp:     { type: Number, default: 0 },
  badges: [{ type: String }],

  completedLessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson' 
  }],

  // Placement readiness per company
  placementReadiness: {
    TCS:       { type: Number, default: 0 },
    Infosys:   { type: Number, default: 0 },
    Amazon:    { type: Number, default: 0 },
    Google:    { type: Number, default: 0 },
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);