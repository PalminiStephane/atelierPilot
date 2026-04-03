import type { Hole, RectGridParams } from '../../../types';

interface RectGridPlanProps {
  params: RectGridParams;
  holes: Hole[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

/** Vue Plan 2D SVG de la grille rectangulaire */
export function RectGridPlan({ params, holes, currentStep, onStepChange }: RectGridPlanProps) {
  const { rows, cols, spacingX, spacingY, startX, startY, holeDiameter } = params;
  const viewSize = 300;
  const padding = 40;

  const gridWidth = (cols - 1) * spacingX;
  const gridHeight = (rows - 1) * spacingY;
  const maxDim = Math.max(gridWidth, gridHeight, 10);
  const scale = (viewSize - 2 * padding) / maxDim;

  const offsetX = padding + (viewSize - 2 * padding - gridWidth * scale) / 2;
  const offsetY = padding + (viewSize - 2 * padding - gridHeight * scale) / 2;

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        className="w-full max-w-md mx-auto"
        style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px' }}
      >
        {/* Grille de fond */}
        <defs>
          <pattern id="gridBg" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width={viewSize} height={viewSize} fill="url(#gridBg)" rx="12" />

        {/* Parcours serpentin */}
        {holes.length > 1 && (
          <polyline
            points={holes.map(h => {
              const x = offsetX + (h.xAbs - startX) * scale;
              const y = offsetY + (h.yAbs - startY) * scale;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="var(--accent-purple)"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.4"
          />
        )}

        {/* Trous */}
        {holes.map((hole, i) => {
          const hx = offsetX + (hole.xAbs - startX) * scale;
          const hy = offsetY + (hole.yAbs - startY) * scale;
          const holeR = Math.max((holeDiameter / 2) * scale, 4);
          const isActive = i === currentStep;

          return (
            <g key={i} onClick={() => onStepChange(i)} className="cursor-pointer">
              {isActive && (
                <circle cx={hx} cy={hy} r={holeR} fill="none" stroke="var(--accent-purple)" strokeWidth="2" className="animate-pulse-ring" />
              )}
              <circle
                cx={hx} cy={hy} r={holeR}
                fill={isActive ? 'var(--accent-purple)' : 'var(--bg-input)'}
                stroke={isActive ? 'var(--accent-purple)' : 'var(--text-dim)'}
                strokeWidth={isActive ? 2 : 1}
              />
              <text x={hx} y={hy + 3.5} textAnchor="middle" fill={isActive ? '#fff' : 'var(--text-muted)'} fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

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
          style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
