import { useState, useCallback } from 'react';
import { TabBar } from '../../ui/TabBar';
import { RectGridForm } from './RectGridForm';
import { RectGridGuide } from './RectGridGuide';
import { RectGridPlan } from './RectGridPlan';
import { BoltCircleTable } from '../BoltCircle/BoltCircleTable';
import { calcRectGrid } from '../../../utils/calculations';
import type { RectGridParams, RectGridView, Hole } from '../../../types';

interface RectGridModuleProps {
  onSave?: (params: RectGridParams, holes: Hole[]) => void;
  initialParams?: RectGridParams;
}

const TABS = [
  { id: 'form', label: 'Saisie' },
  { id: 'table', label: 'Tableau' },
  { id: 'guide', label: 'Guidage' },
  { id: 'plan', label: 'Plan 2D' },
];

/** Module complet de la grille rectangulaire */
const DEFAULT_RECT_PARAMS: RectGridParams = {
  rows: 3,
  cols: 3,
  spacingX: 0,
  spacingY: 0,
  startX: 0,
  startY: 0,
  holeDiameter: 0,
  holeDepth: 0,
};

export function RectGridModule({ onSave, initialParams }: RectGridModuleProps) {
  const [view, setView] = useState<RectGridView>(initialParams ? 'table' : 'form');
  const [params, setParams] = useState<RectGridParams>(initialParams ?? DEFAULT_RECT_PARAMS);
  const [holes, setHoles] = useState<Hole[]>(() =>
    initialParams ? calcRectGrid(initialParams) : []
  );
  const [currentStep, setCurrentStep] = useState(0);

  const handleCalculate = useCallback(() => {
    const result = calcRectGrid(params);
    setHoles(result);
    setCurrentStep(0);
    setView('table');
  }, [params]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--accent-purple)' }}>
          Grille Rectangulaire
        </h2>
        {holes.length > 0 && onSave && (
          <button
            onClick={() => onSave(params, holes)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            Sauvegarder
          </button>
        )}
      </div>

      {holes.length > 0 && (
        <TabBar tabs={TABS} activeTab={view} onTabChange={(id) => setView(id as RectGridView)} accentColor="var(--accent-purple)" />
      )}

      {view === 'form' && <RectGridForm params={params} onChange={setParams} onCalculate={handleCalculate} />}
      {view === 'table' && holes.length > 0 && <BoltCircleTable holes={holes} />}
      {view === 'guide' && holes.length > 0 && <RectGridGuide holes={holes} currentStep={currentStep} onStepChange={setCurrentStep} />}
      {view === 'plan' && holes.length > 0 && <RectGridPlan params={params} holes={holes} currentStep={currentStep} onStepChange={setCurrentStep} />}
    </div>
  );
}
