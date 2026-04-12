import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Hole, RectGridParams } from '../../../types';

interface RectGridInteractivePlanProps {
  params: RectGridParams;
  holes: Hole[];
  onParamsChange: (params: RectGridParams) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

/** Type de panneau ouvert */
type PanelType = 'hole' | 'grid' | null;

/** Champ numérique compact */
function PanelField({
  label,
  value,
  onChange,
  unit,
  step = 0.01,
  accent = 'var(--accent-purple)',
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
      <span className="text-xs whitespace-nowrap min-w-[90px]" style={{ color: 'var(--text-muted)' }}>
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
            border: '1px solid var(--border)',
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

/** Panneau d'édition des trous — affiché sous le plan */
function HolePanel({
  params,
  onParamsChange,
  onClose,
}: {
  params: RectGridParams;
  onParamsChange: (p: RectGridParams) => void;
  onClose: () => void;
}) {
  const update = (key: keyof RectGridParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div
        className="rounded-xl p-4 shadow-lg"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--accent-purple)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading text-sm font-bold" style={{ color: 'var(--accent-purple)' }}>
            Paramètres des trous
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)' }}
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <PanelField label="Rangées" value={params.rows} onChange={(v) => update('rows', Math.max(1, Math.round(v)))} step={1} />
            <PanelField label="Colonnes" value={params.cols} onChange={(v) => update('cols', Math.max(1, Math.round(v)))} step={1} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PanelField label="Espac. X" value={params.spacingX} onChange={(v) => update('spacingX', v)} unit="mm" />
            <PanelField label="Espac. Y" value={params.spacingY} onChange={(v) => update('spacingY', v)} unit="mm" />
          </div>
          <PanelField label="⌀ trous" value={params.holeDiameter} onChange={(v) => update('holeDiameter', v)} unit="mm" />
          <PanelField label="Profondeur" value={params.holeDepth} onChange={(v) => update('holeDepth', v)} unit="mm" />
        </div>
      </div>
    </motion.div>
  );
}

/** Panneau d'édition de la position de départ — affiché sous le plan */
function GridPanel({
  params,
  onParamsChange,
  onClose,
}: {
  params: RectGridParams;
  onParamsChange: (p: RectGridParams) => void;
  onClose: () => void;
}) {
  const update = (key: keyof RectGridParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div
        className="rounded-xl p-4 shadow-lg"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--accent-blue)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading text-sm font-bold" style={{ color: 'var(--accent-blue)' }}>
            Position de départ
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)' }}
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <PanelField label="Départ X" value={params.startX} onChange={(v) => update('startX', v)} unit="mm" accent="var(--accent-blue)" />
          <PanelField label="Départ Y" value={params.startY} onChange={(v) => update('startY', v)} unit="mm" accent="var(--accent-blue)" />
        </div>
      </div>
    </motion.div>
  );
}

/** Vue Plan 2D interactive — saisie directe sur la grille */
export function RectGridInteractivePlan({
  params,
  holes,
  onParamsChange,
  currentStep,
  onStepChange,
}: RectGridInteractivePlanProps) {
  const [panel, setPanel] = useState<PanelType>(null);
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  const { rows, cols, spacingX, spacingY, startX, startY, holeDiameter } = params;
  const viewSize = 300;
  const padding = 40;

  const gridWidth = (cols - 1) * spacingX;
  const gridHeight = (rows - 1) * spacingY;
  const maxDim = Math.max(gridWidth, gridHeight, 10);
  const scale = (viewSize - 2 * padding) / maxDim;

  const offsetX = padding + (viewSize - 2 * padding - gridWidth * scale) / 2;
  const offsetY = padding + (viewSize - 2 * padding - gridHeight * scale) / 2;

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
    setPanel(panel === 'hole' ? null : 'hole');
  }, [panel, onStepChange]);

  const handleGridClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPanel(panel === 'grid' ? null : 'grid');
  }, [panel]);

  const closePanel = useCallback(() => setPanel(null), []);

  return (
    <div className="flex flex-col gap-3">
      {/* Zone du plan */}
      <div className="relative">
        {/* Bouton info */}
        <div className="absolute top-2 right-2 z-40" ref={infoRef}>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
            style={{
              backgroundColor: 'var(--accent-purple)',
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
                  border: '1px solid var(--accent-purple)',
                  width: '220px',
                  zIndex: 50,
                }}
              >
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--accent-purple)' }}>Cliquez sur un trou</strong> pour modifier l'espacement, le nombre de rangées/colonnes et le diamètre.
                </p>
                <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--accent-blue)' }}>Cliquez sur le cadre de la grille</strong> pour modifier la position de départ.
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
            <pattern id="gridBg-interactive" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width={viewSize} height={viewSize} fill="url(#gridBg-interactive)" rx="12" />

          {/* Rectangle englobant de la grille — cliquable */}
          {gridWidth > 0 && gridHeight > 0 && (
            <g onClick={handleGridClick} className="cursor-pointer">
              {/* Zone de clic élargie */}
              <rect
                x={offsetX - 10}
                y={offsetY - 10}
                width={gridWidth * scale + 20}
                height={gridHeight * scale + 20}
                fill="transparent"
                stroke="transparent"
                strokeWidth="10"
              />
              {/* Rectangle visible */}
              <rect
                x={offsetX - 6}
                y={offsetY - 6}
                width={gridWidth * scale + 12}
                height={gridHeight * scale + 12}
                fill="none"
                stroke={panel === 'grid' ? 'var(--accent-blue)' : 'var(--accent-blue)'}
                strokeWidth={panel === 'grid' ? 2 : 1}
                strokeDasharray="6 3"
                rx="4"
                className="transition-all"
              />
            </g>
          )}

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
              className="pointer-events-none"
            />
          )}

          {/* Trous — cliquables */}
          {holes.map((hole, i) => {
            const hx = offsetX + (hole.xAbs - startX) * scale;
            const hy = offsetY + (hole.yAbs - startY) * scale;
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
                    stroke="var(--accent-purple)"
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
                  fill={isActive ? 'var(--accent-purple)' : 'var(--bg-input)'}
                  stroke={isActive ? 'var(--accent-purple)' : 'var(--text-dim)'}
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
          {gridWidth > 0 && (
            <text
              x={offsetX + gridWidth * scale / 2}
              y={offsetY + gridHeight * scale + 18}
              textAnchor="middle"
              fill="var(--text-dim)"
              fontSize="8"
              fontFamily="JetBrains Mono"
              className="pointer-events-none"
            >
              {cols}×{spacingX}mm
            </text>
          )}
          {gridHeight > 0 && (
            <text
              x={offsetX - 12}
              y={offsetY + gridHeight * scale / 2 + 3}
              textAnchor="middle"
              fill="var(--text-dim)"
              fontSize="8"
              fontFamily="JetBrains Mono"
              transform={`rotate(-90 ${offsetX - 12} ${offsetY + gridHeight * scale / 2 + 3})`}
              className="pointer-events-none"
            >
              {rows}×{spacingY}mm
            </text>
          )}
        </svg>
      </div>

      {/* Panneau d'édition sous le plan */}
      <AnimatePresence>
        {panel === 'hole' && (
          <HolePanel
            params={params}
            onParamsChange={onParamsChange}
            onClose={closePanel}
          />
        )}
        {panel === 'grid' && (
          <GridPanel
            params={params}
            onParamsChange={onParamsChange}
            onClose={closePanel}
          />
        )}
      </AnimatePresence>

      {/* Résumé rapide des paramètres */}
      <div
        className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs font-mono"
        style={{ color: 'var(--text-dim)' }}
      >
        <span>{rows}×{cols} trous</span>
        <span>⌀{holeDiameter} mm</span>
        <span>Esp. {spacingX}×{spacingY} mm</span>
        <span>Prof. {params.holeDepth} mm</span>
      </div>

      {/* Coordonnées du trou actif */}
      {holes.length > 0 && holes[currentStep] && (
        <div
          className="flex items-center justify-center gap-4 py-2 rounded-lg font-mono text-sm"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--accent-purple)' }}>Trou {currentStep + 1}</span>
          <span style={{ color: 'var(--text-primary)' }}>X : <strong>{holes[currentStep].xAbs.toFixed(2)}</strong></span>
          <span style={{ color: 'var(--text-primary)' }}>Y : <strong>{holes[currentStep].yAbs.toFixed(2)}</strong></span>
        </div>
      )}

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
            style={{ color: 'var(--accent-purple)' }}
          >
            {currentStep + 1}/{holes.length}
          </div>
          <button
            onClick={() => currentStep < holes.length - 1 && onStepChange(currentStep + 1)}
            disabled={currentStep === holes.length - 1}
            className="flex-1 h-12 rounded-lg font-medium transition-opacity disabled:opacity-30"
            style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
