import { MATERIAUX } from '../../../utils/constants';

/** Tableau de référence des matériaux et vitesses de coupe recommandées */
export function MaterialTable() {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-card)' }}>
            <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--text-muted)' }}>Matériau</th>
            <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--accent-blue)' }}>Vc HSS</th>
            <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--accent-yellow)' }}>Vc Carbure</th>
            <th className="px-3 py-2 text-center font-medium" style={{ color: 'var(--text-muted)' }}>Densité</th>
          </tr>
        </thead>
        <tbody>
          {MATERIAUX.map((mat) => (
            <tr key={mat.nom} style={{ borderTop: '1px solid var(--border)' }}>
              <td className="px-3 py-2 font-medium" style={{ color: 'var(--text-primary)' }}>{mat.nom}</td>
              <td className="px-3 py-2 text-center font-mono" style={{ color: 'var(--accent-blue)' }}>
                {mat.vcHSS[0]}–{mat.vcHSS[1]}
              </td>
              <td className="px-3 py-2 text-center font-mono" style={{ color: 'var(--accent-yellow)' }}>
                {mat.vcCarbure[0]}–{mat.vcCarbure[1]}
              </td>
              <td className="px-3 py-2 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                {mat.densite}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 text-xs" style={{ color: 'var(--text-dim)' }}>
        Vitesses en m/min — Densité en g/cm³
      </div>
    </div>
  );
}
