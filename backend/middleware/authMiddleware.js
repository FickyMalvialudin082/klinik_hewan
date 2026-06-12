const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret_ficky_busuk_2026');

      // Get user from the token (exclude password)
      const [rows] = await db.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = rows[0];
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
