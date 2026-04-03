import type { Hole, BoltCircleParams } from '../../../types';

interface BoltCirclePlanProps {
  params: BoltCircleParams;
  holes: Hole[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

/** Vue Plan 2D SVG interactive du cercle de perçage */
export function BoltCirclePlan({ params, holes, currentStep, onStepChange }: BoltCirclePlanProps) {
  const { outerDiameter, pcd, holeDiameter } = params;
  const viewSize = 300;
  const padding = 30;
  const maxDim = Math.max(outerDiameter || pcd * 1.3, pcd) / 2;
  const scale = (viewSize / 2 - padding) / maxDim;
  const cx = viewSize / 2;
  const cy = viewSize / 2;

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        className="w-full max-w-md mx-auto"
        style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px' }}
      >
        {/* Grille de fond */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width={viewSize} height={viewSize} fill="url(#grid)" rx="12" />

        {/* Axes X/Y */}
        <line x1={padding} y1={cy} x2={viewSize - padding} y2={cy} stroke="var(--text-dim)" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1={cx} y1={padding} x2={cx} y2={viewSize - padding} stroke="var(--text-dim)" strokeWidth="0.5" strokeDasharray="4 4" />
        <text x={viewSize - padding + 5} y={cy + 4} fill="var(--text-dim)" fontSize="10">X</text>
        <text x={cx + 5} y={padding - 5} fill="var(--text-dim)" fontSize="10">Y</text>

        {/* Cercle extérieur de la pièce */}
        {outerDiameter > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={(outerDiameter / 2) * scale}
            fill="none"
            stroke="var(--accent-blue)"
            strokeWidth="1.5"
          />
        )}

        {/* Cercle PCD (pointillé) */}
        <circle
          cx={cx}
          cy={cy}
          r={(pcd / 2) * scale}
          fill="none"
          stroke="var(--text-dim)"
          strokeWidth="1"
          strokeDasharray="6 3"
        />

        {/* Trous */}
        {holes.map((hole, i) => {
          const hx = cx + hole.xAbs * scale;
          const hy = cy - hole.yAbs * scale; // Y inversé en SVG
          const holeR = Math.max((holeDiameter / 2) * scale, 4);
          const isActive = i === currentStep;

          return (
            <g key={i} onClick={() => onStepChange(i)} className="cursor-pointer">
              {/* Animation pulse pour le trou actif */}
              {isActive && (
                <circle
                  cx={hx}
                  cy={hy}
                  r={holeR}
                  fill="none"
                  stroke="var(--accent-orange)"
                  strokeWidth="2"
                  className="animate-pulse-ring"
                />
              )}
              <circle
                cx={hx}
                cy={hy}
                r={holeR}
                fill={isActive ? 'var(--accent-orange)' : 'var(--bg-input)'}
                stroke={isActive ? 'var(--accent-orange)' : 'var(--text-dim)'}
                strokeWidth={isActive ? 2 : 1}
              />
              <text
                x={hx}
                y={hy + 3.5}
                textAnchor="middle"
                fill={isActive ? '#fff' : 'var(--text-muted)'}
                fontSize="9"
                fontWeight="bold"
                fontFamily="JetBrains Mono"
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Cotes */}
        {outerDiameter > 0 && (
          <text x={cx + (outerDiameter / 2) * scale + 5} y={cy - 5} fill="var(--accent-blue)" fontSize="9" fontFamily="JetBrains Mono">
            ⌀{outerDiameter}
          </text>
        )}
        <text x={cx + (pcd / 2) * scale + 5} y={cy + 12} fill="var(--text-dim)" fontSize="8" fontFamily="JetBrains Mono">
          PCD {pcd}
        </text>
      </svg>

      {/* Boutons navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => currentStep > 0 && onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
          className="flex-1 h-12 rounded-lg font-medium transition-opacity disabled:opacity-30"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          ← Précédent
        </button>
        <button
          onClick={() => currentStep < holes.length - 1 && onStepChange(currentStep + 1)}
          disabled={currentStep === holes.length - 1}
          className="flex-1 h-12 rounded-lg font-medium transition-opacity disabled:opacity-30"
          style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
