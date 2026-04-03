import { useState } from 'react';
import { TabBar } from '../../ui/TabBar';
import { TapCalculator } from './TapCalculator';
import { IsoTable } from './IsoTable';
import { LathePasses } from './LathePasses';
import type { ThreadingTab } from '../../../types';

const TABS = [
  { id: 'calculator', label: 'Calculateur' },
  { id: 'iso_table', label: 'Table ISO' },
  { id: 'lathe_passes', label: 'Passes tour' },
];

/** Module Taraudage & Filetage */
export function ThreadingModule() {
  const [tab, setTab] = useState<ThreadingTab>('calculator');
  const [selectedThread, setSelectedThread] = useState<string>('M6');

  const handleSelectFromTable = (nom: string) => {
    setSelectedThread(nom);
    setTab('calculator');
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--accent-green)' }}>
        Taraudage & Filetage
      </h2>

      <TabBar
        tabs={TABS}
        activeTab={tab}
        onTabChange={(id) => setTab(id as ThreadingTab)}
        accentColor="var(--accent-green)"
      />

      {tab === 'calculator' && <TapCalculator selectedThread={selectedThread} onSelectThread={setSelectedThread} />}
      {tab === 'iso_table' && <IsoTable onSelect={handleSelectFromTable} />}
      {tab === 'lathe_passes' && <LathePasses />}
    </div>
  );
}
