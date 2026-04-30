const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, branch, college } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, branch, college });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, branch: user.branch, xp: 0, badges: [] }
    });
  } catch (e) {
    console.error('Register error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    // Streak logic
    const today = new Date().toISOString().split('T')[0]; // "2026-04-20"
    const last  = user.lastLoginDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let streak = user.streak;
    if (last === today) {
      // already logged in today, keep streak
    } else if (last === yesterday) {
      streak += 1; // consecutive day
    } else {
      streak = 1;  // streak broken
    }

    await User.findByIdAndUpdate(user._id, { streak, lastLoginDate: today });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        branch: user.branch, college: user.college,
        xp: user.xp, badges: user.badges,
        streak, lastLoginDate: today
      }
    });
  } catch (e) {
    console.error('Login error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;