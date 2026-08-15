import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    cuisine: { type: String, trim: true },
    image: { type: String, trim: true },
  },
  { _id: false },
);

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    price: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    slug: { type: String, trim: true, index: true },
    menu: { type: [menuItemSchema], default: [] },
  },
  { timestamps: true },
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
