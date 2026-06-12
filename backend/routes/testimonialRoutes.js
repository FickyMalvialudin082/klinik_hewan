const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get testimonials (Public gets visible, Admin can get all)
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.adminView === 'true';
    let query = 'SELECT * FROM testimonials WHERE is_visible = TRUE ORDER BY created_at DESC';
    
    if (showAll) {
      query = 'SELECT * FROM testimonials ORDER BY created_at DESC';
    }

    const [testimonials] = await db.execute(query);
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching testimonials' });
  }
});

// @desc    Submit testimonial (Public)
// @route   POST /api/testimonials
// @access  Public
router.post('/', async (req, res) => {
  const { customer_name, pet_name, comment, rating } = req.body;

  if (!customer_name || !pet_name || !comment || rating === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO testimonials (customer_name, pet_name, comment, rating, is_visible) VALUES (?, ?, ?, ?, TRUE)',
      [customer_name, pet_name, comment, rating]
    );

    res.status(201).json({
      id: result.insertId,
      customer_name,
      pet_name,
      comment,
      rating,
      is_visible: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting testimonial' });
  }
});

// @desc    Update testimonial visibility / details (Admin)
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  const { customer_name, pet_name, comment, rating, is_visible } = req.body;

  try {
    const [testimonials] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if (testimonials.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const t = testimonials[0];
    const updateName = customer_name !== undefined ? customer_name : t.customer_name;
    const updatePet = pet_name !== undefined ? pet_name : t.pet_name;
    const updateComment = comment !== undefined ? comment : t.comment;
    const updateRating = rating !== undefined ? rating : t.rating;
    const updateVisible = is_visible !== undefined ? is_visible : t.is_visible;

    await db.execute(
      'UPDATE testimonials SET customer_name = ?, pet_name = ?, comment = ?, rating = ?, is_visible = ? WHERE id = ?',
      [updateName, updatePet, updateComment, updateRating, updateVisible, req.params.id]
    );

    res.json({
      id: req.params.id,
      customer_name: updateName,
      pet_name: updatePet,
      comment: updateComment,
      rating: updateRating,
      is_visible: updateVisible
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating testimonial' });
  }
});

// @desc    Delete testimonial (Admin)
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const [testimonials] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if (testimonials.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await db.execute('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting testimonial' });
  }
});

module.exports = router;
