// One-off migration: sync the Food Delivery menu on an existing database.
//   - Assigns a cuisine to any meal missing one (matched by name against the canonical menu).
//   - Adds meals from the canonical menu that aren't present yet (more cuisines).
//   - Preserves meals the admin added manually (not in the canonical list).
//
// Run with: node migrate-menus.js   (from the server/ directory)
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Service from './models/Service.js';
import { FOOD_MENU } from './data/foodMenu.js';

const key = (n) => String(n || '').trim().toLowerCase();
const canonical = new Map(FOOD_MENU.map((m) => [key(m.name), m]));

const run = async () => {
  await connectDB();

  const svc = await Service.findOne({ slug: 'food-delivery' });
  if (!svc) {
    console.log('[migrate] No Food Delivery service found — run `npm run seed` first.');
    await mongoose.disconnect();
    return;
  }

  const existing = new Map((svc.menu || []).map((m) => [key(m.name), m]));
  const merged = [];
  const seen = new Set();

  for (const item of FOOD_MENU) {
    seen.add(key(item.name));
    const cur = existing.get(key(item.name));
    if (cur) {
      merged.push({
        name: cur.name,
        price: cur.price ?? item.price,
        cuisine: cur.cuisine?.trim() || item.cuisine,
        image: item.image || cur.image?.trim() || '',
      });
    } else {
      merged.push({ ...item });
    }
  }

  let added = 0;
  let assigned = 0;
  for (const m of svc.menu || []) {
    if (seen.has(key(m.name))) continue;
    const canon = canonical.get(key(m.name));
    merged.push({
      name: m.name,
      price: m.price ?? 0,
      cuisine: m.cuisine?.trim() || canon?.cuisine || '',
      image: m.image?.trim() || canon?.image || '',
    });
    added += 1;
  }

  // Count cuisines that were filled in for previously blank items.
  assigned = merged.filter((m) => canonical.has(key(m.name))).length;

  const missingImages = merged.filter((m) => !m.image).length;
  if (missingImages) console.log(`[migrate] Warning: ${missingImages} meal(s) still missing an image.`);

  svc.menu = merged;
  await svc.save();

  const cuisines = [...new Set(merged.map((m) => m.cuisine).filter(Boolean))];
  console.log(`[migrate] Food Delivery menu synced: ${merged.length} meals across ${cuisines.length} cuisines.`);
  console.log(`[migrate] Cuisines: ${cuisines.join(', ')}`);
  if (added) console.log(`[migrate] Preserved ${added} admin-added meal(s).`);

  await mongoose.disconnect();
  console.log('[migrate] Done.');
};

run().catch((err) => {
  console.error('[migrate] Failed:', err.message);
  process.exit(1);
});
