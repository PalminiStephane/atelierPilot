import { useState } from 'react';
import { InputField } from '../../ui/InputField';
import { mmToInch, inchToMm, degToRad } from '../../../utils/calculations';
import { FRACTIONS_IMPERIALES } from '../../../utils/constants';

/** Convertisseur d'unités : mm/pouces, degrés/radians, fractions impériales */
export function UnitConverter() {
  const [mm, setMm] = useState(0);
  const [inches, setInches] = useState(0);
  const [deg, setDeg] = useState(0);

  const handleMm = (v: number) => {
    setMm(v);
    setInches(mmToInch(v));
  };

  const handleInches = (v: number) => {
    setInches(v);
    setMm(inchToMm(v));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* mm ↔ pouces */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading font-bold text-sm" style={{ color: 'var(--accent-yellow)' }}>
          Millimètres ↔ Pouces
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="mm" value={mm || ''} onChange={handleMm} unit="mm" />
          <InputField label="Pouces" value={inches || ''} onChange={handleInches} unit="in" />
        </div>
      </div>

      {/* Degrés → Radians */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading font-bold text-sm" style={{ color: 'var(--accent-yellow)' }}>
          Degrés → Radians
        </h3>
        <InputField label="Degrés" value={deg || ''} onChange={setDeg} unit="°" />
        {deg > 0 && (
          <div
            className="rounded-lg p-3 text-center font-mono text-xl font-bold"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--accent-yellow)' }}
          >
            {degToRad(deg)} rad
          </div>
        )}
      </div>

      {/* Fractions impériales */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading font-bold text-sm" style={{ color: 'var(--accent-yellow)' }}>
          Fractions impériales
        </h3>
        <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-card)' }}>
                <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--text-muted)' }}>Fraction</th>
                <th className="px-3 py-2 text-right font-medium" style={{ color: 'var(--accent-yellow)' }}>mm</th>
              </tr>
            </thead>
            <tbody>
              {FRACTIONS_IMPERIALES.map((f) => (
                <tr key={f.fraction} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="px-3 py-1.5 font-mono" style={{ color: 'var(--text-primary)' }}>{f.fraction}</td>
                  <td className="px-3 py-1.5 text-right font-mono" style={{ color: 'var(--accent-yellow)' }}>{f.mm.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
