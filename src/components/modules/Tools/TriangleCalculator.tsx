import { useState, useEffect } from 'react';
import { InputField } from '../../ui/InputField';
import { ResultCard } from '../../ui/ResultCard';
import { calcTriangle } from '../../../utils/calculations';

/** Calculateur de triangle rectangle avec dessin SVG */
export function TriangleCalculator() {
  const [aStr, setAStr] = useState('');
  const [bStr, setBStr] = useState('');
  const [cStr, setCStr] = useState('');
  const [result, setResult] = useState<{ a: number; b: number; c: number; angle: number } | null>(null);

  const a = aStr ? parseFloat(aStr) : undefined;
  const b = bStr ? parseFloat(bStr) : undefined;
  const c = cStr ? parseFloat(cStr) : undefined;

  // Compter le nombre de valeurs renseignées
  const filledCount = [a, b, c].filter((v) => v !== undefined && v > 0).length;

  useEffect(() => {
    if (filledCount >= 2) {
      setResult(calcTriangle(a, b, c));
    } else {
      setResult(null);
    }
  }, [a, b, c, filledCount]);

  const handleClear = () => {
    setAStr('');
    setBStr('');
    setCStr('');
    setResult(null);
  };

  // Dessin SVG du triangle
  const svgSize = 250;
  const pad = 50;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <InputField label="Adjacent (a)" value={aStr} onChange={(v) => setAStr(String(v || ''))} unit="mm" />
        <InputField label="Opposé (b)" value={bStr} onChange={(v) => setBStr(String(v || ''))} unit="mm" />
        <InputField label="Hypoténuse (c)" value={cStr} onChange={(v) => setCStr(String(v || ''))} unit="mm" />
      </div>

      <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
        Remplir 2 champs, le 3ème est calculé automatiquement
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Résultat" value={`a=${result.a} b=${result.b} c=${result.c}`} color="var(--accent-yellow)" />
            <ResultCard label="Angle" value={result.angle} unit="°" color="var(--accent-yellow)" large />
          </div>

          <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full max-w-xs mx-auto" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px' }}>
            {/* Triangle */}
            {(() => {
              const maxSide = Math.max(result.a, result.b);
              const s = (svgSize - 2 * pad) / maxSide;
              const ax = pad;
              const ay = svgSize - pad;
              const bx = pad + result.a * s;
              const by = svgSize - pad;
              const cx2 = pad;
              const cy2 = svgSize - pad - result.b * s;

              return (
                <>
                  <polygon
                    points={`${ax},${ay} ${bx},${by} ${cx2},${cy2}`}
                    fill="var(--accent-yellow)"
                    fillOpacity="0.1"
                    stroke="var(--accent-yellow)"
                    strokeWidth="2"
                  />
                  {/* Angle droit */}
                  <rect x={ax} y={ay - 12} width={12} height={12} fill="none" stroke="var(--text-dim)" strokeWidth="1" />
                  {/* Labels côtés */}
                  <text x={(ax + bx) / 2} y={ay + 20} fill="var(--accent-yellow)" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                    a={result.a}
                  </text>
                  <text x={ax - 10} y={(ay + cy2) / 2} fill="var(--accent-yellow)" fontSize="11" fontFamily="JetBrains Mono" textAnchor="end">
                    b={result.b}
                  </text>
                  <text x={(bx + cx2) / 2 + 15} y={(by + cy2) / 2} fill="var(--text-muted)" fontSize="10" fontFamily="JetBrains Mono">
                    c={result.c}
                  </text>
                  {/* Angle */}
                  <text x={bx - 5} y={by - 8} fill="var(--accent-orange)" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
                    {result.angle}°
                  </text>
                </>
              );
            })()}
          </svg>
        </>
      )}

      <button
        onClick={handleClear}
        className="h-10 rounded-lg text-sm font-medium"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
      >
        Effacer
      </button>
    </div>
  );
}
