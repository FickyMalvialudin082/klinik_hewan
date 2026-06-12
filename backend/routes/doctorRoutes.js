const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [doctors] = await db.execute('SELECT * FROM doctors ORDER BY created_at DESC');
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching doctors' });
  }
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const [doctors] = await db.execute('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctors[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  const { name, specialization, experience, schedule, image_url, status } = req.body;

  if (!name || !specialization || !experience || !schedule) {
    return res.status(400).json({ message: 'Name, specialization, experience, and schedule are required' });
  }

  try {
    const docStatus = status || 'available';
    const [result] = await db.execute(
      'INSERT INTO doctors (name, specialization, experience, schedule, image_url, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, specialization, experience, schedule, image_url || '', docStatus]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      specialization,
      experience,
      schedule,
      image_url,
      status: docStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating doctor' });
  }
});

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  const { name, specialization, experience, schedule, image_url, status } = req.body;

  if (!name || !specialization || !experience || !schedule) {
    return res.status(400).json({ message: 'Name, specialization, experience, and schedule are required' });
  }

  try {
    const [doctors] = await db.execute('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await db.execute(
      'UPDATE doctors SET name = ?, specialization = ?, experience = ?, schedule = ?, image_url = ?, status = ? WHERE id = ?',
      [name, specialization, experience, schedule, image_url || '', status || 'available', req.params.id]
    );

    res.json({
      id: req.params.id,
      name,
      specialization,
      experience,
      schedule,
      image_url,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating doctor' });
  }
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const [doctors] = await db.execute('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await db.execute('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting doctor' });
  }
});

module.exports = router;
