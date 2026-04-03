import { InputField } from '../../ui/InputField';
import type { RectGridParams } from '../../../types';

interface RectGridFormProps {
  params: RectGridParams;
  onChange: (params: RectGridParams) => void;
  onCalculate: () => void;
}

/** Formulaire de saisie de la grille rectangulaire */
export function RectGridForm({ params, onChange, onCalculate }: RectGridFormProps) {
  const update = (key: keyof RectGridParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  const isValid =
    params.rows >= 1 &&
    params.cols >= 1 &&
    params.spacingX > 0 &&
    params.spacingY > 0 &&
    params.holeDiameter > 0 &&
    params.holeDepth > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Nombre de rangées" value={params.rows || ''} onChange={(v) => update('rows', Math.max(1, Math.round(v)))} min={1} step={1} />
        <InputField label="Nombre de colonnes" value={params.cols || ''} onChange={(v) => update('cols', Math.max(1, Math.round(v)))} min={1} step={1} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Espacement X" value={params.spacingX || ''} onChange={(v) => update('spacingX', v)} unit="mm" />
        <InputField label="Espacement Y" value={params.spacingY || ''} onChange={(v) => update('spacingY', v)} unit="mm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Position départ X" value={params.startX} onChange={(v) => update('startX', v)} unit="mm" />
        <InputField label="Position départ Y" value={params.startY} onChange={(v) => update('startY', v)} unit="mm" />
      </div>
      <InputField label="Diamètre des trous" value={params.holeDiameter || ''} onChange={(v) => update('holeDiameter', v)} unit="mm" />
      <InputField label="Profondeur" value={params.holeDepth || ''} onChange={(v) => update('holeDepth', v)} unit="mm" />

      <button
        onClick={onCalculate}
        disabled={!isValid}
        className="w-full h-14 rounded-xl font-heading font-bold text-lg text-white transition-all disabled:opacity-40"
        style={{ backgroundColor: 'var(--accent-purple)' }}
      >
        Calculer
      </button>
    </div>
  );
}
