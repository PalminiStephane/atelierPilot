import { useState, useMemo } from 'react';
import { SelectField } from '../../ui/SelectField';
import { ResultCard } from '../../ui/ResultCard';
import { calcPilotHole, calcMinTapDepth, calcThreadDepth } from '../../../utils/calculations';
import { FILETAGES_ISO } from '../../../utils/constants';
import type { ThreadPitch } from '../../../types';

interface TapCalculatorProps {
  selectedThread?: string;
  onSelectThread?: (nom: string) => void;
}

/** Calculateur rapide de taraudage */
export function TapCalculator({ selectedThread, onSelectThread }: TapCalculatorProps) {
  const [threadIdx, setThreadIdx] = useState(selectedThread || 'M6');
  const [pitchType, setPitchType] = useState<ThreadPitch>('standard');

  const thread = FILETAGES_ISO.find((t) => t.nom === threadIdx) || FILETAGES_ISO[5]; // M6 par défaut
  const pitch = pitchType === 'standard' ? thread.pasStd : thread.pasFin;

  const results = useMemo(() => ({
    pilotHole: calcPilotHole(thread.d, pitch),
    minDepth: calcMinTapDepth(thread.d),
    threadDepth: calcThreadDepth(pitch),
  }), [thread, pitch]);

  const handleThreadChange = (nom: string) => {
    setThreadIdx(nom);
    onSelectThread?.(nom);
  };

  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Filetage"
        value={threadIdx}
        onChange={handleThreadChange}
        options={FILETAGES_ISO.map((t) => ({ value: t.nom, label: `${t.nom} (⌀${t.d} mm)` }))}
      />

      <div className="flex gap-2">
        {(['standard', 'fine'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setPitchType(type === 'fine' ? 'fine' : 'standard')}
            className="flex-1 h-10 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: pitchType === (type === 'fine' ? 'fine' : 'standard') ? 'var(--accent-green)' : 'var(--bg-input)',
              color: pitchType === (type === 'fine' ? 'fine' : 'standard') ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${pitchType === (type === 'fine' ? 'fine' : 'standard') ? 'var(--accent-green)' : 'var(--border)'}`,
            }}
          >
            {type === 'standard' ? `Pas standard (${thread.pasStd})` : `Pas fin (${thread.pasFin})`}
          </button>
        ))}
      </div>

      <ResultCard
        label={`Diamètre avant-trou (${threadIdx})`}
        value={results.pilotHole}
        unit="mm"
        color="var(--accent-green)"
        large
      />

      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          label="Prof. taraudage mini"
          value={results.minDepth}
          unit="mm"
          color="var(--accent-yellow)"
        />
        <ResultCard
          label="Prof. filet"
          value={results.threadDepth}
          unit="mm"
          color="var(--text-primary)"
        />
      </div>
    </div>
  );
}
