import { useState, useCallback, useMemo } from 'react';
import { TabBar } from '../../ui/TabBar';
import { BoltCircleTable } from './BoltCircleTable';
import { BoltCircleGuide } from './BoltCircleGuide';
import { BoltCircleInteractivePlan } from './BoltCircleInteractivePlan';
import { calcBoltCircle } from '../../../utils/calculations';
import type { BoltCircleParams, BoltCircleView, Hole } from '../../../types';

interface BoltCircleModuleProps {
  onSave?: (params: BoltCircleParams, holes: Hole[]) => void;
}

/** Valeurs par défaut réalistes pour l'affichage initial */
const DEFAULT_PARAMS: BoltCircleParams = {
  outerDiameter: 100,
  pcd: 70,
  holeCount: 6,
  holeDiameter: 8,
  holeDepth: 10,
  startAngle: 0,
  direction: 'cw',
};

const TABS = [
  { id: 'plan', label: 'Plan 2D' },
  { id: 'table', label: 'Tableau' },
  { id: 'guide', label: 'Guidage' },
];

/** Module complet du cercle de perçage — saisie interactive sur le plan */
export function BoltCircleModule({ onSave }: BoltCircleModuleProps) {
  const [view, setView] = useState<BoltCircleView>('plan');
  const [params, setParams] = useState<BoltCircleParams>(DEFAULT_PARAMS);
  const [currentStep, setCurrentStep] = useState(0);

  // Recalcul automatique dès que les paramètres changent
  const holes = useMemo(() => {
    if (params.pcd > 0 && params.holeCount >= 1 && params.holeDiameter > 0 && params.holeDepth > 0) {
      return calcBoltCircle(params);
    }
    return [];
  }, [params]);

  const handleParamsChange = useCallback((newParams: BoltCircleParams) => {
    setParams(newParams);
    // Réinitialiser le step si le nombre de trous change
    if (newParams.holeCount !== params.holeCount) {
      setCurrentStep(0);
    }
  }, [params.holeCount]);

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

      <TabBar
        tabs={TABS}
        activeTab={view}
        onTabChange={(id) => setView(id as BoltCircleView)}
        accentColor="var(--accent-orange)"
      />

      {view === 'plan' && (
        <BoltCircleInteractivePlan
          params={params}
          holes={holes}
          onParamsChange={handleParamsChange}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />
      )}
      {view === 'table' && holes.length > 0 && (
        <BoltCircleTable holes={holes} />
      )}
      {view === 'guide' && holes.length > 0 && (
        <BoltCircleGuide holes={holes} currentStep={currentStep} onStepChange={handleStepChange} />
      )}
    </div>
  );
}
