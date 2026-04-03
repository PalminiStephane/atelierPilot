import { useState, useMemo } from 'react';
import { InputField } from '../../ui/InputField';
import { ResultCard } from '../../ui/ResultCard';
import { calcFeedRate, calcVc } from '../../../utils/calculations';

/** Calculateur d'avance + calcul inverse Vc */
export function FeedCalculator() {
  const [mode, setMode] = useState<'feed' | 'vc'>('feed');

  // Mode avance
  const [fz, setFz] = useState(0);
  const [teeth, setTeeth] = useState(0);
  const [rpmFeed, setRpmFeed] = useState(0);

  // Mode Vc
  const [rpmVc, setRpmVc] = useState(0);
  const [diameterVc, setDiameterVc] = useState(0);

  const feedRate = useMemo(() => {
    if (fz <= 0 || teeth <= 0 || rpmFeed <= 0) return 0;
    return calcFeedRate(fz, teeth, rpmFeed);
  }, [fz, teeth, rpmFeed]);

  const vcResult = useMemo(() => {
    if (rpmVc <= 0 || diameterVc <= 0) return 0;
    return calcVc(rpmVc, diameterVc);
  }, [rpmVc, diameterVc]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {([['feed', 'Avance'], ['vc', 'Calcul Vc']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className="flex-1 h-10 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: mode === id ? 'var(--accent-blue)' : 'var(--bg-input)',
              color: mode === id ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${mode === id ? 'var(--accent-blue)' : 'var(--border)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'feed' ? (
        <>
          <InputField label="Avance par dent (fz)" value={fz || ''} onChange={setFz} unit="mm/dent" />
          <InputField label="Nombre de dents (Z)" value={teeth || ''} onChange={setTeeth} step={1} min={1} />
          <InputField label="Vitesse de rotation (N)" value={rpmFeed || ''} onChange={setRpmFeed} unit="tr/min" />
          {feedRate > 0 && (
            <ResultCard label="Avance de table" value={Math.round(feedRate)} unit="mm/min" color="var(--accent-blue)" large />
          )}
        </>
      ) : (
        <>
          <InputField label="Vitesse de rotation (N)" value={rpmVc || ''} onChange={setRpmVc} unit="tr/min" />
          <InputField label="Diamètre de l'outil" value={diameterVc || ''} onChange={setDiameterVc} unit="mm" />
          {vcResult > 0 && (
            <ResultCard label="Vitesse de coupe" value={vcResult} unit="m/min" color="var(--accent-blue)" large />
          )}
        </>
      )}
    </div>
  );
}
