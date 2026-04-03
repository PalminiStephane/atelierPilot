import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Hole, BoltCircleParams } from '../../../types';

interface BoltCircleInteractivePlanProps {
  params: BoltCircleParams;
  holes: Hole[];
  onParamsChange: (params: BoltCircleParams) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

/** Type de popover ouvert */
type PopoverType = 'hole' | 'piece' | null;

/** Popover d'édition pour les trous */
function HolePopover({
  params,
  onParamsChange,
  onClose,
}: {
  params: BoltCircleParams;
  onParamsChange: (p: BoltCircleParams) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onClose]);

  const update = (key: keyof BoltCircleParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 rounded-xl p-4 shadow-xl"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--accent-orange)',
        minWidth: '240px',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '100%',
        marginBottom: '12px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Flèche vers le bas */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: '-6px',
          width: '12px',
          height: '12px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--accent-orange)',
          borderTop: 'none',
          borderLeft: 'none',
          transform: 'translateX(-50%) rotate(45deg)',
        }}
      />
      <div className="flex flex-col gap-3">
        <div className="font-heading text-sm font-bold" style={{ color: 'var(--accent-orange)' }}>
          Paramètres des trous
        </div>
        <PopoverField label="Nb de trous" value={params.holeCount} onChange={(v) => update('holeCount', Math.max(1, Math.round(v)))} step={1} />
        <PopoverField label="⌀ trous" value={params.holeDiameter} onChange={(v) => update('holeDiameter', v)} unit="mm" />
        <PopoverField label="⌀ cercle (PCD)" value={params.pcd} onChange={(v) => update('pcd', v)} unit="mm" />
        <PopoverField label="Profondeur" value={params.holeDepth} onChange={(v) => update('holeDepth', v)} unit="mm" />
        <PopoverField label="Angle départ" value={params.startAngle} onChange={(v) => update('startAngle', v)} unit="°" />
        {/* Sens de rotation */}
        <div className="flex gap-2">
          {(['cw', 'ccw'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => onParamsChange({ ...params, direction: dir })}
              className="flex-1 h-9 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: params.direction === dir ? 'var(--accent-orange)' : 'var(--bg-input)',
                color: params.direction === dir ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${params.direction === dir ? 'var(--accent-orange)' : 'var(--border)'}`,
              }}
            >
              {dir === 'cw' ? '↻ Horaire' : '↺ Anti-H'}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/** Popover d'édition pour la pièce */
function PiecePopover({
  params,
  onParamsChange,
  onClose,
}: {
  params: BoltCircleParams;
  onParamsChange: (p: BoltCircleParams) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 rounded-xl p-4 shadow-xl"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--accent-blue)',
        minWidth: '220px',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '100%',
        marginBottom: '12px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: '-6px',
          width: '12px',
          height: '12px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--accent-blue)',
          borderTop: 'none',
          borderLeft: 'none',
          transform: 'translateX(-50%) rotate(45deg)',
        }}
      />
      <div className="flex flex-col gap-3">
        <div className="font-heading text-sm font-bold" style={{ color: 'var(--accent-blue)' }}>
          Diamètre de la pièce
        </div>
        <PopoverField
          label="⌀ pièce"
          value={params.outerDiameter}
          onChange={(v) => onParamsChange({ ...params, outerDiameter: v })}
          unit="mm"
          accent="var(--accent-blue)"
        />
      </div>
    </motion.div>
  );
}

/** Champ numérique compact pour les popovers */
function PopoverField({
  label,
  value,
  onChange,
  unit,
  step = 0.01,
  accent = 'var(--accent-orange)',
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  step?: number;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs whitespace-nowrap min-w-[80px]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <div className="relative flex-1">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={0}
          className="w-full h-8 px-2 rounded-md font-mono text-sm outline-none"
          style={{
            backgroundColor: 'var(--bg-input)',
            border: `1px solid var(--border)`,
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => (e.target.style.borderColor = accent)}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        {unit && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono pointer-events-none" style={{ color: 'var(--text-dim)' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/** Vue Plan 2D interactive — saisie directe sur la pièce */
export function BoltCircleInteractivePlan({
  params,
  holes,
  onParamsChange,
  currentStep,
  onStepChange,
}: BoltCircleInteractivePlanProps) {
  const [popover, setPopover] = useState<PopoverType>(null);
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const { outerDiameter, pcd, holeDiameter } = params;
  const viewSize = 300;
  const padding = 30;
  const maxDim = Math.max(outerDiameter || pcd * 1.3, pcd) / 2;
  const scale = maxDim > 0 ? (viewSize / 2 - padding) / maxDim : 1;
  const cx = viewSize / 2;
  const cy = viewSize / 2;

  // Fermer l'info quand on clique ailleurs
  useEffect(() => {
    if (!showInfo) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) setShowInfo(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showInfo]);

  const handleHoleClick = useCallback((e: React.MouseEvent, holeIndex: number) => {
    e.stopPropagation();
    onStepChange(holeIndex);
    setPopover(popover === 'hole' ? null : 'hole');
  }, [popover, onStepChange]);

  const handlePieceClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPopover(popover === 'piece' ? null : 'piece');
  }, [popover]);

  const closePopover = useCallback(() => setPopover(null), []);

  return (
    <div className="flex flex-col gap-3">
      {/* Zone du plan avec positionnement relatif pour les popovers */}
      <div className="relative">
        {/* Bouton info */}
        <div className="absolute top-2 right-2 z-40" ref={infoRef}>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
            style={{
              backgroundColor: 'var(--accent-orange)',
              color: '#fff',
              opacity: 0.85,
            }}
            title="Aide"
          >
            ?
          </button>
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-9 rounded-lg p-3 shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--accent-orange)',
                  width: '220px',
                  zIndex: 50,
                }}
              >
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--accent-orange)' }}>Cliquez sur un trou</strong> pour modifier le diamètre des trous, leur nombre et le cercle de perçage.
                </p>
                <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--accent-blue)' }}>Cliquez sur le contour de la pièce</strong> pour modifier son diamètre.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <svg
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          className="w-full max-w-md mx-auto"
          style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px' }}
        >
          {/* Grille de fond */}
          <defs>
            <pattern id="grid-interactive" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width={viewSize} height={viewSize} fill="url(#grid-interactive)" rx="12" />

          {/* Axes X/Y */}
          <line x1={padding} y1={cy} x2={viewSize - padding} y2={cy} stroke="var(--text-dim)" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1={cx} y1={padding} x2={cx} y2={viewSize - padding} stroke="var(--text-dim)" strokeWidth="0.5" strokeDasharray="4 4" />
          <text x={viewSize - padding + 5} y={cy + 4} fill="var(--text-dim)" fontSize="10">X</text>
          <text x={cx + 5} y={padding - 5} fill="var(--text-dim)" fontSize="10">Y</text>

          {/* Cercle extérieur de la pièce — cliquable */}
          {outerDiameter > 0 && (
            <g onClick={handlePieceClick} className="cursor-pointer">
              {/* Zone de clic élargie (invisible) */}
              <circle
                cx={cx}
                cy={cy}
                r={(outerDiameter / 2) * scale}
                fill="none"
                stroke="transparent"
                strokeWidth="14"
              />
              {/* Cercle visible */}
              <circle
                cx={cx}
                cy={cy}
                r={(outerDiameter / 2) * scale}
                fill="none"
                stroke={popover === 'piece' ? 'var(--accent-blue)' : 'var(--accent-blue)'}
                strokeWidth={popover === 'piece' ? 2.5 : 1.5}
                className="transition-all"
              />
            </g>
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

          {/* Trous — cliquables */}
          {holes.map((hole, i) => {
            const hx = cx + hole.xAbs * scale;
            const hy = cy - hole.yAbs * scale;
            const holeR = Math.max((holeDiameter / 2) * scale, 4);
            const isActive = i === currentStep;

            return (
              <g key={i} onClick={(e) => handleHoleClick(e, i)} className="cursor-pointer">
                {/* Halo pour le trou actif */}
                {isActive && (
                  <circle
                    cx={hx}
                    cy={hy}
                    r={holeR + 4}
                    fill="none"
                    stroke="var(--accent-orange)"
                    strokeWidth="2"
                    opacity="0.4"
                    className="animate-pulse-ring"
                  />
                )}
                {/* Zone de clic élargie */}
                <circle
                  cx={hx}
                  cy={hy}
                  r={Math.max(holeR, 12)}
                  fill="transparent"
                  stroke="none"
                />
                {/* Trou visible */}
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
                  className="pointer-events-none"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Cotes */}
          {outerDiameter > 0 && (
            <text
              x={cx + (outerDiameter / 2) * scale + 5}
              y={cy - 5}
              fill="var(--accent-blue)"
              fontSize="9"
              fontFamily="JetBrains Mono"
              className="pointer-events-none"
            >
              ⌀{outerDiameter}
            </text>
          )}
          <text
            x={cx + (pcd / 2) * scale + 5}
            y={cy + 12}
            fill="var(--text-dim)"
            fontSize="8"
            fontFamily="JetBrains Mono"
            className="pointer-events-none"
          >
            PCD {pcd}
          </text>
          {holeDiameter > 0 && holes.length > 0 && (
            <text
              x={cx + holes[0].xAbs * scale + Math.max((holeDiameter / 2) * scale, 4) + 4}
              y={cy - holes[0].yAbs * scale - 6}
              fill="var(--accent-orange)"
              fontSize="8"
              fontFamily="JetBrains Mono"
              className="pointer-events-none"
            >
              ⌀{holeDiameter}
            </text>
          )}
        </svg>

        {/* Popovers HTML positionnés au centre du plan */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: '260px' }}>
          <AnimatePresence>
            {popover === 'hole' && (
              <HolePopover
                params={params}
                onParamsChange={onParamsChange}
                onClose={closePopover}
              />
            )}
            {popover === 'piece' && (
              <PiecePopover
                params={params}
                onParamsChange={onParamsChange}
                onClose={closePopover}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Résumé rapide des paramètres sous le plan */}
      <div
        className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs font-mono"
        style={{ color: 'var(--text-dim)' }}
      >
        <span>{params.holeCount} trous</span>
        <span>⌀{params.holeDiameter} mm</span>
        <span>PCD {params.pcd} mm</span>
        <span>Prof. {params.holeDepth} mm</span>
        <span>{params.startAngle}°</span>
        <span>{params.direction === 'cw' ? '↻' : '↺'}</span>
      </div>

      {/* Navigation entre trous */}
      {holes.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={() => currentStep > 0 && onStepChange(currentStep - 1)}
            disabled={currentStep === 0}
            className="flex-1 h-12 rounded-lg font-medium transition-opacity disabled:opacity-30"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            ← Précédent
          </button>
          <div
            className="flex items-center justify-center px-3 font-mono text-sm"
            style={{ color: 'var(--accent-orange)' }}
          >
            {currentStep + 1}/{holes.length}
          </div>
          <button
            onClick={() => currentStep < holes.length - 1 && onStepChange(currentStep + 1)}
            disabled={currentStep === holes.length - 1}
            className="flex-1 h-12 rounded-lg font-medium transition-opacity disabled:opacity-30"
            style={{ backgroundColor: 'var(--accent-orange)', color: '#fff' }}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
