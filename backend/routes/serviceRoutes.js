const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [services] = await db.execute('SELECT * FROM services ORDER BY created_at DESC');
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching services' });
  }
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public (or Admin)
router.get('/:id', async (req, res) => {
  try {
    const [services] = await db.execute('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (services.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(services[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  const { name, description, price, icon, status } = req.body;

  if (!name || !price || !icon) {
    return res.status(400).json({ message: 'Name, price, and icon are required' });
  }

  try {
    const serviceStatus = status || 'active';
    const [result] = await db.execute(
      'INSERT INTO services (name, description, price, icon, status) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', price, icon, serviceStatus]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      icon,
      status: serviceStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating service' });
  }
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  const { name, description, price, icon, status } = req.body;

  if (!name || !price || !icon) {
    return res.status(400).json({ message: 'Name, price, and icon are required' });
  }

  try {
    const [services] = await db.execute('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (services.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await db.execute(
      'UPDATE services SET name = ?, description = ?, price = ?, icon = ?, status = ? WHERE id = ?',
      [name, description || '', price, icon, status || 'active', req.params.id]
    );

    res.json({
      id: req.params.id,
      name,
      description,
      price,
      icon,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating service' });
  }
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const [services] = await db.execute('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (services.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await db.execute('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting service' });
  }
});

module.exports = router;
