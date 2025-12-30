import { motion } from 'framer-motion';
import { PetType } from '@/types';
import { cn } from '@/lib/utils';

interface PixelPetProps {
  type: PetType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
  className?: string;
  onClick?: () => void;
}

const petSprites: Record<PetType, { body: string; eyes: string; accent: string }> = {
  fire: {
    body: 'bg-gradient-to-b from-orange-400 to-red-500',
    eyes: 'bg-yellow-300',
    accent: 'bg-orange-300',
  },
  water: {
    body: 'bg-gradient-to-b from-cyan-400 to-blue-500',
    eyes: 'bg-sky-200',
    accent: 'bg-blue-300',
  },
  grass: {
    body: 'bg-gradient-to-b from-green-400 to-emerald-500',
    eyes: 'bg-lime-200',
    accent: 'bg-green-300',
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
  onClick 
}: PixelPetProps) => {
  const sprite = petSprites[type];
  const sizeClass = sizeClasses[size];

  const baseSize = size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 40;
  const pixelSize = baseSize / 8;

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer select-none',
        sizeClass,
        className
      )}
      onClick={onClick}
      animate={isAnimated ? {
        y: [0, -8, 0],
      } : undefined}
      transition={isAnimated ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      } : undefined}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, rotate: [0, -5, 5, 0] }}
    >
      {/* Pet body - Pixel art style creature */}
      <div className="relative w-full h-full">
        {/* Main body */}
        <div 
          className={cn(
            'absolute rounded-2xl pixel-perfect',
            sprite.body,
          )}
          style={{
            left: '15%',
            top: '20%',
            width: '70%',
            height: '65%',
            boxShadow: `
              inset 4px 4px 0 rgba(255,255,255,0.3),
              inset -4px -4px 0 rgba(0,0,0,0.2)
            `,
          }}
        />
        
        {/* Ears/Horns based on type */}
        {type === 'fire' && (
          <>
            <div 
              className="absolute bg-orange-500 rounded-t-full"
              style={{ left: '20%', top: '5%', width: '20%', height: '25%' }}
            />
            <div 
              className="absolute bg-orange-500 rounded-t-full"
              style={{ right: '20%', top: '5%', width: '20%', height: '25%' }}
            />
            {/* Flame effect */}
            <motion.div 
              className="absolute bg-yellow-400 rounded-full opacity-80"
              style={{ left: '25%', top: '0%', width: '12%', height: '15%' }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bg-yellow-400 rounded-full opacity-80"
              style={{ right: '25%', top: '0%', width: '12%', height: '15%' }}
              animate={{ opacity: [1, 0.6, 1], scale: [1.1, 0.9, 1.1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </>
        )}
        
        {type === 'water' && (
          <>
            <div 
              className="absolute bg-cyan-400 rounded-full"
              style={{ left: '15%', top: '12%', width: '25%', height: '20%' }}
            />
            <div 
              className="absolute bg-cyan-400 rounded-full"
              style={{ right: '15%', top: '12%', width: '25%', height: '20%' }}
            />
            {/* Water droplet */}
            <motion.div 
              className="absolute bg-blue-300 rounded-full opacity-60"
              style={{ left: '40%', top: '5%', width: '20%', height: '12%' }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}
        
        {type === 'grass' && (
          <>
            {/* Leaves */}
            <div 
              className="absolute bg-green-500 rounded-full"
              style={{ left: '35%', top: '2%', width: '30%', height: '22%' }}
            />
            <div 
              className="absolute bg-lime-400 rounded-full"
              style={{ left: '30%', top: '5%', width: '15%', height: '15%' }}
            />
            <div 
              className="absolute bg-lime-400 rounded-full"
              style={{ right: '30%', top: '5%', width: '15%', height: '15%' }}
            />
          </>
        )}
        
        {/* Eyes */}
        <div 
          className={cn('absolute rounded-full', sprite.eyes)}
          style={{ 
            left: '28%', 
            top: '35%', 
            width: '18%', 
            height: '18%',
            boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.1)',
          }}
        >
          {/* Pupil */}
          <motion.div 
            className="absolute bg-gray-800 rounded-full"
            style={{ left: '35%', top: '35%', width: '40%', height: '40%' }}
            animate={{ x: [0, 1, 0, -1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Highlight */}
          <div 
            className="absolute bg-white rounded-full"
            style={{ left: '55%', top: '20%', width: '25%', height: '25%' }}
          />
        </div>
        
        <div 
          className={cn('absolute rounded-full', sprite.eyes)}
          style={{ 
            right: '28%', 
            top: '35%', 
            width: '18%', 
            height: '18%',
            boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.1)',
          }}
        >
          <motion.div 
            className="absolute bg-gray-800 rounded-full"
            style={{ left: '35%', top: '35%', width: '40%', height: '40%' }}
            animate={{ x: [0, 1, 0, -1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div 
            className="absolute bg-white rounded-full"
            style={{ left: '55%', top: '20%', width: '25%', height: '25%' }}
          />
        </div>
        
        {/* Mouth - Happy smile */}
        <div 
          className="absolute bg-gray-700 rounded-b-full"
          style={{ 
            left: '38%', 
            top: '58%', 
            width: '24%', 
            height: '10%',
          }}
        />
        
        {/* Cheeks - Blush */}
        <div 
          className={cn('absolute rounded-full opacity-50', sprite.accent)}
          style={{ left: '15%', top: '50%', width: '15%', height: '12%' }}
        />
        <div 
          className={cn('absolute rounded-full opacity-50', sprite.accent)}
          style={{ right: '15%', top: '50%', width: '15%', height: '12%' }}
        />
        
        {/* Feet */}
        <div 
          className={cn('absolute rounded-b-lg', sprite.body)}
          style={{ 
            left: '22%', 
            bottom: '5%', 
            width: '22%', 
            height: '18%',
            filter: 'brightness(0.85)',
          }}
        />
        <div 
          className={cn('absolute rounded-b-lg', sprite.body)}
          style={{ 
            right: '22%', 
            bottom: '5%', 
            width: '22%', 
            height: '18%',
            filter: 'brightness(0.85)',
          }}
        />
      </div>
    </motion.div>
  );
};
