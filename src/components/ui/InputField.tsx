import { useId } from 'react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
}

/** Champ numérique avec label et unité, optimisé pour l'atelier */
export function InputField({ label, value, onChange, unit, min = 0, step = 0.01, placeholder, disabled }: InputFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-12 px-3 rounded-lg font-mono text-base outline-none transition-colors"
          style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        {unit && (
          <span
            className="absolute right-3 text-sm font-mono pointer-events-none"
            style={{ color: 'var(--text-dim)' }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
