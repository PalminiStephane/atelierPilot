import { motion } from 'framer-motion';
import { useSwipe } from '../../hooks/useSwipe';

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  accentColor?: string;
  children: React.ReactNode;
}

/** Composant de navigation pas-à-pas avec swipe Framer Motion */
export function StepNavigator({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  accentColor = 'var(--accent-orange)',
  children,
}: StepNavigatorProps) {
  const { handleDragEnd } = useSwipe({ onNext, onPrev });

  return (
    <div className="flex flex-col gap-4">
      {/* Barre de progression */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
          {currentStep + 1}/{totalSteps}
        </span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-input)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentColor }}
            initial={false}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Zone swipeable */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="touch-pan-y cursor-grab active:cursor-grabbing"
      >
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Boutons navigation */}
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="flex-1 h-12 rounded-lg font-medium text-base transition-opacity disabled:opacity-30"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          ← Précédent
        </button>
        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className="flex-1 h-12 rounded-lg font-medium text-base transition-opacity disabled:opacity-30"
          style={{
            backgroundColor: accentColor,
            color: '#fff',
          }}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
