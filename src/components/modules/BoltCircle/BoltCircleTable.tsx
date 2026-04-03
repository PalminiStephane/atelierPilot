import type { Hole } from '../../../types';

interface BoltCircleTableProps {
  holes: Hole[];
}

/** Valeur colorée : vert si positif, rouge si négatif */
function ColoredValue({ value }: { value: number }) {
  const color = value > 0 ? 'var(--accent-green)' : value < 0 ? 'var(--accent-red)' : 'var(--text-muted)';
  return (
    <span className="font-mono" style={{ color }}>
      {value > 0 ? '+' : ''}{value.toFixed(2)}
    </span>
  );
}

/** Tableau des résultats du cercle de perçage */
export function BoltCircleTable({ holes }: BoltCircleTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-card)' }}>
            <th className="px-2 py-2 text-left font-medium" style={{ color: 'var(--text-muted)' }}>N°</th>
            <th className="px-2 py-2 text-right font-medium" style={{ color: 'var(--text-muted)' }}>Angle</th>
            <th className="px-2 py-2 text-right font-medium" style={{ color: 'var(--text-muted)' }}>X abs</th>
            <th className="px-2 py-2 text-right font-medium" style={{ color: 'var(--text-muted)' }}>Y abs</th>
            <th className="px-2 py-2 text-right font-medium" style={{ color: 'var(--accent-green)' }}>ΔX</th>
            <th className="px-2 py-2 text-right font-medium" style={{ color: 'var(--accent-green)' }}>ΔY</th>
            <th className="px-2 py-2 text-right font-medium" style={{ color: 'var(--accent-yellow)' }}>Z</th>
          </tr>
        </thead>
        <tbody>
          {holes.map((hole) => (
            <tr
              key={hole.index}
              className="transition-colors"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <td className="px-2 py-2 font-mono font-bold" style={{ color: 'var(--accent-orange)' }}>
                {hole.index + 1}
              </td>
              <td className="px-2 py-2 text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                {hole.angle?.toFixed(2)}°
              </td>
              <td className="px-2 py-2 text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                {hole.xAbs.toFixed(2)}
              </td>
              <td className="px-2 py-2 text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                {hole.yAbs.toFixed(2)}
              </td>
              <td className="px-2 py-2 text-right"><ColoredValue value={hole.deltaX} /></td>
              <td className="px-2 py-2 text-right"><ColoredValue value={hole.deltaY} /></td>
              <td className="px-2 py-2 text-right font-mono" style={{ color: 'var(--accent-yellow)' }}>
                {hole.depth.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
