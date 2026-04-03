import { useState } from 'react';
import { TabBar } from '../../ui/TabBar';
import { UnitConverter } from './UnitConverter';
import { ConeCalculator } from './ConeCalculator';
import { TriangleCalculator } from './TriangleCalculator';
import { WeightCalculator } from './WeightCalculator';
import { DivisionHead } from './DivisionHead';
import type { ToolsTab } from '../../../types';

const TABS = [
  { id: 'converter', label: 'Conversions' },
  { id: 'cone', label: 'Cônes' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'weight', label: 'Poids' },
  { id: 'divider', label: 'Diviseur' },
];

/** Module Outils & Conversions */
export function ToolsModule() {
  const [tab, setTab] = useState<ToolsTab>('converter');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--accent-yellow)' }}>
        Outils & Conversions
      </h2>

      <TabBar
        tabs={TABS}
        activeTab={tab}
        onTabChange={(id) => setTab(id as ToolsTab)}
        accentColor="var(--accent-yellow)"
      />

      {tab === 'converter' && <UnitConverter />}
      {tab === 'cone' && <ConeCalculator />}
      {tab === 'triangle' && <TriangleCalculator />}
      {tab === 'weight' && <WeightCalculator />}
      {tab === 'divider' && <DivisionHead />}
    </div>
  );
}
