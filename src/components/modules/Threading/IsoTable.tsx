import { useState } from 'react';
import { FILETAGES_ISO } from '../../../utils/constants';
import { calcPilotHole } from '../../../utils/calculations';

interface IsoTableProps {
  onSelect: (nom: string) => void;
}

/** Table ISO complète des filetages avec recherche */
export function IsoTable({ onSelect }: IsoTableProps) {
  const [search, setSearch] = useState('');

  const filtered = FILETAGES_ISO.filter((t) =>
    t.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un filetage (ex: M8)"
        className="h-12 px-3 rounded-lg text-base outline-none"
        style={{
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
      />

      <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-card)' }}>
              <th className="px-2 py-2 text-left font-medium" style={{ color: 'var(--text-muted)' }}>Filetage</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--text-muted)' }}>⌀ mm</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--text-muted)' }}>Pas std</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--text-muted)' }}>Pas fin</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--accent-green)' }}>AV std</th>
              <th className="px-2 py-2 text-center font-medium" style={{ color: 'var(--accent-green)' }}>AV fin</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.nom}
                onClick={() => onSelect(t.nom)}
                className="cursor-pointer transition-colors hover:brightness-125"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <td className="px-2 py-2 font-bold" style={{ color: 'var(--accent-green)' }}>{t.nom}</td>
                <td className="px-2 py-2 text-center font-mono" style={{ color: 'var(--text-primary)' }}>{t.d}</td>
                <td className="px-2 py-2 text-center font-mono" style={{ color: 'var(--text-primary)' }}>{t.pasStd}</td>
                <td className="px-2 py-2 text-center font-mono" style={{ color: 'var(--text-primary)' }}>{t.pasFin}</td>
                <td className="px-2 py-2 text-center font-mono font-bold" style={{ color: 'var(--accent-green)' }}>
                  {calcPilotHole(t.d, t.pasStd)}
                </td>
                <td className="px-2 py-2 text-center font-mono font-bold" style={{ color: 'var(--accent-green)' }}>
                  {calcPilotHole(t.d, t.pasFin)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
        AV = Diamètre avant-trou — Cliquer sur une ligne pour ouvrir le calculateur
      </div>
    </div>
  );
}
