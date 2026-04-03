import { StepNavigator } from '../../ui/StepNavigator';
import type { Hole } from '../../../types';

interface RectGridGuideProps {
  holes: Hole[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

/** Mode guidage pas-à-pas pour la grille rectangulaire */
export function RectGridGuide({ holes, currentStep, onStepChange }: RectGridGuideProps) {
  const hole = holes[currentStep];
  const isLast = currentStep === holes.length - 1;

  const onNext = () => { if (currentStep < holes.length - 1) onStepChange(currentStep + 1); };
  const onPrev = () => { if (currentStep > 0) onStepChange(currentStep - 1); };

  return (
    <StepNavigator
      currentStep={currentStep}
      totalSteps={holes.length}
      onNext={onNext}
      onPrev={onPrev}
      accentColor="var(--accent-purple)"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="font-heading text-4xl font-bold" style={{ color: 'var(--accent-purple)' }}>
          Trou {currentStep + 1} / {holes.length}
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid ${hole.deltaX >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}33` }}>
            <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Déplacement X</div>
            <div className="font-mono text-3xl font-bold" style={{ color: hole.deltaX >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {hole.deltaX > 0 ? '+' : ''}{hole.deltaX.toFixed(2)} mm
            </div>
          </div>

          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid ${hole.deltaY >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}33` }}>
            <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Déplacement Y</div>
            <div className="font-mono text-3xl font-bold" style={{ color: hole.deltaY >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {hole.deltaY > 0 ? '+' : ''}{hole.deltaY.toFixed(2)} mm
            </div>
          </div>

          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--accent-yellow)33' }}>
            <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Profondeur Z</div>
            <div className="font-mono text-3xl font-bold" style={{ color: 'var(--accent-yellow)' }}>
              {hole.depth.toFixed(2)} mm
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-sm font-mono" style={{ color: 'var(--text-dim)' }}>
          <span>X abs : {hole.xAbs.toFixed(2)}</span>
          <span>Y abs : {hole.yAbs.toFixed(2)}</span>
        </div>

        {isLast && (
          <div className="mt-2 px-6 py-3 rounded-full font-heading font-bold text-lg" style={{ backgroundColor: 'var(--accent-green)', color: '#fff' }}>
            Perçage terminé !
          </div>
        )}
      </div>
    </StepNavigator>
  );
}
