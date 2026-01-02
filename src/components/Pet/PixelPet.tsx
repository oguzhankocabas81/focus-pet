import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PetType } from '@/types';
import { cn } from '@/lib/utils';

interface PixelPetProps {
  type: PetType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
  className?: string;
  onClick?: () => void;
  showParticles?: boolean;
  mood?: 'happy' | 'neutral' | 'sad';
}

const petConfig: Record<PetType, { 
  body: string; 
  eyes: string; 
  accent: string;
  gradient: string;
  shadow: string;
  particle: string;
}> = {
  fire: {
    body: 'from-orange-400 via-red-500 to-orange-600',
    eyes: 'bg-yellow-300',
    accent: 'bg-orange-300',
    gradient: 'from-orange-500/30 to-red-500/30',
    shadow: 'shadow-orange-500/50',
    particle: '🔥',
  },
  water: {
    body: 'from-cyan-400 via-blue-500 to-cyan-600',
    eyes: 'bg-sky-200',
    accent: 'bg-blue-300',
    gradient: 'from-cyan-500/30 to-blue-500/30',
    shadow: 'shadow-blue-500/50',
    particle: '💧',
  },
  grass: {
    body: 'from-green-400 via-emerald-500 to-green-600',
    eyes: 'bg-lime-200',
    accent: 'bg-green-300',
    gradient: 'from-green-500/30 to-emerald-500/30',
    shadow: 'shadow-green-500/50',
    particle: '🍃',
  },
};

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

export const PixelPet = ({ 
  type, 
  size = 'lg', 
  isAnimated = true,
  className,
  onClick,
  showParticles = false,
  mood = 'happy',
}: PixelPetProps) => {
  const config = petConfig[type];
  const sizeClass = sizeClasses[size];
  const [isInteracting, setIsInteracting] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const handleClick = () => {
    setIsInteracting(true);
    
    // Spawn particles on click
    const newParticles = Array.from({ length: 5 }, (_, i) => Date.now() + i);
    setParticles(newParticles);
    
    setTimeout(() => {
      setIsInteracting(false);
      setParticles([]);
    }, 800);
    
    onClick?.();
  };

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer select-none',
        sizeClass,
        className
      )}
      onClick={handleClick}
      animate={isAnimated && !isInteracting ? {
        y: [0, -8, 0],
      } : undefined}
      transition={isAnimated ? {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      } : undefined}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
    >
      {/* Glow effect behind pet */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-r blur-xl opacity-60',
          config.gradient
        )}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Pet body container */}
      <div className="relative w-full h-full">
        {/* Main body - rounder shape */}
        <motion.div 
          className={cn(
            'absolute rounded-[40%] bg-gradient-to-br shadow-lg',
            config.body,
            config.shadow
          )}
          style={{
            left: '12%',
            top: '18%',
            width: '76%',
            height: '68%',
            boxShadow: `
              inset 6px 6px 12px rgba(255,255,255,0.3),
              inset -4px -4px 8px rgba(0,0,0,0.2),
              0 8px 24px -4px rgba(0,0,0,0.3)
            `,
          }}
          animate={isInteracting ? { rotate: [-5, 5, -5, 0] } : {}}
          transition={{ duration: 0.4 }}
        />

        {/* Type-specific features */}
        {type === 'fire' && <FireFeatures isInteracting={isInteracting} />}
        {type === 'water' && <WaterFeatures isInteracting={isInteracting} />}
        {type === 'grass' && <GrassFeatures isInteracting={isInteracting} />}

        {/* Eyes */}
        <Eye 
          config={config} 
          side="left" 
          mood={mood}
          isInteracting={isInteracting}
        />
        <Eye 
          config={config} 
          side="right" 
          mood={mood}
          isInteracting={isInteracting}
        />

        {/* Mouth */}
        <Mouth mood={mood} isInteracting={isInteracting} />

        {/* Cheeks - Blush */}
        <motion.div 
          className={cn('absolute rounded-full opacity-50', config.accent)}
          style={{ left: '12%', top: '52%', width: '16%', height: '12%' }}
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className={cn('absolute rounded-full opacity-50', config.accent)}
          style={{ right: '12%', top: '52%', width: '16%', height: '12%' }}
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />

        {/* Feet with subtle animation */}
        <motion.div 
          className={cn('absolute rounded-b-xl bg-gradient-to-br', config.body)}
          style={{ 
            left: '20%', 
            bottom: '4%', 
            width: '24%', 
            height: '20%',
            filter: 'brightness(0.85)',
          }}
          animate={{ scaleY: [1, 0.9, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className={cn('absolute rounded-b-xl bg-gradient-to-br', config.body)}
          style={{ 
            right: '20%', 
            bottom: '4%', 
            width: '24%', 
            height: '20%',
            filter: 'brightness(0.85)',
          }}
          animate={{ scaleY: [1, 0.9, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />

        {/* Arms */}
        <motion.div 
          className={cn('absolute rounded-full bg-gradient-to-br', config.body)}
          style={{ 
            left: '2%', 
            top: '45%', 
            width: '16%', 
            height: '22%',
            filter: 'brightness(0.9)',
          }}
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className={cn('absolute rounded-full bg-gradient-to-br', config.body)}
          style={{ 
            right: '2%', 
            top: '45%', 
            width: '16%', 
            height: '22%',
            filter: 'brightness(0.9)',
          }}
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Click particles */}
      <AnimatePresence>
        {particles.map((id, i) => (
          <motion.div
            key={id}
            className="absolute text-2xl pointer-events-none"
            initial={{ 
              x: '50%', 
              y: '50%', 
              scale: 0, 
              opacity: 1 
            }}
            animate={{ 
              x: `${50 + (Math.random() - 0.5) * 100}%`,
              y: `${(Math.random() - 0.5) * 100}%`,
              scale: 1.2,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {config.particle}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ambient particles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{
                left: `${20 + i * 30}%`,
                bottom: '100%',
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0, 1, 0],
                x: [0, (i - 1) * 10, 0],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            >
              {config.particle}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Eye component
const Eye = ({ 
  config, 
  side, 
  mood,
  isInteracting,
}: { 
  config: typeof petConfig.fire; 
  side: 'left' | 'right';
  mood: 'happy' | 'neutral' | 'sad';
  isInteracting: boolean;
}) => {
  const positionStyle = side === 'left' 
    ? { left: '26%', top: '36%' }
    : { right: '26%', top: '36%' };

  return (
    <motion.div 
      className={cn('absolute rounded-full', config.eyes)}
      style={{ 
        ...positionStyle,
        width: '20%', 
        height: '20%',
        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)',
      }}
      animate={isInteracting ? { scaleY: [1, 0.2, 1] } : {}}
      transition={{ duration: 0.15 }}
    >
      {/* Pupil */}
      <motion.div 
        className="absolute bg-gray-800 rounded-full"
        style={{ left: '30%', top: '30%', width: '45%', height: '45%' }}
        animate={{ 
          x: [0, 2, 0, -2, 0],
          y: [0, -1, 0, 1, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {/* Highlight */}
      <div 
        className="absolute bg-white rounded-full"
        style={{ left: '55%', top: '18%', width: '28%', height: '28%' }}
      />
      {/* Secondary highlight */}
      <div 
        className="absolute bg-white/60 rounded-full"
        style={{ left: '25%', top: '55%', width: '15%', height: '15%' }}
      />
    </motion.div>
  );
};

// Mouth component
const Mouth = ({ mood, isInteracting }: { mood: string; isInteracting: boolean }) => {
  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{ 
        left: '36%', 
        top: '60%', 
        width: '28%', 
        height: mood === 'happy' ? '14%' : '8%',
      }}
      animate={isInteracting ? { scaleX: [1, 1.3, 1] } : {}}
    >
      <div 
        className={cn(
          'absolute bg-gray-700 w-full',
          mood === 'happy' ? 'rounded-b-full h-full' : 'rounded-full h-full'
        )}
      />
      {mood === 'happy' && (
        <div 
          className="absolute bg-pink-400 rounded-full"
          style={{ left: '25%', top: '50%', width: '50%', height: '60%' }}
        />
      )}
    </motion.div>
  );
};

// Fire type features
const FireFeatures = ({ isInteracting }: { isInteracting: boolean }) => (
  <>
    {/* Horns */}
    <motion.div 
      className="absolute bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-full"
      style={{ left: '18%', top: '3%', width: '22%', height: '25%' }}
      animate={isInteracting ? { scaleY: [1, 1.2, 1] } : {}}
    />
    <motion.div 
      className="absolute bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-full"
      style={{ right: '18%', top: '3%', width: '22%', height: '25%' }}
      animate={isInteracting ? { scaleY: [1, 1.2, 1] } : {}}
    />
    
    {/* Flame tips */}
    <motion.div 
      className="absolute bg-yellow-400 rounded-full"
      style={{ left: '22%', top: '-2%', width: '14%', height: '18%' }}
      animate={{ 
        opacity: [0.6, 1, 0.6], 
        scale: [0.9, 1.15, 0.9],
        y: [0, -3, 0],
      }}
      transition={{ duration: 0.4, repeat: Infinity }}
    />
    <motion.div 
      className="absolute bg-yellow-400 rounded-full"
      style={{ right: '22%', top: '-2%', width: '14%', height: '18%' }}
      animate={{ 
        opacity: [1, 0.6, 1], 
        scale: [1.15, 0.9, 1.15],
        y: [-2, 1, -2],
      }}
      transition={{ duration: 0.4, repeat: Infinity }}
    />
    
    {/* Inner flame glow */}
    <motion.div 
      className="absolute bg-yellow-300/50 rounded-full blur-sm"
      style={{ left: '35%', top: '25%', width: '30%', height: '20%' }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </>
);

// Water type features
const WaterFeatures = ({ isInteracting }: { isInteracting: boolean }) => (
  <>
    {/* Fins/Ears */}
    <motion.div 
      className="absolute bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"
      style={{ left: '10%', top: '10%', width: '28%', height: '24%' }}
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.div 
      className="absolute bg-gradient-to-bl from-cyan-400 to-blue-500 rounded-full"
      style={{ right: '10%', top: '10%', width: '28%', height: '24%' }}
      animate={{ rotate: [5, -5, 5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Water droplet on head */}
    <motion.div 
      className="absolute bg-gradient-to-b from-sky-300 to-blue-400 rounded-full opacity-80"
      style={{ left: '38%', top: '2%', width: '24%', height: '16%' }}
      animate={{ 
        y: [0, -4, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Bubble effects */}
    <motion.div 
      className="absolute bg-white/40 rounded-full"
      style={{ right: '5%', top: '30%', width: '8%', height: '8%' }}
      animate={{ 
        y: [0, -15, 0],
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
    <motion.div 
      className="absolute bg-white/30 rounded-full"
      style={{ left: '8%', top: '35%', width: '6%', height: '6%' }}
      animate={{ 
        y: [0, -12, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
    />
  </>
);

// Grass type features
const GrassFeatures = ({ isInteracting }: { isInteracting: boolean }) => (
  <>
    {/* Main leaf on top */}
    <motion.div 
      className="absolute bg-gradient-to-t from-green-600 to-green-400 rounded-full"
      style={{ left: '32%', top: '-2%', width: '36%', height: '28%' }}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    
    {/* Side leaves */}
    <motion.div 
      className="absolute bg-gradient-to-tr from-lime-500 to-green-400 rounded-full"
      style={{ left: '20%', top: '3%', width: '20%', height: '18%' }}
      animate={{ rotate: [-8, 2, -8] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
    <motion.div 
      className="absolute bg-gradient-to-tl from-lime-500 to-green-400 rounded-full"
      style={{ right: '20%', top: '3%', width: '20%', height: '18%' }}
      animate={{ rotate: [8, -2, 8] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
    />
    
    {/* Leaf vein details */}
    <div 
      className="absolute bg-green-300/50 rounded-full"
      style={{ left: '45%', top: '2%', width: '10%', height: '15%' }}
    />
    
    {/* Flower bud */}
    <motion.div 
      className="absolute bg-pink-400 rounded-full"
      style={{ left: '44%', top: '-5%', width: '12%', height: '12%' }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Pollen/sparkle */}
    <motion.div 
      className="absolute bg-yellow-300 rounded-full"
      style={{ left: '42%', top: '-8%', width: '6%', height: '6%' }}
      animate={{ 
        opacity: [0.5, 1, 0.5],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </>
);