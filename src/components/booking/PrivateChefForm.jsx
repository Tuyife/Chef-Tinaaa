import { useState } from 'react';
import { ArrowLeft, ArrowRight, UserRound, CalendarDays, Utensils, ConciergeBell, ImageUp } from 'lucide-react';
import { validateService, CUISINES, makeSet, makeSetCustomer } from '../../lib/bookingServices.js';
import { Section, Row, TextInput, NumberInput, DateInput, TimeInput, SelectInput, TextareaInput, ChipSelect } from './fields.jsx';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Special Dinner'];
const OCCASIONS = ['Dinner Party', 'Anniversary', 'Birthday', 'Date Night', 'Family Gathering', 'Business Meal', 'Other'];

export default function PrivateChefForm({ data, setData, onBack, onSubmit }) {
  const [errors, setErrors] = useState({});
  const set = makeSet(data, setData);
  const setCustomer = makeSetCustomer(data, setData);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateService('private-chef', data);
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

      <Section icon={CalendarDays} title="Experience Details">
        <Row>
          <DateInput label="Preferred Date" required value={data.preferredDate} onChange={set('preferredDate')} error={errors.preferredDate} />
          <TimeInput label="Preferred Time" required value={data.preferredTime} onChange={set('preferredTime')} error={errors.preferredTime} />
        </Row>
        <Row>
          <NumberInput label="Number of Guests" required value={data.guests} onChange={set('guests')} placeholder="e.g. 6" error={errors.guests} />
          <SelectInput label="Occasion" required value={data.occasion} onChange={set('occasion')} options={OCCASIONS} error={errors.occasion} />
        </Row>
        <TextInput label="Location" required value={data.location} onChange={set('location')} placeholder="City, venue or home address" error={errors.location} />
      </Section>

      <Section icon={Utensils} title="Food Preferences">
        <Row>
          <SelectInput label="Preferred Cuisine" required value={data.cuisine} onChange={set('cuisine')} options={CUISINES} error={errors.cuisine} />
          <NumberInput label="Number of Courses" required value={data.numberCourses} onChange={set('numberCourses')} placeholder="e.g. 4" error={errors.numberCourses} />
        </Row>
        <Row>
          <TextInput label="Dietary Requirements" value={data.dietaryRequirements} onChange={set('dietaryRequirements')} placeholder="Vegetarian, gluten-free..." />
          <TextInput label="Allergies" value={data.allergies} onChange={set('allergies')} placeholder="Nuts, shellfish..." />
        </Row>
        <TextareaInput label="Food Preferences" value={data.foodPreferences} onChange={set('foodPreferences')} rows={3} placeholder="Any dishes or flavours you love?" />
      </Section>

      <Section icon={ConciergeBell} title="Service Details">
        <ChipSelect label="Meal Type" options={MEAL_TYPES} value={data.mealType} onChange={set('mealType')} error={errors.mealType} />
        <TextareaInput label="Preferred Menu" value={data.preferredMenu} onChange={set('preferredMenu')} rows={3} placeholder="Menu ideas or dishes you would like served" />
        <TextareaInput label="Additional Requests" value={data.additionalRequests} onChange={set('additionalRequests')} rows={3} placeholder="Anything else Glory Catering Service should know?" />
      </Section>

      <Section icon={ImageUp} title="Inspiration (Optional)">
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(e) => setData({ ...data, referenceImage: e.target.files?.[0]?.name || '' })}
        />
        <span className="field-hint">Upload an inspiration or reference image so we can match the style.</span>
      </Section>

      <div className="bw-form-foot">
        <button type="button" className="btn btn--outline" onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <button type="submit" className="btn btn--primary">Continue <ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
