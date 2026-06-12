const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all messages (Admin)
// @route   GET /api/messages
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const [messages] = await db.execute('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// @desc    Submit new message (Public)
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
  const { name, whatsapp, email, message } = req.body;

  if (!name || !whatsapp || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
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

  try {
    const [result] = await db.execute(
      'INSERT INTO messages (name, whatsapp, email, message, status) VALUES (?, ?, ?, ?, \'unread\')',
      [name, whatsapp, email, message]
    );

    res.status(201).json({
      message: 'Pesan berhasil dikirim! Kami akan segera menghubungi kamu.',
      messageId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

// @desc    Mark message as read (Admin)
// @route   PUT /api/messages/:id/read
// @access  Private (Admin)
router.put('/:id/read', protect, async (req, res) => {
  try {
    const [messages] = await db.execute('SELECT * FROM messages WHERE id = ?', [req.params.id]);
    if (messages.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await db.execute('UPDATE messages SET status = \'read\' WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error marking message as read' });
  }
});

// @desc    Delete message (Admin)
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const [messages] = await db.execute('SELECT * FROM messages WHERE id = ?', [req.params.id]);
    if (messages.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await db.execute('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting message' });
  }
});

module.exports = router;
