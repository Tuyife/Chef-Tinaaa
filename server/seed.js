import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Service from './models/Service.js';
import Testimonial from './models/Testimonial.js';
import { FOOD_MENU } from './data/foodMenu.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@glorycatering.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Glory Catering Service';

const services = [
  { name: 'Private Chef', description: 'A personal chef experience in the comfort of your home — menus tailored to your taste and occasion.', image: '/images/elegant-dish.jpg', price: 120000, slug: 'private-chef' },
  { name: 'Catering Services', description: 'Full-service catering for celebrations, gatherings and special occasions with beautiful presentation.', image: '/images/catering.jpg', price: 250000, slug: 'catering' },
  { name: 'Event Catering', description: 'End-to-end event catering — planning, staffing and flawless on-the-day execution.', image: '/images/fine-dining.jpg', price: 350000, slug: 'event-catering' },
  { name: 'Meal Preparation', description: 'Freshly prepared meals planned around your needs, preferences and dietary goals.', image: '/images/meal-prep.jpg', price: 60000, slug: 'meal-preparation' },
  { name: 'Custom Menu Planning', description: 'A bespoke menu designed around your event theme, budget and dietary requirements.', image: '/images/plated-dish.jpg', price: 45000, slug: 'menu-planning' },
  {
    name: 'Food Delivery / Meal Service',
    description: 'Restaurant-quality meals delivered to your door, ready to enjoy.',
    image: '/images/salmon.jpg',
    price: 35000,
    slug: 'food-delivery',
    menu: FOOD_MENU,
  },
];

const testimonials = [
  {
    customerName: 'Adaeze Okafor',
    service: 'Private Chef',
    rating: 5,
    message: 'Glory Catering Service turned our anniversary dinner into something unforgettable. The attention to detail and flavor was world-class.',
  },
  {
    customerName: 'Tunde Balogun',
    service: 'Event Catering',
    rating: 5,
    message: 'We hired Glory Catering Service for a 200-guest event and it was flawless from start to finish. Guests are still talking about the food.',
  },
  {
    customerName: 'Chioma Nwosu',
    service: 'Meal Preparation',
    rating: 5,
    message: 'Fresh, healthy and consistently delicious. My weekly meal prep has never been this enjoyable.',
  },
];

const run = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: '08000000000',
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`[seed] Admin created: ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD})`);
  } else {
    console.log('[seed] Admin already exists, skipping.');
  }

  const count = await Service.countDocuments();
  if (count === 0) {
    await Service.insertMany(services);
    console.log(`[seed] ${services.length} services created.`);
  } else {
    console.log('[seed] Services already exist, skipping.');
  }

  const tCount = await Testimonial.countDocuments();
  if (tCount === 0) {
    await Testimonial.insertMany(testimonials);
    console.log(`[seed] ${testimonials.length} testimonials created.`);
  } else {
    console.log('[seed] Testimonials already exist, skipping.');
  }

  await mongoose.disconnect();
  console.log('[seed] Done.');
};

run().catch((err) => {
  console.error('[seed] Failed:', err.message);
  process.exit(1);
});
