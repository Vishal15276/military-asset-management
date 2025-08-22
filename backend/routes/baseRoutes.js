import express from 'express';
import Base from '../models/Base.js';

const router = express.Router();

// @desc Create new base
router.post('/', async (req, res) => {
  try {
    const { name, location, capacity } = req.body;
    if (!name || !location || !capacity) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const base = await Base.create({ name, location, capacity });
    res.json({ success: true, base });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc Get all bases
router.get('/', async (req, res) => {
  try {
    const bases = await Base.find();
    res.json({ success: true, bases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
