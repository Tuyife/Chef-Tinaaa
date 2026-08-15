import { useState } from 'react';
import { ArrowLeft, ArrowRight, UserRound, CalendarDays, Utensils, Salad, ClipboardList, Truck } from 'lucide-react';
import { validateService, CUISINES, makeSet, makeSetCustomer } from '../../lib/bookingServices.js';
import { Section, Row, TextInput, NumberInput, DateInput, SelectInput, TextareaInput, ChipSelect } from './fields.jsx';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const PREP_PREFS = ['One-Time Preparation', 'Weekly Preparation', 'Custom Schedule'];

export default function MealPreparationForm({ data, setData, onBack, onSubmit }) {
  const [errors, setErrors] = useState({});
  const set = makeSet(data, setData);
  const setCustomer = makeSetCustomer(data, setData);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateService('meal-preparation', data);
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

      <Section icon={CalendarDays} title="Meal Plan">
        <Row>
          <DateInput label="Preferred Start Date" required value={data.startDate} onChange={set('startDate')} error={errors.startDate} />
          <NumberInput label="Number of Meals" required value={data.numberOfMeals} onChange={set('numberOfMeals')} placeholder="e.g. 10" error={errors.numberOfMeals} />
        </Row>
        <Row>
          <NumberInput label="Meals Per Day" required value={data.mealsPerDay} onChange={set('mealsPerDay')} placeholder="e.g. 2" error={errors.mealsPerDay} />
          <NumberInput label="Number of People" required value={data.numberOfPeople} onChange={set('numberOfPeople')} placeholder="e.g. 2" error={errors.numberOfPeople} />
        </Row>
      </Section>

      <Section icon={Utensils} title="Meal Preferences">
        <ChipSelect label="Meals You Want" multi options={MEAL_TYPES} value={data.mealTypes} onChange={set('mealTypes')} />
      </Section>

      <Section icon={Salad} title="Food Preferences">
        <SelectInput label="Preferred Cuisine" required value={data.cuisine} onChange={set('cuisine')} options={CUISINES} error={errors.cuisine} />
        <Row>
          <TextInput label="Foods You Like" value={data.foodsYouLike} onChange={set('foodsYouLike')} placeholder="Dishes and ingredients you enjoy" />
          <TextInput label="Foods You Avoid" value={data.foodsYouAvoid} onChange={set('foodsYouAvoid')} placeholder="Anything you don't eat" />
        </Row>
        <Row>
          <TextInput label="Dietary Requirements" value={data.dietaryRequirements} onChange={set('dietaryRequirements')} placeholder="Low-carb, high-protein..." />
          <TextInput label="Allergies" value={data.allergies} onChange={set('allergies')} placeholder="Nuts, dairy..." />
        </Row>
      </Section>

      <Section icon={ClipboardList} title="Preparation Preferences">
        <ChipSelect label="Schedule" options={PREP_PREFS} value={data.preparationPreference} onChange={set('preparationPreference')} />
      </Section>

      <Section icon={Truck} title="Delivery & Pickup">
        <Row>
          <ChipSelect label="Delivery Required?" options={['Yes', 'No']} value={data.deliveryRequired ? 'Yes' : data.deliveryRequired === false ? 'No' : ''} onChange={(v) => setData({ ...data, deliveryRequired: v === 'Yes' })} />
          <ChipSelect label="Pickup?" options={['Yes', 'No']} value={data.pickup ? 'Yes' : data.pickup === false ? 'No' : ''} onChange={(v) => setData({ ...data, pickup: v === 'Yes' })} />
        </Row>
        <TextareaInput label="Special Instructions" value={data.specialInstructions} onChange={set('specialInstructions')} rows={3} placeholder="Delivery address, access notes or preferences" />
      </Section>

      <div className="bw-form-foot">
        <button type="button" className="btn btn--outline" onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <button type="submit" className="btn btn--primary">Continue <ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
