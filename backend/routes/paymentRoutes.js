const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*, 
        a.owner_name, 
        a.pet_name, 
        a.pet_type, 
        a.appointment_date,
        s.name AS service_name
      FROM payments p
      LEFT JOIN appointments a ON p.appointment_id = a.id
      LEFT JOIN services s ON a.service_id = s.id
      ORDER BY p.id DESC
    `;
    const [payments] = await db.execute(query);
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching payments' });
  }
});

// @desc    Create a payment (usually auto-created, but admin can create too)
// @route   POST /api/payments
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  const { appointment_id, payment_method, amount, status } = req.body;

  if (!appointment_id || !payment_method || amount === undefined) {
    return res.status(400).json({ message: 'Appointment ID, method, and amount are required' });
  }

  try {
    const [appointments] = await db.execute('SELECT id FROM appointments WHERE id = ?', [appointment_id]);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const payStatus = status || 'unpaid';
    const paidAt = payStatus === 'paid' ? new Date() : null;

    const [result] = await db.execute(
      'INSERT INTO payments (appointment_id, payment_method, amount, status, paid_at) VALUES (?, ?, ?, ?, ?)',
      [appointment_id, payment_method, amount, payStatus, paidAt]
    );

    res.status(201).json({
      id: result.insertId,
      appointment_id,
      payment_method,
      amount,
      status: payStatus,
      paid_at: paidAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating payment' });
  }
});

// @desc    Update payment status/info
// @route   PUT /api/payments/:id
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  const { payment_method, amount, status } = req.body;

  if (!payment_method || amount === undefined || !status) {
    return res.status(400).json({ message: 'Payment method, amount, and status are required' });
  }

  try {
    const [payments] = await db.execute('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    if (payments.length === 0) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    const currentPayment = payments[0];
    let paidAt = currentPayment.paid_at;

    // Handle transition to paid
    if (status === 'paid' && currentPayment.status !== 'paid') {
      paidAt = new Date();
    } else if (status !== 'paid') {
      paidAt = null;
    }

    await db.execute(
      'UPDATE payments SET payment_method = ?, amount = ?, status = ?, paid_at = ? WHERE id = ?',
      [payment_method, amount, status, paidAt, req.params.id]
    );

    res.json({
      id: req.params.id,
      payment_method,
      amount,
      status,
      paid_at: paidAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating payment' });
  }
});

module.exports = router;
