import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutList, FileText, ClipboardCheck, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import { api, addGuestToken } from '../../lib/api.js';
import { SERVICES, serviceLabel, defaultServiceData } from '../../lib/bookingServices.js';
import ServiceSelector from './ServiceSelector.jsx';
import PrivateChefForm from './PrivateChefForm.jsx';
import CateringForm from './CateringForm.jsx';
import EventCateringForm from './EventCateringForm.jsx';
import MealPreparationForm from './MealPreparationForm.jsx';
import MenuPlanningForm from './MenuPlanningForm.jsx';
import FoodDeliveryForm from './FoodDeliveryForm.jsx';
import BookingSummary from './BookingSummary.jsx';
import BookingConfirmation from './BookingConfirmation.jsx';

const STEPS = [
  { key: 'service', label: 'Service', icon: LayoutList },
  { key: 'details', label: 'Details', icon: FileText },
  { key: 'review', label: 'Review', icon: ClipboardCheck },
  { key: 'confirm', label: 'Confirmation', icon: CheckCircle2 },
];

const STEP_INDEX = { service: 0, details: 1, review: 2, confirm: 3 };

const FORMS = {
  'private-chef': PrivateChefForm,
  catering: CateringForm,
  'event-catering': EventCateringForm,
  'meal-preparation': MealPreparationForm,
  'menu-planning': MenuPlanningForm,
  'food-delivery': FoodDeliveryForm,
};

export default function BookingWizard({ user }) {
  const location = useLocation();
  const topRef = useRef(null);

  const [services, setServices] = useState([]);
  // Preselect a service once, when arriving with a service in navigation state.
  const [initial] = useState(() => {
    const wanted = location.state?.service;
    if (!wanted) return null;
    return SERVICES.find((s) => s.name === wanted || s.slug === wanted) || null;
  });
  const [step, setStep] = useState(() => (initial ? 'details' : 'service'));
  const [slug, setSlug] = useState(() => (initial ? initial.slug : ''));
  const [data, setData] = useState(() => (initial ? defaultServiceData(initial.slug) : null));
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api('/services').then((d) => setServices(d.services)).catch(() => {});
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const selectService = (s) => {
    setSlug(s);
    setData(defaultServiceData(s));
    setError('');
    setStep('details');
  };

  const backToService = () => {
    setStep('service');
    setSlug('');
    setData(null);
    setError('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const svc = services.find((s) => s.name === serviceLabel(slug));
      const { booking: created } = await api('/bookings', {
        method: 'POST',
        body: {
          service: svc?._id || null,
          serviceType: slug,
          serviceName: serviceLabel(slug),
          serviceDetails: data,
        },
      });
      if (!user) addGuestToken(created.guestToken);
      setBooking(created);
      setStep('confirm');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const currentIndex = STEP_INDEX[step];
  const ActiveForm = FORMS[slug];

  return (
    <div className="bw" ref={topRef}>
      <ol className="bw-steps" aria-label="Booking progress">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={s.key} className={`${active ? 'active' : ''} ${done ? 'done' : ''}`} aria-current={active ? 'step' : undefined}>
              <span className="bw-step-icon">{done ? <CheckCircle2 size={18} /> : <Icon size={18} />}</span>
              <span className="bw-step-label">{s.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="bw-card card">
        {step === 'service' && (
          <div className="bw-step-body">
            <div className="bw-heading">
              <p className="eyebrow">Step 1 — Choose Your Experience</p>
              <h2>Which service do you need?</h2>
              <p>Select a service and we’ll ask you for exactly the details needed to prepare it.</p>
            </div>
            <ServiceSelector value={slug} onSelect={selectService} />
          </div>
        )}

        {step === 'details' && ActiveForm && (
          <div className="bw-step-body">
            <div className="bw-heading">
              <p className="eyebrow">Step 2 — {serviceLabel(slug)} Details</p>
              <h2>Tell us what you need</h2>
            </div>
            <ActiveForm data={data} setData={setData} onBack={backToService} onSubmit={() => { setError(''); setStep('review'); }} services={services} />
          </div>
        )}

        {step === 'review' && (
          <div className="bw-step-body">
            <div className="bw-heading">
              <p className="eyebrow">Step 3 — Review</p>
            </div>
            <BookingSummary
              slug={slug}
              data={data}
              onBack={() => setStep('details')}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
            />
          </div>
        )}

        {step === 'confirm' && booking && (
          <div className="bw-step-body">
            <BookingConfirmation booking={booking} user={user} />
            <div className="bw-confirm-again">
              <button type="button" className="btn btn--outline" onClick={() => { setBooking(null); setSlug(''); setData(null); setStep('service'); }}>
                <Sparkles size={16} /> Book Another Service
              </button>
            </div>
          </div>
        )}

        {step === 'service' && (
          <div className="bw-foot-note">
            <Link to="/services" className="back-link"><ArrowLeft size={15} /> View all services</Link>
          </div>
        )}
      </div>
    </div>
  );
}
