const router  = require('express').Router();
const protect = require('../middleware/protect');
const Lesson  = require('../models/Lesson');

// Get lessons by semester + branch
router.get('/', protect, async (req, res) => {
  try {
    const { semester, branch } = req.query;
    const lessons = await Lesson.find({
      semester: Number(semester),
      branch: { $in: [branch, 'ALL'] }
    });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;