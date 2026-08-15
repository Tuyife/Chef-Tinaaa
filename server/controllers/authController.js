import { asyncHandler, AppError } from '../utils/helpers.js';
import { generateToken } from '../middleware/auth.js';
import User from '../models/User.js';

/**
 * Public registration. Role is FORCED to "customer" server-side.
 * Admin accounts can only be created through the secure seed/CLI process.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    throw new AppError('Please fill in all required fields', 400);
  }
  if (String(password).length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }
  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) throw new AppError('An account with this email already exists', 409);

  const user = await User.create({ name, email, phone, password, role: 'customer' });
  const token = generateToken(user);
  res.status(201).json({ token, user: user.toSafeJSON() });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Please provide email and password', 400);

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.active) throw new AppError('This account has been deactivated', 403);

  const token = generateToken(user);
  res.json({ token, user: user.toSafeJSON() });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name) req.user.name = String(name).trim();
  if (phone) req.user.phone = String(phone).trim();
  await req.user.save();
  res.json({ user: req.user.toSafeJSON() });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new AppError('Please provide current and new password', 400);
  if (String(newPassword).length < 6) throw new AppError('New password must be at least 6 characters', 400);

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
});
