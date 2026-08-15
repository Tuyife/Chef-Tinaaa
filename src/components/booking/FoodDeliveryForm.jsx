import { useState } from 'react';
import { ArrowLeft, ArrowRight, UserRound, Bike, Utensils, MapPin, Minus, Plus } from 'lucide-react';
import { validateService, CUISINES, makeSet, makeSetCustomer } from '../../lib/bookingServices.js';
import { Section, Row, TextInput, NumberInput, DateInput, TimeInput, SelectInput, TextareaInput } from './fields.jsx';
import { formatMoney } from '../../lib/api.js';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function FoodDeliveryForm({ data, setData, services = [], onBack, onSubmit }) {
  const [errors, setErrors] = useState({});
  const set = makeSet(data, setData);
  const setCustomer = makeSetCustomer(data, setData);

  const foodService = services.find((s) => s.slug === 'food-delivery');
  const menu = foodService?.menu || [];
  const cuisineMenu = data.cuisine ? menu.filter((m) => !m.cuisine || m.cuisine === data.cuisine) : menu;

  const qtyFor = (name) => data.items.find((i) => i.name === name)?.qty || 0;

  const setQty = (name, qty) => {
    const q = Math.max(0, Math.floor(Number(qty) || 0));
    const next = data.items.filter((i) => i.name !== name);
    if (q > 0) next.push({ name, qty: q });
    setData({ ...data, items: next });
  };

  const setCuisine = (value) => {
    set('cuisine')(value);
    setData({ ...data, cuisine: value, items: [] });
  };

  const total = cuisineMenu.reduce((sum, m) => sum + (Number(m.price) || 0) * qtyFor(m.name), 0);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateService('food-delivery', data);
    if (menu.length === 0) delete errs.items;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit();
  };

  return (
    <form className="bw-form" onSubmit={submit} noValidate>
      <Section icon={UserRound} title="Customer Information">
        <Row>
          <TextInput label="Full Name" required value={data.customer.name} onChange={setCustomer('name')} placeholder="Your full name" error={errors['customer.name']} />
          <TextInput label="Email" required type="email" value={data.customer.email} onChange={setCustomer('email')} placeholder="you@email.com" error={errors['customer.email']} />
        </Row>
        <TextInput label="Phone Number" required value={data.customer.phone} onChange={setCustomer('phone')} placeholder="+234 ..." error={errors['customer.phone']} />
      </Section>

      <Section icon={Bike} title="Order Details">
        <Row>
          <DateInput label="Delivery Date" required value={data.deliveryDate} onChange={set('deliveryDate')} error={errors.deliveryDate} />
          <TimeInput label="Preferred Delivery Time" required value={data.deliveryTime} onChange={set('deliveryTime')} error={errors.deliveryTime} />
        </Row>
        <Row>
          <SelectInput label="Meal Type" required value={data.mealType} onChange={set('mealType')} options={MEAL_TYPES} error={errors.mealType} />
          <SelectInput label="Cuisine" required value={data.cuisine} onChange={setCuisine} options={CUISINES} error={errors.cuisine} />
        </Row>
        <NumberInput label="Number of Meals" required value={data.numberOfMeals} onChange={set('numberOfMeals')} placeholder="e.g. 10" error={errors.numberOfMeals} />
      </Section>

      {menu.length > 0 ? (
        <Section icon={Utensils} title="Select Your Meals">
          <p className="field-hint">Choose how many of each meal you'd like — you can adjust the quantities.</p>
          {cuisineMenu.length > 0 ? (
            <>
              <div className={`fd-menu ${errors.items ? 'has-error' : ''}`}>
                {cuisineMenu.map((m) => {
                  const qty = qtyFor(m.name);
                  return (
                    <div className="fd-item" key={m.name}>
                      <img
                        className="fd-item-img"
                        src={m.image || '/images/food-bowl.jpg'}
                        alt={m.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = '/images/food-bowl.jpg'; }}
                      />
                      <div className="fd-item-name">
                        <strong>{m.name}</strong>
                        <span>{formatMoney(m.price)}</span>
                      </div>
                      <div className="fd-qty">
                        <button type="button" className="fd-qty-btn" onClick={() => setQty(m.name, qty - 1)} disabled={qty === 0} aria-label={`Remove ${m.name}`}>
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => setQty(m.name, e.target.value)}
                          aria-label={`Quantity of ${m.name}`}
                        />
                        <button type="button" className="fd-qty-btn" onClick={() => setQty(m.name, qty + 1)} aria-label={`Add ${m.name}`}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.items && <span className="field-error">{errors.items}</span>}
              <div className="fd-total">
                <span>Estimated Total</span>
                <strong>{formatMoney(total)}</strong>
              </div>
            </>
          ) : (
            <p className="field-hint">No meals listed for {data.cuisine} yet — try a different cuisine above.</p>
          )}
        </Section>
      ) : (
        <Section icon={Utensils} title="Select Your Meals">
          <p className="field-hint">The menu is being prepared — please describe what you'd like in the preferences below.</p>
        </Section>
      )}

      <Section icon={Utensils} title="Meal Preferences">
        <TextInput label="Meal Preference" value={data.mealPreference} onChange={set('mealPreference')} placeholder="e.g. Jollof & Chicken" />
        <Row>
          <TextInput label="Dietary Requirements" value={data.dietaryRequirements} onChange={set('dietaryRequirements')} placeholder="Vegetarian, halal..." />
          <TextInput label="Allergies" value={data.allergies} onChange={set('allergies')} placeholder="Nuts, shellfish..." />
        </Row>
      </Section>

      <Section icon={MapPin} title="Delivery Details">
        <TextInput label="Delivery Address" required value={data.deliveryAddress} onChange={set('deliveryAddress')} placeholder="House number, street, city" error={errors.deliveryAddress} />
        <Row>
          <TextInput label="Landmark" value={data.landmark} onChange={set('landmark')} placeholder="Near a known landmark" />
          <TextInput label="Delivery Instructions" value={data.deliveryInstructions} onChange={set('deliveryInstructions')} placeholder="Gate code, call on arrival..." />
        </Row>
      </Section>

      <Section icon={Utensils} title="Additional">
        <TextareaInput label="Special Requests" value={data.specialRequests} onChange={set('specialRequests')} rows={3} placeholder="Portion notes, packaging, timing..." />
      </Section>

      <div className="bw-form-foot">
        <button type="button" className="btn btn--outline" onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <button type="submit" className="btn btn--primary">Continue <ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
