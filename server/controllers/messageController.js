import { asyncHandler, AppError } from '../utils/helpers.js';
import Message from '../models/Message.js';

export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) throw new AppError('Name, email and message are required', 400);
  const created = await Message.create({ name, email, phone, subject, message, status: 'unread' });
  res.status(201).json({ message: 'Your message has been sent. We will get back to you shortly.', id: created._id });
});

export const getMessages = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const messages = await Message.find(filter).sort({ createdAt: -1 });
  res.json({ messages });
});

export const updateMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) throw new AppError('Message not found', 404);
  if (req.body.status) msg.status = req.body.status;
  await msg.save();
  res.json({ message: msg });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) throw new AppError('Message not found', 404);
  res.json({ message: 'Message deleted' });
});
