import { randomUUID } from 'node:crypto';
import { asyncHandler, AppError } from '../utils/helpers.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { sendBookingNotification } from '../utils/mailer.js';

const VALID_STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'];

// Which serviceDetails fields are required for each service type,
// and how they map to the common booking fields used in listings/dashboards.
const SERVICE_TYPES = {
  'private-chef': {
    label: 'Private Chef',
    required: [
      'customer.name',
      'customer.email',
      'customer.phone',
      'preferredDate',
      'preferredTime',
      'guests',
      'location',
      'occasion',
      'cuisine',
      'numberCourses',
    ],
    map: (d) => ({
      eventDate: d.preferredDate,
      eventTime: d.preferredTime,
      location: d.location,
      guests: d.guests,
      budget: d.budget,
      message: d.additionalRequests,
    }),
  },
  catering: {
    label: 'Catering Services',
    required: [
      'customer.name',
      'customer.email',
      'customer.phone',
      'eventType',
      'eventDate',
      'eventTime',
      'eventLocation',
      'guests',
      'cateringType',
      'cuisine',
    ],
    map: (d) => ({
      eventDate: d.eventDate,
      eventTime: d.eventTime,
      location: d.eventLocation,
      guests: d.guests,
      budget: d.budget,
      message: d.additionalRequests,
    }),
  },
  'event-catering': {
    label: 'Event Catering',
    required: [
      'customer.name',
      'customer.email',
      'customer.phone',
      'eventName',
      'eventType',
      'eventDate',
      'startTime',
      'endTime',
      'eventVenue',
      'guests',
      'serviceStyle',
      'cuisine',
    ],
    map: (d) => ({
      eventDate: d.eventDate,
      eventTime: d.startTime,
      location: d.eventVenue,
      guests: d.guests,
      budget: d.budget,
      message: d.specialRequests,
    }),
  },
  'meal-preparation': {
    label: 'Meal Preparation',
    required: [
      'customer.name',
      'customer.email',
      'customer.phone',
      'startDate',
      'numberOfMeals',
      'mealsPerDay',
      'numberOfPeople',
      'cuisine',
    ],
    map: (d) => ({
      eventDate: d.startDate,
      location: '',
      guests: d.numberOfPeople,
      budget: d.budget,
      message: d.specialInstructions,
    }),
  },
  'menu-planning': {
    label: 'Custom Menu Planning',
    required: [
      'customer.name',
      'customer.email',
      'customer.phone',
      'occasion',
      'eventDate',
      'guests',
      'cuisinePreference',
      'numberCourses',
    ],
    map: (d) => ({
      eventDate: d.eventDate,
      location: '',
      guests: d.guests,
      budget: d.budget,
      message: d.specialInstructions,
    }),
  },
  'food-delivery': {
    label: 'Food Delivery / Meal Service',
    required: [
      'customer.name',
      'customer.email',
      'customer.phone',
      'deliveryDate',
      'deliveryTime',
      'numberOfMeals',
      'mealType',
      'cuisine',
      'deliveryAddress',
    ],
    map: (d) => ({
      eventDate: d.deliveryDate,
      eventTime: d.deliveryTime,
      location: d.deliveryAddress,
      budget: d.budget,
      message: d.specialRequests,
    }),
  },
};

const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

const humanize = (path) => {
  const last = path.split('.').pop();
  return last
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());
};

const isMissing = (v, numeric) => {
  if (v === undefined || v === null) return true;
  if (numeric) return !(Number(v) > 0);
  return String(v).trim() === '';
};

// Customer: create a booking request
export const createBooking = asyncHandler(async (req, res) => {
  const { service, serviceType, serviceName, serviceDetails } = req.body;
  const cfg = serviceType ? SERVICE_TYPES[serviceType] : null;

  let common = {};
  if (cfg) {
    const missing = cfg.required
      .filter((p) => isMissing(getPath(serviceDetails, p), p === 'guests'))
      .map((p) => humanize(p));
    if (missing.length) {
      throw new AppError(`Please complete the ${cfg.label} form: ${missing.join(', ')}`, 400);
    }
    const email = getPath(serviceDetails, 'customer.email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      throw new AppError('Please provide a valid email address', 400);
    }
    common = cfg.map(serviceDetails || {});
  } else {
    // Legacy path (no serviceType): require the original generic fields.
    const requiredFields = [
      { key: 'service', label: 'service' },
      { key: 'eventDate', label: 'event date' },
      { key: 'eventTime', label: 'event time' },
      { key: 'location', label: 'location' },
      { key: 'guests', label: 'number of guests' },
    ];
    const missing = requiredFields
      .filter(({ key }) => {
        const v = req.body[key];
        if (v === undefined || v === null) return true;
        if (key === 'guests') return !(Number(v) > 0);
        return String(v).trim() === '';
      })
      .map(({ label }) => label);
    if (missing.length) {
      throw new AppError(`Please provide: ${missing.join(', ')}`, 400);
    }
    common = {
      eventDate: req.body.eventDate,
      eventTime: req.body.eventTime,
      location: req.body.location,
      guests: req.body.guests,
      budget: req.body.budget,
      message: req.body.message,
    };
  }

  const svc = service ? await Service.findById(service) : null;
  if (service && !svc) throw new AppError('Selected service not found', 400);

  const customer = req.user ? req.user._id : null;
  const guestToken = req.user ? null : randomUUID();
  const d = serviceDetails || {};

  // For food delivery, the total comes from the selected menu items x quantities,
  // priced from the admin-managed menu (client-sent prices are never trusted).
  let totalAmount = svc?.price || 0;
  if (serviceType === 'food-delivery' && svc?.menu?.length && Array.isArray(d.items)) {
    const priceByItem = new Map(svc.menu.map((m) => [String(m.name).trim(), Number(m.price) || 0]));
    totalAmount = d.items.reduce((sum, it) => {
      const name = String(it?.name || '').trim();
      const qty = Number(it?.qty) || 0;
      return sum + (priceByItem.get(name) || 0) * qty;
    }, 0);
  }

  const booking = await Booking.create({
    customer,
    guestToken,
    serviceType: serviceType || null,
    service: svc ? svc._id : null,
    serviceName: serviceName || svc?.name || 'Booking',
    serviceDetails: d,
    customerName: d.customer?.name || req.body.customerName || '',
    customerEmail: d.customer?.email || req.body.customerEmail || '',
    customerPhone: d.customer?.phone || req.body.customerPhone || '',
    eventDate: common.eventDate || null,
    eventTime: common.eventTime || '',
    location: common.location || '',
    guests: common.guests || undefined,
    budget: common.budget || '',
    message: common.message || '',
    status: 'pending',
    paymentStatus: 'pending',
    totalAmount,
  });

  const populated = await Booking.findById(booking._id).populate('service', 'name price');
  res.status(201).json({ booking: populated });

  // Notify the owner about the new request (fire-and-forget, never blocks the response).
  sendBookingNotification(populated || booking);
});

// Customer: list own bookings. Admin: list all (with filters).
export const getBookings = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const filter = isAdmin ? {} : { customer: req.user._id };

  if (isAdmin) {
    if (req.query.status) filter.status = req.query.status;
    if (req.query.payment) filter.paymentStatus = req.query.payment;
    if (req.query.serviceType) filter.serviceType = req.query.serviceType;
    if (req.query.q) {
      filter.$or = [
        { serviceName: { $regex: req.query.q, $options: 'i' } },
        { customerName: { $regex: req.query.q, $options: 'i' } },
        { location: { $regex: req.query.q, $options: 'i' } },
      ];
    }
  }

  const bookings = await Booking.find(filter)
    .populate('customer', 'name email phone')
    .sort({ createdAt: -1 });

  res.json({ bookings });
});

// Logged-in user: claim bookings made as a guest (linked via guestToken)
export const claimBooking = asyncHandler(async (req, res) => {
  const { guestToken } = req.body;
  const tokens = (Array.isArray(guestToken) ? guestToken : [guestToken])
    .filter((t) => typeof t === 'string' && t.trim());
  if (!tokens.length) throw new AppError('No booking to claim', 400);

  const result = await Booking.updateMany(
    {
      guestToken: { $in: tokens },
      $or: [{ customer: null }, { customer: { $exists: false } }],
    },
    { $set: { customer: req.user._id }, $unset: { guestToken: 1 } },
  );

  res.json({ claimed: result.modifiedCount });
});

// Customer: own booking only. Admin: any booking.
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('service', 'name description price');
  if (!booking) throw new AppError('Booking not found', 404);
  if (
    req.user.role !== 'admin' &&
    (!booking.customer || String(booking.customer._id) !== String(req.user._id))
  ) {
    throw new AppError('Access denied', 403);
  }
  res.json({ booking });
});

// Admin only: update status / reschedule / set payment status
export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);

  const { status, paymentStatus, eventDate, eventTime, location, guests, totalAmount } = req.body;

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) throw new AppError('Invalid booking status', 400);
    booking.status = status;
  }
  if (paymentStatus !== undefined) {
    booking.paymentStatus = paymentStatus;
  }
  if (eventDate !== undefined) booking.eventDate = eventDate;
  if (eventTime !== undefined) booking.eventTime = eventTime;
  if (location !== undefined) booking.location = location;
  if (guests !== undefined) booking.guests = guests;
  if (totalAmount !== undefined) booking.totalAmount = totalAmount;

  await booking.save();
  const populated = await Booking.findById(booking._id)
    .populate('customer', 'name email phone')
    .populate('service', 'name price');
  res.json({ booking: populated });
});
