import { asyncHandler } from '../utils/helpers.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Service from '../models/Service.js';

export const getOverview = asyncHandler(async (req, res) => {
  const [totalBookings, pending, confirmed, completed, totalCustomers, totalRevenue] =
    await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      User.countDocuments({ role: 'customer' }),
      Booking.aggregate([
        { $match: { paymentStatus: 'successful' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

  // Booking activity over the last 14 days
  const start = new Date();
  start.setDate(start.getDate() - 13);
  start.setHours(0, 0, 0, 0);

  const activity = await Booking.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Revenue by month (bookings marked as paid)
  const revenue = await Booking.aggregate([
    { $match: { paymentStatus: 'successful' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Service popularity
  const popularity = await Booking.aggregate([
    { $group: { _id: '$serviceName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  const services = await Service.find().sort({ createdAt: 1 });

  res.json({
    stats: {
      totalBookings,
      pending,
      confirmed,
      completed,
      totalCustomers,
      totalRevenue: totalRevenue.length ? totalRevenue[0].total : 0,
      totalServices: services.length,
    },
    activity,
    revenue,
    popularity,
  });
});
