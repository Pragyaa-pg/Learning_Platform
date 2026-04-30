const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// Add XP after quiz
router.post('/xp', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { xp: req.body.xp } },
      { new: true }
    );
    res.json({ xp: user.xp, badges: user.badges });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find().sort({ xp: -1 }).limit(10).select('name xp badges branch');
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get my profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, college, branch, semester } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, college, branch, semester },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;