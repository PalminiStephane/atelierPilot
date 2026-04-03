interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  accentColor?: string;
}

/** Barre d'onglets secondaires */
export function TabBar({ tabs, activeTab, onTabChange, accentColor = 'var(--accent-orange)' }: TabBarProps) {
  return (
    <div
      className="flex gap-1 p-1 rounded-lg overflow-x-auto"
      style={{ backgroundColor: 'var(--bg-card)' }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex-1 min-w-0 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all"
          style={{
            backgroundColor: activeTab === tab.id ? accentColor : 'transparent',
            color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
