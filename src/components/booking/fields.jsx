import { useId } from 'react';

export function Section({ icon: Icon, title, children }) {
  return (
    <div className="bw-section">
      <h4 className="bw-section-title">
        {Icon && <Icon size={16} aria-hidden="true" />}
        <span>{title}</span>
      </h4>
      <div className="bw-section-body">{children}</div>
    </div>
  );
}

export function Row({ children }) {
  return <div className="field field--row">{children}</div>;
}

function Err({ error }) {
  if (!error) return null;
  return <span className="field-error">{error}</span>;
}

function Label({ label, required, htmlFor }) {
  if (!label) return null;
  return (
    <label className="label" htmlFor={htmlFor}>
      {label}
      {required && <span className="req"> *</span>}
    </label>
  );
}

export function TextInput({ label, required, value, onChange, placeholder, type = 'text', error }) {
  const id = useId();
  return (
    <div className="field">
      <Label label={label} required={required} htmlFor={id} />
      <input
        id={id}
        className="input"
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <Err error={error} />
    </div>
  );
}

export function NumberInput({ label, required, value, onChange, placeholder, min = 1, error }) {
  const id = useId();
  return (
    <div className="field">
      <Label label={label} required={required} htmlFor={id} />
      <input
        id={id}
        className="input"
        type="number"
        min={min}
        inputMode="numeric"
        value={value ?? ''}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <Err error={error} />
    </div>
  );
}

export function DateInput({ label, required, value, onChange, error }) {
  const id = useId();
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="field">
      <Label label={label} required={required} htmlFor={id} />
      <input
        id={id}
        className="input"
        type="date"
        min={today}
        value={value ?? ''}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <Err error={error} />
    </div>
  );
}

export function TimeInput({ label, required, value, onChange, error }) {
  const id = useId();
  return (
    <div className="field">
      <Label label={label} required={required} htmlFor={id} />
      <input
        id={id}
        className="input"
        type="time"
        value={value ?? ''}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <Err error={error} />
    </div>
  );
}

export function SelectInput({ label, required, value, onChange, options, placeholder = 'Select...', error }) {
  const id = useId();
  return (
    <div className="field">
      <Label label={label} required={required} htmlFor={id} />
      <select
        id={id}
        className="input"
        value={value ?? ''}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <Err error={error} />
    </div>
  );
}

export function TextareaInput({ label, required, value, onChange, rows = 4, placeholder, error }) {
  const id = useId();
  return (
    <div className="field">
      <Label label={label} required={required} htmlFor={id} />
      <textarea
        id={id}
        className="input"
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <Err error={error} />
    </div>
  );
}

// Pill-style single or multi select for small option lists.
export function ChipSelect({ label, options, value, onChange, multi = false, error }) {
  const toggle = (opt) => {
    if (!multi) {
      onChange(value === opt ? '' : opt);
      return;
    }
    const list = Array.isArray(value) ? value : [];
    onChange(list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt]);
  };
  const selected = multi ? (Array.isArray(value) ? value : []) : value;
  return (
    <div className="field">
      {label && <span className="label">{label}</span>}
      <div className={`chip-group ${error ? 'has-error' : ''}`} role="group">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            className={`chip ${(multi ? selected.includes(opt) : selected === opt) ? 'active' : ''}`}
            aria-pressed={multi ? selected.includes(opt) : selected === opt}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <Err error={error} />
    </div>
  );
}
