import { useState } from 'react';
import { ArrowLeft, ArrowRight, UserRound, CalendarDays, BookOpen, UtensilsCrossed, Palette, Wallet } from 'lucide-react';
import { validateService, CUISINES, makeSet, makeSetCustomer } from '../../lib/bookingServices.js';
import { Section, Row, TextInput, NumberInput, DateInput, SelectInput, TextareaInput, ChipSelect } from './fields.jsx';

const OCCASIONS = ['Birthday', 'Wedding', 'Anniversary', 'Corporate Event', 'Dinner Party', 'Private Party', 'Other'];
const COURSES = ['Starter', 'Main Course', 'Side Dish', 'Dessert', 'Drinks'];

export default function MenuPlanningForm({ data, setData, onBack, onSubmit }) {
  const [errors, setErrors] = useState({});
  const set = makeSet(data, setData);
  const setCustomer = makeSetCustomer(data, setData);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateService('menu-planning', data);
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

      <Section icon={CalendarDays} title="Menu Details">
        <Row>
          <SelectInput label="Occasion" required value={data.occasion} onChange={set('occasion')} options={OCCASIONS} error={errors.occasion} />
          <DateInput label="Event Date" required value={data.eventDate} onChange={set('eventDate')} error={errors.eventDate} />
        </Row>
        <Row>
          <NumberInput label="Number of Guests" required value={data.guests} onChange={set('guests')} placeholder="e.g. 10" error={errors.guests} />
          <NumberInput label="Number of Courses" required value={data.numberCourses} onChange={set('numberCourses')} placeholder="e.g. 4" error={errors.numberCourses} />
        </Row>
        <SelectInput label="Cuisine Preference" required value={data.cuisinePreference} onChange={set('cuisinePreference')} options={CUISINES} error={errors.cuisinePreference} />
      </Section>

      <Section icon={UtensilsCrossed} title="Course Requirements">
        <ChipSelect label="Courses to Include" multi options={COURSES} value={data.courses} onChange={set('courses')} />
      </Section>

      <Section icon={BookOpen} title="Preferences">
        <Row>
          <TextInput label="Dietary Requirements" value={data.dietaryRequirements} onChange={set('dietaryRequirements')} placeholder="Vegetarian, halal..." />
          <TextInput label="Allergies" value={data.allergies} onChange={set('allergies')} placeholder="Nuts, dairy..." />
        </Row>
        <Row>
          <TextInput label="Foods to Avoid" value={data.foodsToAvoid} onChange={set('foodsToAvoid')} placeholder="Anything excluded" />
          <TextInput label="Preferred Ingredients" value={data.preferredIngredients} onChange={set('preferredIngredients')} placeholder="Must-have ingredients" />
        </Row>
      </Section>

      <Section icon={Palette} title="Theme">
        <TextInput label="Theme" value={data.theme} onChange={set('theme')} placeholder="e.g. Modern Nigerian, Rustic Italian" />
      </Section>

      <Section icon={Wallet} title="Budget">
        <TextInput label="Budget Range" value={data.budgetRange} onChange={set('budgetRange')} placeholder="e.g. 100,000 – 200,000" />
        <TextareaInput label="Special Instructions" value={data.specialInstructions} onChange={set('specialInstructions')} rows={3} placeholder="Anything else to consider?" />
      </Section>

      <div className="bw-form-foot">
        <button type="button" className="btn btn--outline" onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <button type="submit" className="btn btn--primary">Continue <ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
