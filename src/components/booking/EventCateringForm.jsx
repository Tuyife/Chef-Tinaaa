import { useState } from 'react';
import { ArrowLeft, ArrowRight, UserRound, PartyPopper, Utensils, Sparkles, Wallet, ImageUp } from 'lucide-react';
import { validateService, CUISINES, makeSet, makeSetCustomer } from '../../lib/bookingServices.js';
import { Section, Row, TextInput, NumberInput, DateInput, TimeInput, SelectInput, TextareaInput, ChipSelect } from './fields.jsx';

const EVENT_TYPES = ['Birthday', 'Wedding', 'Anniversary', 'Corporate Event', 'Graduation', 'Private Party', 'Other'];
const SERVICE_STYLES = ['Buffet', 'Plated', 'Cocktail / Finger Foods', 'Full Service'];

export default function EventCateringForm({ data, setData, onBack, onSubmit }) {
  const [errors, setErrors] = useState({});
  const set = makeSet(data, setData);
  const setCustomer = makeSetCustomer(data, setData);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateService('event-catering', data);
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

      <Section icon={PartyPopper} title="Event Information">
        <Row>
          <TextInput label="Event Name" required value={data.eventName} onChange={set('eventName')} placeholder="e.g. Adaeze's Wedding" error={errors.eventName} />
          <SelectInput label="Event Type" required value={data.eventType} onChange={set('eventType')} options={EVENT_TYPES} error={errors.eventType} />
        </Row>
        <Row>
          <DateInput label="Event Date" required value={data.eventDate} onChange={set('eventDate')} error={errors.eventDate} />
          <NumberInput label="Number of Guests" required value={data.guests} onChange={set('guests')} placeholder="e.g. 120" error={errors.guests} />
        </Row>
        <Row>
          <TimeInput label="Start Time" required value={data.startTime} onChange={set('startTime')} error={errors.startTime} />
          <TimeInput label="End Time" required value={data.endTime} onChange={set('endTime')} error={errors.endTime} />
        </Row>
        <TextInput label="Event Venue" required value={data.eventVenue} onChange={set('eventVenue')} placeholder="Venue name and address" error={errors.eventVenue} />
      </Section>

      <Section icon={Utensils} title="Catering Details">
        <ChipSelect label="Service Style" options={SERVICE_STYLES} value={data.serviceStyle} onChange={set('serviceStyle')} error={errors.serviceStyle} />
      </Section>

      <Section icon={Sparkles} title="Food Requirements">
        <Row>
          <SelectInput label="Cuisine Preference" required value={data.cuisine} onChange={set('cuisine')} options={CUISINES} error={errors.cuisine} />
          <TextInput label="Menu Requirements" value={data.menuRequirements} onChange={set('menuRequirements')} placeholder="Specific dishes or menu notes" />
        </Row>
        <Row>
          <TextInput label="Dietary Requirements" value={data.dietaryRequirements} onChange={set('dietaryRequirements')} placeholder="Halal, vegetarian..." />
          <TextInput label="Allergies" value={data.allergies} onChange={set('allergies')} placeholder="Nuts, shellfish..." />
        </Row>
        <TextareaInput label="Special Requests" value={data.specialRequests} onChange={set('specialRequests')} rows={3} placeholder="Anything special for the day?" />
      </Section>

      <Section icon={Sparkles} title="Event Details">
        <TextareaInput label="Decoration Requirements" value={data.decorationRequirements} onChange={set('decorationRequirements')} rows={2} placeholder="Theme colors, centerpieces, setup..." />
        <Row>
          <TextInput label="Serving Staff Required" value={data.staffRequired} onChange={set('staffRequired')} placeholder="e.g. 6 waiters" />
          <TextInput label="Equipment Required" value={data.equipmentRequired} onChange={set('equipmentRequired')} placeholder="Chafing dishes, tents..." />
        </Row>
        <TextareaInput label="Special Instructions" value={data.specialInstructions} onChange={set('specialInstructions')} rows={2} placeholder="Timing, access or venue notes" />
      </Section>

      <Section icon={Wallet} title="Budget">
        <TextInput label="Estimated Budget" value={data.budget} onChange={set('budget')} placeholder="e.g. 1,000,000 – 2,000,000" />
      </Section>

      <Section icon={ImageUp} title="Inspiration (Optional)">
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(e) => setData({ ...data, referenceImage: e.target.files?.[0]?.name || '' })}
        />
        <span className="field-hint">Upload an event or inspiration image so we can match the style.</span>
      </Section>

      <div className="bw-form-foot">
        <button type="button" className="btn btn--outline" onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <button type="submit" className="btn btn--primary">Continue <ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
