interface HeaderProps {
  onProjectsClick: () => void;
  showProjects: boolean;
}

/** En-tête avec logo AtelierPilot et bouton projets */
export function Header({ onProjectsClick, showProjects }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2">
        {/* Logo engrenage SVG */}
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="12" fill="url(#logo-grad)" />
          <circle cx="32" cy="32" r="20" stroke="url(#logo-grad)" strokeWidth="3" fill="none" />
          {/* Dents d'engrenage */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <rect
              key={angle}
              x="30"
              y="4"
              width="4"
              height="8"
              rx="1"
              fill="url(#logo-grad)"
              transform={`rotate(${angle} 32 32)`}
            />
          ))}
        </svg>

        <div className="flex flex-col">
          <div className="font-heading text-lg font-bold leading-tight">
            <span style={{ color: 'var(--accent-orange)' }}>Atelier</span>
            <span style={{ color: 'var(--text-primary)' }}>Pilot</span>
          </div>
          <span
            className="text-[10px] font-medium uppercase tracking-[0.15em]"
            style={{ color: 'var(--text-dim)' }}
          >
            Guide d'usinage
          </span>
        </div>
      </div>

      <button
        onClick={onProjectsClick}
        className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
        style={{
          backgroundColor: showProjects ? 'var(--accent-orange)' : 'var(--bg-card)',
          color: showProjects ? '#fff' : 'var(--text-muted)',
        }}
        title="Mes projets"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      </button>
    </header>
  );
}
