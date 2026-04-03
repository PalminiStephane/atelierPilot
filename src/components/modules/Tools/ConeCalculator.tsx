import { useState, useMemo } from 'react';
import { InputField } from '../../ui/InputField';
import { ResultCard } from '../../ui/ResultCard';
import { calcCone } from '../../../utils/calculations';

/** Calculateur de cônes avec dessin SVG */
export function ConeCalculator() {
  const [bigD, setBigD] = useState(0);
  const [smallD, setSmallD] = useState(0);
  const [length, setLength] = useState(0);

  const result = useMemo(() => {
    if (bigD <= 0 || smallD <= 0 || length <= 0 || bigD <= smallD) return null;
    return calcCone(bigD, smallD, length);
  }, [bigD, smallD, length]);

  // Proportions SVG du cône
  const svgW = 280;
  const svgH = 160;
  const pad = 40;
  const coneLeft = pad;
  const coneRight = svgW - pad;
  const coneLen = coneRight - coneLeft;
  const maxD = bigD || 50;
  const scale = (svgH - 2 * pad) / maxD;
  const cy = svgH / 2;
  const topL = cy - (bigD / 2) * scale;
  const botL = cy + (bigD / 2) * scale;
  const topR = cy - (smallD / 2) * scale;
  const botR = cy + (smallD / 2) * scale;

  return (
    <div className="flex flex-col gap-4">
      <InputField label="Grand diamètre (D)" value={bigD || ''} onChange={setBigD} unit="mm" />
      <InputField label="Petit diamètre (d)" value={smallD || ''} onChange={setSmallD} unit="mm" />
      <InputField label="Longueur (L)" value={length || ''} onChange={setLength} unit="mm" />

      {result && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Demi-angle" value={result.halfAngle} unit="°" color="var(--accent-yellow)" large />
            <ResultCard label="Conicité" value={result.taper} unit="mm/m" color="var(--accent-yellow)" />
          </div>

          {/* Dessin SVG du cône */}
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px' }}>
            {/* Cône */}
            <polygon
              points={`${coneLeft},${topL} ${coneRight},${topR} ${coneRight},${botR} ${coneLeft},${botL}`}
              fill="var(--accent-yellow)"
              fillOpacity="0.15"
              stroke="var(--accent-yellow)"
              strokeWidth="2"
            />

            {/* Cote D */}
            <line x1={coneLeft - 15} y1={topL} x2={coneLeft - 15} y2={botL} stroke="var(--accent-yellow)" strokeWidth="1" />
            <text x={coneLeft - 30} y={cy + 4} fill="var(--accent-yellow)" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              D={bigD}
            </text>

            {/* Cote d */}
            <line x1={coneRight + 15} y1={topR} x2={coneRight + 15} y2={botR} stroke="var(--accent-yellow)" strokeWidth="1" />
            <text x={coneRight + 30} y={cy + 4} fill="var(--accent-yellow)" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              d={smallD}
            </text>

            {/* Cote L */}
            <line x1={coneLeft} y1={botL + 15} x2={coneRight} y2={botL + 15} stroke="var(--text-dim)" strokeWidth="1" />
            <text x={(coneLeft + coneRight) / 2} y={botL + 28} fill="var(--text-dim)" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              L={length}
            </text>
          </svg>
        </>
      )}
    </div>
  );
}
