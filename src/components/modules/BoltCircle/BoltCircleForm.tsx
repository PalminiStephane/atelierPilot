import { InputField } from '../../ui/InputField';
import type { BoltCircleParams, Direction } from '../../../types';

interface BoltCircleFormProps {
  params: BoltCircleParams;
  onChange: (params: BoltCircleParams) => void;
  onCalculate: () => void;
}

/** Formulaire de saisie du cercle de perçage */
export function BoltCircleForm({ params, onChange, onCalculate }: BoltCircleFormProps) {
  const update = (key: keyof BoltCircleParams, value: number | Direction) => {
    onChange({ ...params, [key]: value });
  };

  const isValid =
    params.pcd > 0 &&
    params.holeCount >= 1 &&
    Number.isInteger(params.holeCount) &&
    params.holeDiameter > 0 &&
    params.holeDepth > 0;

  return (
    <div className="flex flex-col gap-4">
      <InputField
        label="Diamètre extérieur de la pièce"
        value={params.outerDiameter || ''}
        onChange={(v) => update('outerDiameter', v)}
        unit="mm"
      />
      <InputField
        label="Diamètre du cercle de perçage (PCD)"
        value={params.pcd || ''}
        onChange={(v) => update('pcd', v)}
        unit="mm"
      />
      <InputField
        label="Nombre de trous"
        value={params.holeCount || ''}
        onChange={(v) => update('holeCount', Math.max(1, Math.round(v)))}
        min={1}
        step={1}
      />
      <InputField
        label="Diamètre des trous"
        value={params.holeDiameter || ''}
        onChange={(v) => update('holeDiameter', v)}
        unit="mm"
      />
      <InputField
        label="Profondeur des trous"
        value={params.holeDepth || ''}
        onChange={(v) => update('holeDepth', v)}
        unit="mm"
      />
      <InputField
        label="Angle de départ"
        value={params.startAngle}
        onChange={(v) => update('startAngle', v)}
        unit="°"
      />

      {/* Toggle sens */}
      <div className="flex flex-col gap-1">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Sens de rotation</span>
        <div className="flex gap-2">
          {(['cw', 'ccw'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => update('direction', dir)}
              className="flex-1 h-12 rounded-lg font-medium text-sm transition-all"
              style={{
                backgroundColor: params.direction === dir ? 'var(--accent-orange)' : 'var(--bg-input)',
                color: params.direction === dir ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${params.direction === dir ? 'var(--accent-orange)' : 'var(--border)'}`,
              }}
            >
              {dir === 'cw' ? 'Horaire ↻' : 'Anti-horaire ↺'}
            </button>
          ))}
        </div>
      </div>

      {/* Bouton Calculer */}
      <button
        onClick={onCalculate}
        disabled={!isValid}
        className="w-full h-14 rounded-xl font-heading font-bold text-lg text-white transition-all disabled:opacity-40"
        style={{ backgroundColor: 'var(--accent-orange)' }}
      >
        Calculer
      </button>
    </div>
  );
}
