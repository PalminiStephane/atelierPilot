import { useState, useMemo } from 'react';
import { InputField } from '../../ui/InputField';
import { SelectField } from '../../ui/SelectField';
import { ResultCard } from '../../ui/ResultCard';
import { calcVolume, calcWeight } from '../../../utils/calculations';
import { MATERIAUX } from '../../../utils/constants';
import type { WeightShape } from '../../../types';

const SHAPES: { value: WeightShape; label: string }[] = [
  { value: 'cylinder', label: 'Cylindre plein' },
  { value: 'tube', label: 'Tube creux' },
  { value: 'plate', label: 'Plaque' },
];

/** Calculateur de poids de pièce */
export function WeightCalculator() {
  const [shape, setShape] = useState<WeightShape>('cylinder');
  const [materialIdx, setMaterialIdx] = useState('0');
  const [diameter, setDiameter] = useState(0);
  const [innerDiameter, setInnerDiameter] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [thickness, setThickness] = useState(0);

  const material = MATERIAUX[parseInt(materialIdx)];

  const result = useMemo(() => {
    const vol = calcVolume(shape, { diameter, innerDiameter, length, width, thickness });
    if (vol <= 0) return null;
    return {
      volume: Math.round(vol * 100) / 100,
      weight: calcWeight(vol, material.densite),
    };
  }, [shape, diameter, innerDiameter, length, width, thickness, material]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        {SHAPES.map((s) => (
          <button
            key={s.value}
            onClick={() => setShape(s.value)}
            className="flex-1 px-2 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              backgroundColor: shape === s.value ? 'var(--accent-yellow)' : 'transparent',
              color: shape === s.value ? '#fff' : 'var(--text-muted)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <SelectField
        label="Matériau"
        value={materialIdx}
        onChange={setMaterialIdx}
        options={MATERIAUX.map((m, i) => ({ value: String(i), label: `${m.nom} (${m.densite} g/cm³)` }))}
      />

      {shape === 'cylinder' && (
        <>
          <InputField label="Diamètre" value={diameter || ''} onChange={setDiameter} unit="mm" />
          <InputField label="Longueur" value={length || ''} onChange={setLength} unit="mm" />
        </>
      )}
      {shape === 'tube' && (
        <>
          <InputField label="Diamètre extérieur" value={diameter || ''} onChange={setDiameter} unit="mm" />
          <InputField label="Diamètre intérieur" value={innerDiameter || ''} onChange={setInnerDiameter} unit="mm" />
          <InputField label="Longueur" value={length || ''} onChange={setLength} unit="mm" />
        </>
      )}
      {shape === 'plate' && (
        <>
          <InputField label="Longueur" value={length || ''} onChange={setLength} unit="mm" />
          <InputField label="Largeur" value={width || ''} onChange={setWidth} unit="mm" />
          <InputField label="Épaisseur" value={thickness || ''} onChange={setThickness} unit="mm" />
        </>
      )}

      {result && (
        <ResultCard label="Poids estimé" value={result.weight} unit="kg" color="var(--accent-yellow)" large />
      )}
    </div>
  );
}
