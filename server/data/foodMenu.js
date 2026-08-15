// Canonical Food Delivery menu — used by seed.js and migrate-menus.js so existing
// databases can be synced to the same set of meals + cuisines + images.
// Images are stable, locally-served photos under /images/menu/, one per meal.

const slug = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const img = (name) => `/images/menu/${slug(name)}.jpg`;

export const FOOD_MENU = [
  // Nigerian
  { name: 'Jollof Rice & Chicken', price: 3500, cuisine: 'Nigerian', image: img('Jollof Rice & Chicken') },
  { name: 'Fried Rice & Chicken', price: 3500, cuisine: 'Nigerian', image: img('Fried Rice & Chicken') },
  { name: 'White Rice & Stew', price: 3000, cuisine: 'Nigerian', image: img('White Rice & Stew') },
  { name: 'Jollof Rice & Turkey', price: 4500, cuisine: 'Nigerian', image: img('Jollof Rice & Turkey') },
  { name: 'Spaghetti & Beef', price: 3500, cuisine: 'Nigerian', image: img('Spaghetti & Beef') },
  { name: 'Beans & Plantain', price: 2500, cuisine: 'Nigerian', image: img('Beans & Plantain') },
  { name: 'Pounded Yam & Egusi', price: 5000, cuisine: 'Nigerian', image: img('Pounded Yam & Egusi') },
  { name: 'Amala & Ewedu', price: 3500, cuisine: 'Nigerian', image: img('Amala & Ewedu') },
  // African
  { name: 'Ghana Jollof & Chicken', price: 4000, cuisine: 'African', image: img('Ghana Jollof & Chicken') },
  { name: 'Moin Moin', price: 2000, cuisine: 'African', image: img('Moin Moin') },
  { name: 'Peppered Snail', price: 6000, cuisine: 'African', image: img('Peppered Snail') },
  { name: 'Suya & Jollof Rice', price: 4500, cuisine: 'African', image: img('Suya & Jollof Rice') },
  // Continental
  { name: 'Grilled Chicken & Fries', price: 4500, cuisine: 'Continental', image: img('Grilled Chicken & Fries') },
  { name: 'Fish & Chips', price: 4500, cuisine: 'Continental', image: img('Fish & Chips') },
  { name: 'BBQ Ribs', price: 7000, cuisine: 'Continental', image: img('BBQ Ribs') },
  // Intercontinental
  { name: 'Asian Noodle Bowl', price: 5000, cuisine: 'Intercontinental', image: img('Asian Noodle Bowl') },
  { name: 'Seafood Paella', price: 7000, cuisine: 'Intercontinental', image: img('Seafood Paella') },
  { name: 'Steak & Fries', price: 8000, cuisine: 'Intercontinental', image: img('Steak & Fries') },
  // Italian
  { name: 'Spaghetti Bolognese', price: 4000, cuisine: 'Italian', image: img('Spaghetti Bolognese') },
  { name: 'Chicken Alfredo Pasta', price: 5000, cuisine: 'Italian', image: img('Chicken Alfredo Pasta') },
  { name: 'Margherita Pizza', price: 6000, cuisine: 'Italian', image: img('Margherita Pizza') },
  // Chinese
  { name: 'Chicken Fried Rice', price: 4000, cuisine: 'Chinese', image: img('Chicken Fried Rice') },
  { name: 'Beef Chow Mein', price: 4500, cuisine: 'Chinese', image: img('Beef Chow Mein') },
  { name: 'Sweet & Sour Chicken', price: 5000, cuisine: 'Chinese', image: img('Sweet & Sour Chicken') },
  { name: 'Spring Rolls', price: 2500, cuisine: 'Chinese', image: img('Spring Rolls') },
  // Indian
  { name: 'Butter Chicken', price: 4500, cuisine: 'Indian', image: img('Butter Chicken') },
  { name: 'Chicken Biryani', price: 5000, cuisine: 'Indian', image: img('Chicken Biryani') },
  { name: 'Vegetable Curry', price: 4000, cuisine: 'Indian', image: img('Vegetable Curry') },
  // Mediterranean
  { name: 'Greek Salad', price: 4000, cuisine: 'Mediterranean', image: img('Greek Salad') },
  { name: 'Chicken Shawarma Plate', price: 5000, cuisine: 'Mediterranean', image: img('Chicken Shawarma Plate') },
  { name: 'Hummus & Pita', price: 3500, cuisine: 'Mediterranean', image: img('Hummus & Pita') },
  // French
  { name: 'Coq au Vin', price: 6500, cuisine: 'French', image: img('Coq au Vin') },
  { name: 'Ratatouille', price: 5000, cuisine: 'French', image: img('Ratatouille') },
  { name: 'Crème Brûlée', price: 3500, cuisine: 'French', image: img('Crème Brûlée') },
  // Mexican
  { name: 'Chicken Tacos', price: 4500, cuisine: 'Mexican', image: img('Chicken Tacos') },
  { name: 'Beef Burrito', price: 5500, cuisine: 'Mexican', image: img('Beef Burrito') },
  { name: 'Quesadilla', price: 4500, cuisine: 'Mexican', image: img('Quesadilla') },
  // Japanese
  { name: 'Chicken Teriyaki Bowl', price: 5000, cuisine: 'Japanese', image: img('Chicken Teriyaki Bowl') },
  { name: 'Salmon Sushi Set', price: 6500, cuisine: 'Japanese', image: img('Salmon Sushi Set') },
  { name: 'Ramen Bowl', price: 6000, cuisine: 'Japanese', image: img('Ramen Bowl') },
  // Seafood
  { name: 'Grilled Fish & Rice', price: 5000, cuisine: 'Seafood', image: img('Grilled Fish & Rice') },
  { name: 'Prawn Jollof', price: 5500, cuisine: 'Seafood', image: img('Prawn Jollof') },
  { name: 'Catfish Pepper Soup', price: 5500, cuisine: 'Seafood', image: img('Catfish Pepper Soup') },
  // Vegetarian
  { name: 'Veggie Fried Rice', price: 3500, cuisine: 'Vegetarian', image: img('Veggie Fried Rice') },
  { name: 'Chickpea Curry', price: 4000, cuisine: 'Vegetarian', image: img('Chickpea Curry') },
  { name: 'Garden Salad Wrap', price: 3500, cuisine: 'Vegetarian', image: img('Garden Salad Wrap') },
  // Other
  { name: "Chef's Signature Platter", price: 6000, cuisine: 'Other', image: img("Chef's Signature Platter") },
  { name: 'Family Sharing Box', price: 9000, cuisine: 'Other', image: img('Family Sharing Box') },
  { name: 'Weekly Special', price: 4500, cuisine: 'Other', image: img('Weekly Special') },
  { name: 'Tuyife Consult Special', price: 5000, cuisine: 'Other', image: img('Tuyife Consult Special') },
];
