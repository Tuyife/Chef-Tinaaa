import { asyncHandler, AppError } from '../utils/helpers.js';
import Service from '../models/Service.js';

export const getServices = asyncHandler(async (req, res) => {
  const onlyActive = req.query.all !== 'true';
  const filter = onlyActive ? { active: true } : {};
  const services = await Service.find(filter).sort({ createdAt: 1 });
  res.json({ services });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new AppError('Service not found', 404);
  res.json({ service });
});

const cleanMenu = (menu) =>
  Array.isArray(menu)
    ? menu
        .filter((m) => m && m.name)
        .map((m) => ({
          name: String(m.name).trim(),
          price: Number(m.price) || 0,
          cuisine: String(m.cuisine || '').trim(),
          image: String(m.image || '').trim(),
        }))
    : [];
export const createService = asyncHandler(async (req, res) => {
  const { name, description, image, price, active, slug, menu } = req.body;
  if (!name || !description) throw new AppError('Name and description are required', 400);
  const service = await Service.create({ name, description, image, price, active, slug, menu: cleanMenu(menu) });
  res.status(201).json({ service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new AppError('Service not found', 404);
  const { name, description, image, price, active, slug, menu } = req.body;
  if (name !== undefined) service.name = name;
  if (description !== undefined) service.description = description;
  if (image !== undefined) service.image = image;
  if (price !== undefined) service.price = price;
  if (active !== undefined) service.active = Boolean(active);
  if (slug !== undefined) service.slug = slug;
  if (menu !== undefined) {
    service.menu = cleanMenu(menu);
  }
  await service.save();
  res.json({ service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new AppError('Service not found', 404);
  res.json({ message: 'Service deleted' });
});
