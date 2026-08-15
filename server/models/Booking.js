import mongoose from 'mongoose';

const SERVICE_TYPES = [
  'private-chef',
  'catering',
  'event-catering',
  'meal-preparation',
  'menu-planning',
  'food-delivery',
];

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    guestToken: { type: String, trim: true, index: true },

    serviceType: { type: String, enum: SERVICE_TYPES, index: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    serviceName: { type: String, trim: true },

    // Service-specific booking details
    serviceDetails: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },

    // Denormalized contact info (guests don't have a User record)
    customerName: { type: String, trim: true },
    customerEmail: { type: String, trim: true },
    customerPhone: { type: String, trim: true },

    // Common booking information (mapped from the relevant service fields)
    eventDate: { type: Date },
    eventTime: { type: String, trim: true },
    location: { type: String, trim: true },
    guests: { type: Number, min: 1 },
    budget: { type: String, trim: true },
    message: { type: String, trim: true, maxlength: 1200 },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'refunded'],
      default: 'pending',
    },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
