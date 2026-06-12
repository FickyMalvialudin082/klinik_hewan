const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
router.get('/stats', protect, async (req, res) => {
  try {
    const [services] = await db.execute('SELECT COUNT(*) as count FROM services');
    const [doctors] = await db.execute('SELECT COUNT(*) as count FROM doctors');
    
    const [totalAppointments] = await db.execute('SELECT COUNT(*) as count FROM appointments');
    const [pendingAppointments] = await db.execute('SELECT COUNT(*) as count FROM appointments WHERE status = "pending"');
    const [approvedAppointments] = await db.execute('SELECT COUNT(*) as count FROM appointments WHERE status = "approved"');
    const [completedAppointments] = await db.execute('SELECT COUNT(*) as count FROM appointments WHERE status = "completed"');
    
    const [payments] = await db.execute('SELECT SUM(amount) as total FROM payments WHERE status = "paid"');
    const [messages] = await db.execute('SELECT COUNT(*) as count FROM messages');

    res.json({
      totalServices: services[0].count,
      totalDoctors: doctors[0].count,
      totalAppointments: totalAppointments[0].count,
      pendingAppointments: pendingAppointments[0].count,
      approvedAppointments: approvedAppointments[0].count,
      completedAppointments: completedAppointments[0].count,
      totalRevenue: payments[0].total || 0,
      totalMessages: messages[0].count
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error retrieving dashboard statistics' });
  }
});

module.exports = router;
