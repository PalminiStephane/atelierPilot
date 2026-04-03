import { useState, useMemo } from 'react';
import { SelectField } from '../../ui/SelectField';
import { ResultCard } from '../../ui/ResultCard';
import { calcLathePasses, calcThreadDepth } from '../../../utils/calculations';
import { FILETAGES_ISO } from '../../../utils/constants';
import type { ThreadPitch } from '../../../types';

/** Filetage au tour — Passes dégressives */
export function LathePasses() {
  const [threadIdx, setThreadIdx] = useState('M6');
  const [pitchType, setPitchType] = useState<ThreadPitch>('standard');

  const thread = FILETAGES_ISO.find((t) => t.nom === threadIdx) || FILETAGES_ISO[5];
  const pitch = pitchType === 'standard' ? thread.pasStd : thread.pasFin;
  const totalDepth = calcThreadDepth(pitch);

  const passes = useMemo(() => calcLathePasses(pitch), [pitch]);

  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Filetage"
        value={threadIdx}
        onChange={setThreadIdx}
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
            {type === 'standard' ? `Std (${thread.pasStd})` : `Fin (${thread.pasFin})`}
          </button>
        ))}
      </div>

      <ResultCard
        label="Profondeur totale du filet"
        value={totalDepth}
        unit="mm"
        color="var(--accent-green)"
      />

      <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-card)' }}>
              <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--text-muted)' }}>Passe</th>
              <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--accent-green)' }}>Prof.</th>
              <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--accent-yellow)' }}>Cumul</th>
            </tr>
          </thead>
          <tbody>
            {passes.map((p) => (
              <tr key={p.pass} style={{ borderTop: '1px solid var(--border)' }}>
                <td className="px-3 py-2 text-center font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                  {p.pass}
                </td>
                <td className="px-3 py-2 text-center font-mono" style={{ color: 'var(--accent-green)' }}>
                  {p.depth.toFixed(2)} mm
                </td>
                <td className="px-3 py-2 text-center font-mono" style={{ color: 'var(--accent-yellow)' }}>
                  {p.cumul.toFixed(2)} mm
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs font-mono text-center" style={{ color: 'var(--text-dim)' }}>
        Total : {passes[passes.length - 1]?.cumul.toFixed(2)} mm / {totalDepth.toFixed(2)} mm
      </div>
    </div>
  );
}
