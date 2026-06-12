const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all appointments (joined with service and doctor)
// @route   GET /api/appointments
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*, 
        s.name AS service_name, 
        s.price AS service_price,
        d.name AS doctor_name,
        p.status AS payment_status,
        p.id AS payment_id
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      ORDER BY a.created_at DESC
    `;
    const [appointments] = await db.execute(query);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private (Admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*, 
        s.name AS service_name, 
        s.price AS service_price,
        d.name AS doctor_name,
        p.status AS payment_status,
        p.id AS payment_id,
        p.payment_method,
        p.amount AS payment_amount
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE a.id = ?
    `;
    const [appointments] = await db.execute(query, [req.params.id]);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointments[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new appointment (Public)
// @route   POST /api/appointments
// @access  Public
router.post('/', async (req, res) => {
  const {
    owner_name,
    whatsapp,
    email,
    pet_name,
    pet_type,
    pet_age,
    service_id,
    doctor_id,
    appointment_date,
    appointment_time,
    complaint,
    notes
  } = req.body;

  // Validation
  if (
    !owner_name ||
    !whatsapp ||
    !email ||
    !pet_name ||
    !pet_type ||
    !pet_age ||
    !service_id ||
    !doctor_id ||
    !appointment_date ||
    !appointment_time ||
    !complaint
  ) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  // Validate WhatsApp is number only
  const whatsappRegex = /^[0-9]+$/;
  if (!whatsappRegex.test(whatsapp)) {
    return res.status(400).json({ message: 'WhatsApp number must contain only numbers.' });
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  // Validate Date is not in the past
  const inputDate = new Date(appointment_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (inputDate < today) {
    return res.status(400).json({ message: 'Appointment date cannot be in the past.' });
  }

  try {
    // Check if service exists and fetch price for unpaid payment record
    const [services] = await db.execute('SELECT price FROM services WHERE id = ?', [service_id]);
    if (services.length === 0) {
      return res.status(404).json({ message: 'Selected service not found' });
    }
    const servicePrice = services[0].price;

    // Check if doctor exists
    const [doctors] = await db.execute('SELECT id FROM doctors WHERE id = ?', [doctor_id]);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Selected doctor not found' });
    }

    // Insert appointment
    const [result] = await db.execute(
      `INSERT INTO appointments (
        owner_name, whatsapp, email, pet_name, pet_type, pet_age, 
        service_id, doctor_id, appointment_date, appointment_time, complaint, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        owner_name,
        whatsapp,
        email,
        pet_name,
        pet_type,
        pet_age,
        service_id,
        doctor_id,
        appointment_date,
        appointment_time,
        complaint,
        notes || ''
      ]
    );

    const appointmentId = result.insertId;

    // Automatically create a pending payment record
    await db.execute(
      `INSERT INTO payments (appointment_id, payment_method, amount, status) 
       VALUES (?, 'Cash / Tunai', ?, 'unpaid')`,
      [appointmentId, servicePrice]
    );

    res.status(201).json({
      message: 'Reservasi berhasil! Admin Ficky Busuk akan menghubungi kamu via WhatsApp.',
      appointmentId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error placing appointment' });
  }
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Admin)
router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;

  if (!status || !['pending', 'approved', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status' });
  }

  try {
    const [appointments] = await db.execute('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await db.execute('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);

    // If appointment is completed, we might want to auto update payment if paid, or just let admin handle payments.
    // We keep payment status management decoupled or default as specified.
    
    res.json({ message: `Appointment status updated to ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const [appointments] = await db.execute('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Cascade delete on payments is handled by FOREIGN KEY constraint (ON DELETE CASCADE)
    await db.execute('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting appointment' });
  }
});

module.exports = router;
