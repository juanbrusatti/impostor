import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * VoteCountAnimation
 * Muestra una animación de barras llenándose para simular el recuento de votos.
 * Props:
 * - votes: Array de objetos { name: string, count: number }
 * - onComplete: callback cuando termina la animación
 */
const VoteCountAnimation = ({ votes, onComplete }) => {
  const [step, setStep] = React.useState(0);
  const totalSteps = votes.length;

  React.useEffect(() => {
    if (step < totalSteps) {
      const timer = setTimeout(() => setStep(step + 1), 1500);
      return () => clearTimeout(timer);
    } else if (step === totalSteps && onComplete) {
      onComplete();
    }
  }, [step, totalSteps, onComplete]);

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {votes.map((vote, idx) => (
        <div key={vote.name} className="w-full flex flex-col items-center">
          <span className="mb-2 text-lg font-bold text-black-700 drop-shadow-sm" style={{letterSpacing: '0.5px'}}>{vote.name}</span>
          <div className="w-full h-10 bg-gray-200 rounded-full overflow-hidden shadow-md">
            <AnimatePresence>
              {step > idx && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(vote.count / Math.max(...votes.map(v => v.count))) * 100}%` }}
                  exit={{ width: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-blue-500 rounded-full shadow-lg"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
      <div className="mt-6 text-lg text-white-500 font-semibold">
        {step < totalSteps ? 'Recontando votos...' : '¡Recuento finalizado!'}
      </div>
    </div>
  );
};

export default VoteCountAnimation;
