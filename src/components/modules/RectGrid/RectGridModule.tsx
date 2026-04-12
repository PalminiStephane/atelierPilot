import { useState, useCallback, useMemo } from 'react';
import { TabBar } from '../../ui/TabBar';
import { RectGridGuide } from './RectGridGuide';
import { RectGridInteractivePlan } from './RectGridInteractivePlan';
import { BoltCircleTable } from '../BoltCircle/BoltCircleTable';
import { calcRectGrid } from '../../../utils/calculations';
import type { RectGridParams, RectGridView, Hole } from '../../../types';

interface RectGridModuleProps {
  onSave?: (params: RectGridParams, holes: Hole[]) => void;
  initialParams?: RectGridParams;
}

/** Valeurs par défaut réalistes pour l'affichage initial */
const DEFAULT_RECT_PARAMS: RectGridParams = {
  rows: 3,
  cols: 4,
  spacingX: 20,
  spacingY: 20,
  startX: 0,
  startY: 0,
  holeDiameter: 6,
  holeDepth: 10,
};

const TABS = [
  { id: 'plan', label: 'Plan 2D' },
  { id: 'table', label: 'Tableau' },
  { id: 'guide', label: 'Guidage' },
];

/** Module complet de la grille rectangulaire — saisie interactive sur le plan */
export function RectGridModule({ onSave, initialParams }: RectGridModuleProps) {
  const [view, setView] = useState<RectGridView>('plan');
  const [params, setParams] = useState<RectGridParams>(initialParams ?? DEFAULT_RECT_PARAMS);
  const [currentStep, setCurrentStep] = useState(0);

  // Recalcul automatique dès que les paramètres changent
  const holes = useMemo(() => {
    if (params.rows >= 1 && params.cols >= 1 && params.spacingX > 0 && params.spacingY > 0 && params.holeDiameter > 0 && params.holeDepth > 0) {
      return calcRectGrid(params);
    }
    return [];
  }, [params]);

  const handleParamsChange = useCallback((newParams: RectGridParams) => {
    setParams(newParams);
    // Réinitialiser le step si la taille de la grille change
    if (newParams.rows !== params.rows || newParams.cols !== params.cols) {
      setCurrentStep(0);
    }
  }, [params.rows, params.cols]);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

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

      <TabBar
        tabs={TABS}
        activeTab={view}
        onTabChange={(id) => setView(id as RectGridView)}
        accentColor="var(--accent-purple)"
      />

      {view === 'plan' && (
        <RectGridInteractivePlan
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
        <RectGridGuide holes={holes} currentStep={currentStep} onStepChange={handleStepChange} />
      )}
    </div>
  );
}
