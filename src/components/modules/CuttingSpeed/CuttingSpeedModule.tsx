import { useState } from 'react';
import { TabBar } from '../../ui/TabBar';
import { RpmCalculator } from './RpmCalculator';
import { FeedCalculator } from './FeedCalculator';
import { MaterialTable } from './MaterialTable';
import type { CuttingSpeedTab } from '../../../types';

const TABS = [
  { id: 'rpm', label: 'RPM' },
  { id: 'vc', label: 'Vc / Avance' },
  { id: 'materials', label: 'Matériaux' },
];

/** Module Vitesses de Coupe */
export function CuttingSpeedModule() {
  const [tab, setTab] = useState<CuttingSpeedTab>('rpm');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--accent-blue)' }}>
        Vitesses de Coupe
      </h2>

      <TabBar
        tabs={TABS}
        activeTab={tab}
        onTabChange={(id) => setTab(id as CuttingSpeedTab)}
        accentColor="var(--accent-blue)"
      />

      {tab === 'rpm' && <RpmCalculator />}
      {tab === 'vc' && <FeedCalculator />}
      {tab === 'materials' && <MaterialTable />}
    </div>
  );
}
