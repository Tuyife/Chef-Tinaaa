import { useState } from 'react';
import { ArrowLeft, ArrowRight, UserRound, CalendarDays, Croissant, Utensils, Wallet } from 'lucide-react';
import { validateService, CUISINES, makeSet, makeSetCustomer } from '../../lib/bookingServices.js';
import { Section, Row, TextInput, NumberInput, DateInput, TimeInput, SelectInput, TextareaInput, ChipSelect } from './fields.jsx';

const EVENT_TYPES = ['Birthday', 'Wedding', 'Anniversary', 'Corporate Event', 'Graduation', 'Private Party', 'Other'];
const CATERING_TYPES = ['Buffet', 'Plated Service', 'Finger Foods', 'Mixed Catering'];

export default function CateringForm({ data, setData, onBack, onSubmit }) {
  const [errors, setErrors] = useState({});
  const set = makeSet(data, setData);
  const setCustomer = makeSetCustomer(data, setData);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateService('catering', data);
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

      <Section icon={CalendarDays} title="Event Information">
        <Row>
          <SelectInput label="Event Type" required value={data.eventType} onChange={set('eventType')} options={EVENT_TYPES} error={errors.eventType} />
          <DateInput label="Event Date" required value={data.eventDate} onChange={set('eventDate')} error={errors.eventDate} />
        </Row>
        <Row>
          <TimeInput label="Event Time" required value={data.eventTime} onChange={set('eventTime')} error={errors.eventTime} />
          <NumberInput label="Number of Guests" required value={data.guests} onChange={set('guests')} placeholder="e.g. 50" error={errors.guests} />
        </Row>
        <TextInput label="Event Location" required value={data.eventLocation} onChange={set('eventLocation')} placeholder="Venue, hall or home address" error={errors.eventLocation} />
      </Section>

      <Section icon={Croissant} title="Catering Details">
        <ChipSelect label="Type of Catering" options={CATERING_TYPES} value={data.cateringType} onChange={set('cateringType')} error={errors.cateringType} />
      </Section>

      <Section icon={Utensils} title="Food Details">
        <Row>
          <SelectInput label="Preferred Cuisine" required value={data.cuisine} onChange={set('cuisine')} options={CUISINES} error={errors.cuisine} />
          <TextInput label="Menu Preferences" value={data.menuPreferences} onChange={set('menuPreferences')} placeholder="Specific dishes you want" />
        </Row>
        <Row>
          <TextInput label="Dietary Requirements" value={data.dietaryRequirements} onChange={set('dietaryRequirements')} placeholder="Halal, vegetarian..." />
          <TextInput label="Allergies" value={data.allergies} onChange={set('allergies')} placeholder="Nuts, dairy..." />
        </Row>
      </Section>

      <Section icon={Wallet} title="Additional">
        <TextInput label="Estimated Budget" value={data.budget} onChange={set('budget')} placeholder="e.g. 300,000 – 500,000" />
        <TextareaInput label="Special Instructions" value={data.specialInstructions} onChange={set('specialInstructions')} rows={3} placeholder="Setup, timing or service notes" />
        <TextareaInput label="Additional Requests" value={data.additionalRequests} onChange={set('additionalRequests')} rows={3} placeholder="Anything else we should know?" />
      </Section>

      <div className="bw-form-foot">
        <button type="button" className="btn btn--outline" onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <button type="submit" className="btn btn--primary">Continue <ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
