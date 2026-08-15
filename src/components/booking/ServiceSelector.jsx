import { Check } from 'lucide-react';
import { SERVICES } from '../../lib/bookingServices.js';

export default function ServiceSelector({ value, onSelect }) {
  return (
    <div className="service-selector">
      {SERVICES.map((s) => {
        const Icon = s.icon;
        const selected = value === s.slug;
        return (
          <button
            type="button"
            key={s.slug}
            className={`service-option ${selected ? 'active' : ''}`}
            onClick={() => onSelect(s.slug)}
            aria-pressed={selected}
          >
            <span className="service-option-icon"><Icon size={24} aria-hidden="true" /></span>
            <span className="service-option-body">
              <strong>{s.name}</strong>
              <span>{s.tagline}</span>
            </span>
            <span className="service-option-check">{selected && <Check size={16} />}</span>
          </button>
        );
      })}
    </div>
  );
}
