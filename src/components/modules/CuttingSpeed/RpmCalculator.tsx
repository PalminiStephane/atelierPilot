import { useState, useMemo } from 'react';
import { InputField } from '../../ui/InputField';
import { SelectField } from '../../ui/SelectField';
import { ResultCard } from '../../ui/ResultCard';
import { calcRPM } from '../../../utils/calculations';
import { MATERIAUX } from '../../../utils/constants';
import type { ToolType } from '../../../types';

/** Calculateur RPM : Vc + Diamètre → N (tr/min) */
export function RpmCalculator() {
  const [vc, setVc] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [materialIdx, setMaterialIdx] = useState('0');
  const [toolType, setToolType] = useState<ToolType>('HSS');

  const material = MATERIAUX[parseInt(materialIdx)];
  const vcRange = toolType === 'HSS' ? material.vcHSS : material.vcCarbure;
  const vcMean = (vcRange[0] + vcRange[1]) / 2;

  const rpm = useMemo(() => {
    if (vc <= 0 || diameter <= 0) return 0;
    return calcRPM(vc, diameter);
  }, [vc, diameter]);

  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Matériau"
        value={materialIdx}
        onChange={setMaterialIdx}
        options={MATERIAUX.map((m, i) => ({ value: String(i), label: m.nom }))}
      />

      <div className="flex gap-2">
        {(['HSS', 'Carbure'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setToolType(t)}
            className="flex-1 h-10 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: toolType === t ? 'var(--accent-blue)' : 'var(--bg-input)',
              color: toolType === t ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${toolType === t ? 'var(--accent-blue)' : 'var(--border)'}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)' }}
      >
        <span style={{ color: 'var(--text-muted)' }}>
          Vc recommandé : {vcRange[0]}–{vcRange[1]} m/min
        </span>
        <button
          onClick={() => setVc(vcMean)}
          className="px-2 py-1 rounded text-xs font-medium"
          style={{ backgroundColor: 'var(--accent-blue)', color: '#fff' }}
        >
          Utiliser {vcMean}
        </button>
      </div>

      <InputField label="Vitesse de coupe (Vc)" value={vc || ''} onChange={setVc} unit="m/min" />
      <InputField label="Diamètre de l'outil" value={diameter || ''} onChange={setDiameter} unit="mm" />

      {rpm > 0 && (
        <ResultCard label="Vitesse de rotation" value={Math.round(rpm)} unit="tr/min" color="var(--accent-blue)" large />
      )}
    </div>
  );
}
