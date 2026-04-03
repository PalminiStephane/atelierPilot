import { useState, useCallback } from 'react';
import { TabBar } from '../../ui/TabBar';
import { BoltCircleForm } from './BoltCircleForm';
import { BoltCircleTable } from './BoltCircleTable';
import { BoltCircleGuide } from './BoltCircleGuide';
import { BoltCirclePlan } from './BoltCirclePlan';
import { calcBoltCircle } from '../../../utils/calculations';
import type { BoltCircleParams, BoltCircleView, Hole } from '../../../types';

interface BoltCircleModuleProps {
  onSave?: (params: BoltCircleParams, holes: Hole[]) => void;
}

const TABS = [
  { id: 'form', label: 'Saisie' },
  { id: 'table', label: 'Tableau' },
  { id: 'guide', label: 'Guidage' },
  { id: 'plan', label: 'Plan 2D' },
];

/** Module complet du cercle de perçage */
export function BoltCircleModule({ onSave }: BoltCircleModuleProps) {
  const [view, setView] = useState<BoltCircleView>('form');
  const [params, setParams] = useState<BoltCircleParams>({
    outerDiameter: 0,
    pcd: 0,
    holeCount: 4,
    holeDiameter: 0,
    holeDepth: 0,
    startAngle: 0,
    direction: 'cw',
  });
  const [holes, setHoles] = useState<Hole[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleCalculate = useCallback(() => {
    const result = calcBoltCircle(params);
    setHoles(result);
    setCurrentStep(0);
    setView('table');
  }, [params]);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--accent-orange)' }}>
          Cercle de Perçage
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
        <TabBar
          tabs={TABS}
          activeTab={view}
          onTabChange={(id) => setView(id as BoltCircleView)}
          accentColor="var(--accent-orange)"
        />
      )}

      {view === 'form' && (
        <BoltCircleForm params={params} onChange={setParams} onCalculate={handleCalculate} />
      )}
      {view === 'table' && holes.length > 0 && (
        <BoltCircleTable holes={holes} />
      )}
      {view === 'guide' && holes.length > 0 && (
        <BoltCircleGuide holes={holes} currentStep={currentStep} onStepChange={handleStepChange} />
      )}
      {view === 'plan' && holes.length > 0 && (
        <BoltCirclePlan params={params} holes={holes} currentStep={currentStep} onStepChange={handleStepChange} />
      )}
    </div>
  );
}
