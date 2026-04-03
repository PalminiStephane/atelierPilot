import { useState, useMemo } from 'react';
import { InputField } from '../../ui/InputField';
import { ResultCard } from '../../ui/ResultCard';
import { calcDivisionHead } from '../../../utils/calculations';

/** Calculateur de plateau diviseur (rapport 40:1) */
export function DivisionHead() {
  const [divisions, setDivisions] = useState(0);

  const result = useMemo(() => {
    if (divisions <= 0) return null;
    return calcDivisionHead(divisions);
  }, [divisions]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Rapport standard : 40:1
      </div>

      <InputField
        label="Nombre de divisions souhaitées"
        value={divisions || ''}
        onChange={(v) => setDivisions(Math.max(1, Math.round(v)))}
        min={1}
        step={1}
      />

      {result && (
        <>
          <ResultCard
            label="Tours de manivelle par division"
            value={`${result.fullTurns} tour${result.fullTurns > 1 ? 's' : ''}${result.fraction > 0 ? ` + ${result.fraction}` : ''}`}
            color="var(--accent-yellow)"
            large
          />

          {result.fraction === 0 ? (
            <div
              className="rounded-lg p-3 text-center text-sm font-medium"
              style={{ backgroundColor: 'var(--accent-green)22', color: 'var(--accent-green)' }}
            >
              Nombre entier de tours — Pas besoin de plateau
            </div>
          ) : result.compatiblePlates.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Plateaux compatibles :
              </div>
              <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-card)' }}>
                      <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--text-muted)' }}>Plateau</th>
                      <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--accent-yellow)' }}>Trous à compter</th>
                      <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--text-muted)' }}>Formule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.compatiblePlates.map((plate) => (
                      <tr key={plate.plateHoles} style={{ borderTop: '1px solid var(--border)' }}>
                        <td className="px-3 py-2 text-center font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                          {plate.plateHoles} trous
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-lg font-bold" style={{ color: 'var(--accent-yellow)' }}>
                          {plate.holesCount}
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
                          {plate.fullTurns} + {plate.holesCount}/{plate.plateHoles}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className="rounded-lg p-3 text-center text-sm"
              style={{ backgroundColor: 'var(--accent-red)22', color: 'var(--accent-red)' }}
            >
              Aucun plateau standard compatible
            </div>
          )}
        </>
      )}
    </div>
  );
}
