import { StepNavigator } from '../../ui/StepNavigator';
import type { Hole } from '../../../types';

interface BoltCircleGuideProps {
  holes: Hole[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

/** Mode guidage pas-à-pas pour le cercle de perçage */
export function BoltCircleGuide({ holes, currentStep, onStepChange }: BoltCircleGuideProps) {
  const hole = holes[currentStep];
  const isLast = currentStep === holes.length - 1;

  const onNext = () => {
    if (currentStep < holes.length - 1) onStepChange(currentStep + 1);
  };
  const onPrev = () => {
    if (currentStep > 0) onStepChange(currentStep - 1);
  };

  // Direction de la flèche : pointe du centre vers la position du trou sur la pièce
  const arrowAngle = Math.atan2(hole.yAbs, hole.xAbs) * (180 / Math.PI);

  return (
    <StepNavigator
      currentStep={currentStep}
      totalSteps={holes.length}
      onNext={onNext}
      onPrev={onPrev}
      accentColor="var(--accent-orange)"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Numéro du trou */}
        <div className="font-heading text-4xl font-bold" style={{ color: 'var(--accent-orange)' }}>
          Trou {currentStep + 1} / {holes.length}
        </div>

        {/* Flèche directionnelle SVG */}
        <svg width="80" height="80" viewBox="0 0 80 80">
          <g transform={`rotate(${-arrowAngle} 40 40)`}>
            <line x1="20" y1="40" x2="60" y2="40" stroke="var(--accent-orange)" strokeWidth="3" />
            <polygon points="60,40 50,34 50,46" fill="var(--accent-orange)" />
          </g>
        </svg>

        {/* Cartes de déplacement */}
        <div className="w-full flex flex-col gap-3">
          {/* Déplacement X */}
          <div
            className="rounded-xl p-4 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${hole.deltaX >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}33`,
            }}
          >
            <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Déplacement X</div>
            <div
              className="font-mono text-3xl font-bold"
              style={{ color: hole.deltaX >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}
            >
              {hole.deltaX > 0 ? '+' : ''}{hole.deltaX.toFixed(2)} mm
            </div>
          </div>

          {/* Déplacement Y */}
          <div
            className="rounded-xl p-4 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${hole.deltaY >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}33`,
            }}
          >
            <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Déplacement Y</div>
            <div
              className="font-mono text-3xl font-bold"
              style={{ color: hole.deltaY >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}
            >
              {hole.deltaY > 0 ? '+' : ''}{hole.deltaY.toFixed(2)} mm
            </div>
          </div>

          {/* Profondeur Z */}
          <div
            className="rounded-xl p-4 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--accent-yellow)33',
            }}
          >
            <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Profondeur Z</div>
            <div className="font-mono text-3xl font-bold" style={{ color: 'var(--accent-yellow)' }}>
              {hole.depth.toFixed(2)} mm
            </div>
          </div>
        </div>

        {/* Coordonnées absolues */}
        <div className="flex gap-4 text-sm font-mono" style={{ color: 'var(--text-dim)' }}>
          <span>X abs : {hole.xAbs.toFixed(2)}</span>
          <span>Y abs : {hole.yAbs.toFixed(2)}</span>
          {hole.angle !== undefined && <span>∠ {hole.angle.toFixed(2)}°</span>}
        </div>

        {/* Badge dernier trou */}
        {isLast && (
          <div
            className="mt-2 px-8 py-4 rounded-full font-heading font-bold text-lg"
            style={{ backgroundColor: 'var(--accent-green)', color: '#fff' }}
          >
            Perçage terminé !
          </div>
        )}
      </div>
    </StepNavigator>
  );
}
