import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Requires a valid bearer token. Loads the user from the DB so that the role
 * is ALWAYS taken from the server-side record — never trusted from the client.
 */
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+password');
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Not authorized, account not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

/**
 * Like protect(), but attaches req.user when a valid token is present and
 * never rejects. Use for routes that must support BOTH guests and
 * logged-in customers (e.g. creating a booking) so bookings made while
 * signed in are linked to the account immediately.
 */
export const optionalProtect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('+password');
      if (user && user.active) req.user = user;
    }
  } catch {
    /* invalid/expired token — treat as guest */
  }
  next();
};

/** Restrict a route to specific roles. Must be used after protect(). */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. You do not have permission.' });
  }
  next();
};
