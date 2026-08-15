import { asyncHandler, AppError } from '../utils/helpers.js';
import User from '../models/User.js';

export const getCustomers = asyncHandler(async (req, res) => {
  const filter = { role: 'customer' };
  if (req.query.q) {
    filter.$or = [
      { name: { $regex: req.query.q, $options: 'i' } },
      { email: { $regex: req.query.q, $options: 'i' } },
      { phone: { $regex: req.query.q, $options: 'i' } },
    ];
  }
  const customers = await User.find(filter).sort({ createdAt: -1 });
  res.json({ customers: customers.map((u) => u.toSafeJSON()) });
});

export const toggleCustomer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('Customer not found', 404);
  if (user.role === 'admin') throw new AppError('Admin accounts cannot be modified here', 400);
  user.active = req.body.active !== undefined ? Boolean(req.body.active) : !user.active;
  await user.save();
  res.json({ user: user.toSafeJSON() });
});
