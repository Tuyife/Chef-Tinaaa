import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    service: { type: String, trim: true, default: 'Private Chef' },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    message: { type: String, required: true, trim: true, maxlength: 800 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
