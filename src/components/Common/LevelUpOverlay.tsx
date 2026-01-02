import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Coins, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LevelUpOverlayProps {
  show: boolean;
  level: number;
  coinsEarned: number;
  onClose: () => void;
}

export const LevelUpOverlay = ({ show, level, coinsEarned, onClose }: LevelUpOverlayProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9'][
          Math.floor(Math.random() * 7)
        ],
      }));
      setConfetti(particles);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Confetti */}
          {confetti.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: '-20px',
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{ 
                y: window.innerHeight + 50,
                opacity: [1, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: particle.delay,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Content */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative bg-background border-2 border-primary rounded-3xl p-8 mx-4 max-w-sm text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sparkle decorations */}
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-12 h-12 text-yellow-500" />
            </motion.div>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Star 
                    className={cn(
                      'w-8 h-8',
                      i === 1 ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-400 fill-yellow-400'
                    )} 
                  />
                </motion.div>
              ))}
            </div>

            {/* Level Up Text */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-foreground mb-2"
            >
              LEVEL UP!
            </motion.h2>

            {/* Level Number */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="relative inline-block mb-4"
            >
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                {level}
              </div>
              <motion.div
                className="absolute inset-0 text-7xl font-black text-primary/20 blur-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {level}
              </motion.div>
            </motion.div>

            {/* Coins Earned */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 mb-6 text-coin"
            >
              <Coins className="w-6 h-6" />
              <span className="text-2xl font-bold">+{coinsEarned}</span>
              <span className="text-sm font-medium">coins earned!</span>
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mb-6"
            >
              Your pet is growing stronger! Keep crushing those tasks! 💪
            </motion.p>

            {/* Continue Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                size="lg" 
                className="w-full"
                onClick={onClose}
              >
                Continue
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};