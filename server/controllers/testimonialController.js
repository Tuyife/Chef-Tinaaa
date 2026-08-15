import { asyncHandler, AppError } from '../utils/helpers.js';
import Testimonial from '../models/Testimonial.js';

export const getPublished = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ published: true }).sort({ createdAt: -1 });
  res.json({ testimonials });
});

export const getAdmin = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json({ testimonials });
});

export const create = asyncHandler(async (req, res) => {
  const { customerName, service, rating, message, published } = req.body;
  if (!customerName || !message) throw new AppError('Customer name and message are required', 400);
  const testimonial = await Testimonial.create({
    customerName,
    service,
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    message,
    published: published !== undefined ? Boolean(published) : true,
  });
  res.status(201).json({ testimonial });
});

export const update = asyncHandler(async (req, res) => {
  const t = await Testimonial.findById(req.params.id);
  if (!t) throw new AppError('Testimonial not found', 404);
  const { customerName, service, rating, message, published } = req.body;
  if (customerName !== undefined) t.customerName = customerName;
  if (service !== undefined) t.service = service;
  if (rating !== undefined) t.rating = Math.min(5, Math.max(1, Number(rating) || 5));
  if (message !== undefined) t.message = message;
  if (published !== undefined) t.published = Boolean(published);
  await t.save();
  res.json({ testimonial: t });
});

export const remove = asyncHandler(async (req, res) => {
  const t = await Testimonial.findByIdAndDelete(req.params.id);
  if (!t) throw new AppError('Testimonial not found', 404);
  res.json({ message: 'Testimonial deleted' });
});
