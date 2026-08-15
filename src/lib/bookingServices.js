import { ChefHat, UtensilsCrossed, PartyPopper, Salad, NotebookPen, Bike } from 'lucide-react';
import { formatDate } from './api.js';

export const SERVICES = [
  {
    slug: 'private-chef',
    name: 'Private Chef',
    tagline: 'A personal chef experience in your own home, tailored to the occasion.',
    btn: 'Request Private Chef',
    icon: ChefHat,
  },
  {
    slug: 'catering',
    name: 'Catering Services',
    tagline: 'Full-service catering for celebrations, gatherings and special occasions.',
    btn: 'Request Catering',
    icon: UtensilsCrossed,
  },
  {
    slug: 'event-catering',
    name: 'Event Catering',
    tagline: 'End-to-end event catering — planning, staffing and flawless execution.',
    btn: 'Plan My Event',
    icon: PartyPopper,
  },
  {
    slug: 'meal-preparation',
    name: 'Meal Preparation',
    tagline: 'Fresh, planned meals that fit your week, your preferences and your goals.',
    btn: 'Request Meal Preparation',
    icon: Salad,
  },
  {
    slug: 'menu-planning',
    name: 'Custom Menu Planning',
    tagline: 'A bespoke menu designed around your theme, budget and dietary needs.',
    btn: 'Request Custom Menu',
    icon: NotebookPen,
  },
  {
    slug: 'food-delivery',
    name: 'Food Delivery / Meal Service',
    tagline: 'Restaurant-quality meals prepared and delivered to your door.',
    btn: 'Request Meal Delivery',
    icon: Bike,
  },
];

export const CUISINES = [
  'Nigerian', 'African', 'Continental', 'Intercontinental', 'Italian', 'Chinese',
  'Indian', 'Mediterranean', 'French', 'Mexican', 'Japanese', 'Seafood', 'Vegetarian', 'Other',
];

const findService = (slug) => SERVICES.find((s) => s.slug === slug) || SERVICES[0];

export const serviceLabel = (slug) => findService(slug).name;

// Static lookup so components never create a component during render.
export const SERVICE_ICONS = Object.fromEntries(SERVICES.map((s) => [s.slug, s.icon]));

// Shared field-update helpers.
export const makeSet = (data, setData) => (key) => (value) => setData({ ...data, [key]: value });
export const makeSetCustomer = (data, setData) => (key) => (value) =>
  setData({ ...data, customer: { ...data.customer, [key]: value } });

// Initial (empty) serviceDetails object for each service type.
export const defaultServiceData = (slug) => {
  switch (slug) {
    case 'private-chef':
      return {
        customer: { name: '', email: '', phone: '' },
        preferredDate: '', preferredTime: '', guests: '', location: '', occasion: '',
        cuisine: '', dietaryRequirements: '', allergies: '', foodPreferences: '', numberCourses: '',
        mealType: '', preferredMenu: '', additionalRequests: '',
      };
    case 'catering':
      return {
        customer: { name: '', email: '', phone: '' },
        eventType: '', eventDate: '', eventTime: '', eventLocation: '', guests: '',
        cateringType: '', cuisine: '', menuPreferences: '', dietaryRequirements: '', allergies: '',
        budget: '', specialInstructions: '', additionalRequests: '',
      };
    case 'event-catering':
      return {
        customer: { name: '', email: '', phone: '' },
        eventName: '', eventType: '', eventDate: '', startTime: '', endTime: '', eventVenue: '', guests: '',
        serviceStyle: '', cuisine: '', menuRequirements: '', dietaryRequirements: '', allergies: '', specialRequests: '',
        decorationRequirements: '', staffRequired: '', equipmentRequired: '', specialInstructions: '',
        budget: '',
      };
    case 'meal-preparation':
      return {
        customer: { name: '', email: '', phone: '' },
        startDate: '', numberOfMeals: '', mealsPerDay: '', numberOfPeople: '',
        mealTypes: [],
        cuisine: '', foodsYouLike: '', foodsYouAvoid: '', dietaryRequirements: '', allergies: '',
        preparationPreference: '', deliveryRequired: false, pickup: false, specialInstructions: '',
      };
    case 'menu-planning':
      return {
        customer: { name: '', email: '', phone: '' },
        occasion: '', eventDate: '', guests: '', cuisinePreference: '', numberCourses: '',
        courses: [],
        dietaryRequirements: '', allergies: '', foodsToAvoid: '', preferredIngredients: '',
        budgetRange: '', theme: '', specialInstructions: '',
      };
    case 'food-delivery':
      return {
        customer: { name: '', email: '', phone: '' },
        deliveryDate: '', deliveryTime: '', numberOfMeals: '', items: [], mealType: '',
        cuisine: '', mealPreference: '', dietaryRequirements: '', allergies: '',
        deliveryAddress: '', landmark: '', deliveryInstructions: '', specialRequests: '',
      };
    default:
      return {};
  }
};

// Required fields (paths inside serviceDetails) per service type.
export const requiredFields = (slug) => {
  switch (slug) {
    case 'private-chef':
      return ['customer.name', 'customer.email', 'customer.phone', 'preferredDate', 'preferredTime', 'guests', 'location', 'occasion', 'cuisine', 'numberCourses'];
    case 'catering':
      return ['customer.name', 'customer.email', 'customer.phone', 'eventType', 'eventDate', 'eventTime', 'eventLocation', 'guests', 'cateringType', 'cuisine'];
    case 'event-catering':
      return ['customer.name', 'customer.email', 'customer.phone', 'eventName', 'eventType', 'eventDate', 'startTime', 'endTime', 'eventVenue', 'guests', 'serviceStyle', 'cuisine'];
    case 'meal-preparation':
      return ['customer.name', 'customer.email', 'customer.phone', 'startDate', 'numberOfMeals', 'mealsPerDay', 'numberOfPeople', 'cuisine'];
    case 'menu-planning':
      return ['customer.name', 'customer.email', 'customer.phone', 'occasion', 'eventDate', 'guests', 'cuisinePreference', 'numberCourses'];
    case 'food-delivery':
      return ['customer.name', 'customer.email', 'customer.phone', 'deliveryDate', 'deliveryTime', 'numberOfMeals', 'mealType', 'cuisine', 'deliveryAddress'];
    default:
      return [];
  }
};

const humanize = (path) => {
  const last = path.split('.').pop();
  const map = { name: 'Full Name', email: 'Email', phone: 'Phone Number' };
  if (map[last]) return map[last];
  return last.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
};

const getPath = (data, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), data);

// Returns { 'path': 'error message' } for missing required fields.
export const validateService = (slug, data) => {
  const errors = {};
  for (const p of requiredFields(slug)) {
    const v = getPath(data, p);
    const numeric = p === 'guests' || p === 'numberCourses' || p === 'numberOfMeals' || p === 'mealsPerDay' || p === 'numberOfPeople';
    const missing = v === undefined || v === null || (numeric ? !(Number(v) > 0) : String(v).trim() === '');
    if (missing) errors[p] = `${humanize(p)} is required`;
  }
  const email = getPath(data, 'customer.email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    errors['customer.email'] = 'Please enter a valid email address';
  }
  if (slug === 'food-delivery') {
    const hasItems = Array.isArray(data.items) && data.items.some((it) => Number(it?.qty) > 0);
    if (!hasItems) errors.items = 'Select at least one meal';
  }
  return errors;
};

// Ordered rows used in the review summary, customer dashboard and admin detail view.
// type: 'text' | 'date' | 'time' | 'money' | 'list' | 'yesno'
export const summaryRows = (slug) => {
  switch (slug) {
    case 'private-chef':
      return [
        { key: 'preferredDate', label: 'Date', type: 'date' },
        { key: 'preferredTime', label: 'Time', type: 'time' },
        { key: 'guests', label: 'Guests', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'occasion', label: 'Occasion', type: 'text' },
        { key: 'cuisine', label: 'Cuisine', type: 'text' },
        { key: 'mealType', label: 'Meal Type', type: 'text' },
        { key: 'numberCourses', label: 'Number of Courses', type: 'text' },
        { key: 'foodPreferences', label: 'Food Preferences', type: 'text' },
        { key: 'dietaryRequirements', label: 'Dietary Requirements', type: 'text' },
        { key: 'allergies', label: 'Allergies', type: 'text' },
        { key: 'preferredMenu', label: 'Preferred Menu', type: 'text' },
        { key: 'additionalRequests', label: 'Additional Requests', type: 'text' },
      ];
    case 'catering':
      return [
        { key: 'eventType', label: 'Event Type', type: 'text' },
        { key: 'eventDate', label: 'Date', type: 'date' },
        { key: 'eventTime', label: 'Time', type: 'time' },
        { key: 'eventLocation', label: 'Location', type: 'text' },
        { key: 'guests', label: 'Guests', type: 'text' },
        { key: 'cateringType', label: 'Type of Catering', type: 'text' },
        { key: 'cuisine', label: 'Cuisine', type: 'text' },
        { key: 'menuPreferences', label: 'Menu Preferences', type: 'text' },
        { key: 'dietaryRequirements', label: 'Dietary Requirements', type: 'text' },
        { key: 'allergies', label: 'Allergies', type: 'text' },
        { key: 'budget', label: 'Estimated Budget', type: 'text' },
        { key: 'specialInstructions', label: 'Special Instructions', type: 'text' },
        { key: 'additionalRequests', label: 'Additional Requests', type: 'text' },
      ];
    case 'event-catering':
      return [
        { key: 'eventName', label: 'Event', type: 'text' },
        { key: 'eventType', label: 'Event Type', type: 'text' },
        { key: 'eventDate', label: 'Date', type: 'date' },
        { key: 'startTime', label: 'Start Time', type: 'time' },
        { key: 'endTime', label: 'End Time', type: 'time' },
        { key: 'eventVenue', label: 'Venue', type: 'text' },
        { key: 'guests', label: 'Guests', type: 'text' },
        { key: 'serviceStyle', label: 'Service Style', type: 'text' },
        { key: 'cuisine', label: 'Cuisine', type: 'text' },
        { key: 'menuRequirements', label: 'Menu Requirements', type: 'text' },
        { key: 'dietaryRequirements', label: 'Dietary Requirements', type: 'text' },
        { key: 'allergies', label: 'Allergies', type: 'text' },
        { key: 'decorationRequirements', label: 'Decorations', type: 'text' },
        { key: 'staffRequired', label: 'Serving Staff', type: 'text' },
        { key: 'equipmentRequired', label: 'Equipment', type: 'text' },
        { key: 'budget', label: 'Estimated Budget', type: 'text' },
        { key: 'specialRequests', label: 'Special Requests', type: 'text' },
      ];
    case 'meal-preparation':
      return [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'numberOfMeals', label: 'Number of Meals', type: 'text' },
        { key: 'mealsPerDay', label: 'Meals Per Day', type: 'text' },
        { key: 'numberOfPeople', label: 'Number of People', type: 'text' },
        { key: 'mealTypes', label: 'Meals', type: 'list' },
        { key: 'cuisine', label: 'Cuisine', type: 'text' },
        { key: 'foodsYouLike', label: 'Foods You Like', type: 'text' },
        { key: 'foodsYouAvoid', label: 'Foods You Avoid', type: 'text' },
        { key: 'dietaryRequirements', label: 'Dietary Requirements', type: 'text' },
        { key: 'allergies', label: 'Allergies', type: 'text' },
        { key: 'preparationPreference', label: 'Preparation', type: 'text' },
        { key: 'deliveryRequired', label: 'Delivery', type: 'yesno' },
        { key: 'pickup', label: 'Pickup', type: 'yesno' },
        { key: 'specialInstructions', label: 'Special Instructions', type: 'text' },
      ];
    case 'menu-planning':
      return [
        { key: 'occasion', label: 'Occasion', type: 'text' },
        { key: 'eventDate', label: 'Date', type: 'date' },
        { key: 'guests', label: 'Guests', type: 'text' },
        { key: 'cuisinePreference', label: 'Cuisine Preference', type: 'text' },
        { key: 'numberCourses', label: 'Number of Courses', type: 'text' },
        { key: 'courses', label: 'Courses', type: 'list' },
        { key: 'dietaryRequirements', label: 'Dietary Requirements', type: 'text' },
        { key: 'allergies', label: 'Allergies', type: 'text' },
        { key: 'foodsToAvoid', label: 'Foods to Avoid', type: 'text' },
        { key: 'preferredIngredients', label: 'Preferred Ingredients', type: 'text' },
        { key: 'budgetRange', label: 'Budget Range', type: 'text' },
        { key: 'theme', label: 'Theme', type: 'text' },
        { key: 'specialInstructions', label: 'Special Instructions', type: 'text' },
      ];
    case 'food-delivery':
      return [
        { key: 'items', label: 'Order Items', type: 'items' },
        { key: 'numberOfMeals', label: 'Number of Meals', type: 'text' },
        { key: 'deliveryDate', label: 'Delivery Date', type: 'date' },
        { key: 'deliveryTime', label: 'Delivery Time', type: 'time' },
        { key: 'mealType', label: 'Meal Type', type: 'text' },
        { key: 'cuisine', label: 'Cuisine', type: 'text' },
        { key: 'mealPreference', label: 'Meal Preference', type: 'text' },
        { key: 'dietaryRequirements', label: 'Dietary Requirements', type: 'text' },
        { key: 'allergies', label: 'Allergies', type: 'text' },
        { key: 'deliveryAddress', label: 'Delivery Address', type: 'text' },
        { key: 'landmark', label: 'Landmark', type: 'text' },
        { key: 'deliveryInstructions', label: 'Delivery Instructions', type: 'text' },
        { key: 'specialRequests', label: 'Special Requests', type: 'text' },
      ];
    default:
      return [];
  }
};

const formatValue = (v, type) => {
  if (v === undefined || v === null || v === '') return null;
  if (type === 'list') {
    const list = Array.isArray(v) ? v : [v];
    return list.length ? list.join(', ') : null;
  }
  if (type === 'items') {
    const list = Array.isArray(v) ? v : [];
    const selected = list.filter((it) => Number(it?.qty) > 0);
    return selected.length ? selected.map((it) => `${it.name} × ${it.qty}`).join(' · ') : null;
  }
  if (type === 'yesno') return v ? 'Yes' : 'No';
  if (type === 'date') return formatDate(v);
  return String(v);
};

// Returns non-empty {label, value} rows for display, given a booking's serviceDetails.
export const displayRows = (booking) => {
  const rows = summaryRows(booking.serviceType);
  if (!rows.length) return [];
  return rows
    .map((r) => ({ label: r.label, value: formatValue(booking.serviceDetails?.[r.key], r.type) }))
    .filter((r) => r.value !== null);
};

// Same rows, built from live form data (used in the review step).
export const summaryList = (slug, data) =>
  summaryRows(slug)
    .map((r) => ({ label: r.label, value: formatValue(data?.[r.key], r.type) }))
    .filter((r) => r.value !== null);
