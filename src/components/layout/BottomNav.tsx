import type { ModuleId } from '../../types';

interface NavItem {
  id: ModuleId;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'bolt_circle',
    label: 'Perçage',
    color: 'var(--accent-orange)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="4" r="1.5" fill="currentColor" />
        <circle cx="19" cy="16" r="1.5" fill="currentColor" />
        <circle cx="5" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'cutting_speed',
    label: 'Vitesses',
    color: 'var(--accent-blue)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: 'threading',
    label: 'Taraudage',
    color: 'var(--accent-green)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v18" />
        <path d="M6 7l12 2" />
        <path d="M6 12l12 2" />
        <path d="M6 17l12 2" />
      </svg>
    ),
  },
  {
    id: 'tools',
    label: 'Outils',
    color: 'var(--accent-yellow)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 20l10-10M14.5 3.5l6 6" />
        <path d="M15 4l5 5-7 7-5-5z" />
      </svg>
    ),
  },
  {
    id: 'rect_grid',
    label: 'Grille',
    color: 'var(--accent-purple)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <circle cx="16" cy="8" r="1.5" fill="currentColor" />
        <circle cx="8" cy="16" r="1.5" fill="currentColor" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

interface BottomNavProps {
  activeModule: ModuleId;
  onModuleChange: (id: ModuleId) => void;
}

/** Barre de navigation inférieure fixe avec 5 onglets */
export function BottomNav({ activeModule, onModuleChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around px-1 pb-[env(safe-area-inset-bottom)] h-16"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 pt-2 pb-1 relative transition-all"
            style={{
              color: isActive ? item.color : 'var(--text-dim)',
              opacity: isActive ? 1 : 0.5,
            }}
          >
            {/* Indicateur actif */}
            {isActive && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
