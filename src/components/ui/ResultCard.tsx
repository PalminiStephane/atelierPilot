interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  large?: boolean;
}

/** Carte de résultat mise en valeur */
export function ResultCard({ label, value, unit, color = 'var(--accent-orange)', large = false }: ResultCardProps) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${color}33`,
      }}
    >
      <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div
        className={`font-mono font-bold ${large ? 'text-4xl' : 'text-2xl'}`}
        style={{ color }}
      >
        {value}
        {unit && (
          <span className="text-base font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
