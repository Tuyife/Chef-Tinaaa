import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { getSavedTheme, applyTheme, resolveTheme } from '../lib/theme.js';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function ThemeToggle() {
  const [pref, setPref] = useState(getSavedTheme);
  const [resolved, setResolved] = useState(() => resolveTheme(pref));
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    applyTheme(pref);
    // Applied once on mount; the boot script in index.html already set the initial theme.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolved(applyTheme('system'));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (value) => {
    setPref(value);
    setResolved(applyTheme(value));
    setOpen(false);
  };

  const TriggerIcon = resolved === 'dark' ? Moon : Sun;

  return (
    <div className="theme-toggle" ref={ref}>
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Color theme, currently ${resolved}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Theme: ${resolved}`}
      >
        <TriggerIcon size={17} />
      </button>
      {open && (
        <div className="theme-menu" role="menu">
          {OPTIONS.map((o) => {
            const Icon = o.icon;
            const active = pref === o.value;
            return (
              <button
                type="button"
                key={o.value}
                role="menuitemradio"
                aria-checked={active}
                className={active ? 'active' : ''}
                onClick={() => select(o.value)}
              >
                <Icon size={16} />
                <span>{o.label}</span>
                {active && <Check className="check" size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
