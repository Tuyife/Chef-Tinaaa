import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true, default: 'General enquiry' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['unread', 'read', 'resolved'], default: 'unread' },
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
