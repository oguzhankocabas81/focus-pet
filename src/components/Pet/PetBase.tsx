import { motion } from 'framer-motion';
import { PetType } from '@/types';
import { cn } from '@/lib/utils';

interface PetBaseProps {
  type: PetType;
  stage: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'neutral' | 'sad';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-16 h-16',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

// Evolution names for display
export const EVOLUTION_NAMES: Record<PetType, Record<1 | 2 | 3, { name: string; title: string }>> = {
  fire: {
    1: { name: 'Flare-Kit', title: 'Playful fire sprite' },
    2: { name: 'Pyro-Dash', title: 'Swift fox with streak power' },
    3: { name: 'Flame Kinetic', title: 'Master of blazing speed' },
  },
  water: {
    1: { name: 'Tick-Tot', title: 'Curious water pup' },
    2: { name: 'Tempo-Serpent', title: 'Time-tracking dragon' },
    3: { name: 'Aqua Chronos', title: 'Master of time & tides' },
  },
  grass: {
    1: { name: 'Root-Ling', title: 'Earth seed connected' },
    2: { name: 'Ignis-Prime', title: 'Growing forest spirit' },
    3: { name: 'Terra Savant', title: 'Wise nature guardian' },
  },
};

export const getEvolutionStage = (level: number): 1 | 2 | 3 => {
  if (level >= 21) return 3;
  if (level >= 11) return 2;
  return 1;
};

export const PetBase = ({
  type,
  stage,
  size = 'lg',
  mood = 'happy',
  className,
}: PetBaseProps) => {
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={cn('relative', sizeClass, className)}>
      {type === 'fire' && <FirePet stage={stage} mood={mood} />}
      {type === 'water' && <WaterPet stage={stage} mood={mood} />}
      {type === 'grass' && <GrassPet stage={stage} mood={mood} />}
    </div>
  );
};

// Fire Pet stages
const FirePet = ({ stage, mood }: { stage: 1 | 2 | 3; mood: string }) => {
  const eyeStyle = mood === 'happy' ? 'rounded-full' : mood === 'sad' ? 'rounded-t-full' : 'rounded-full';
  
  if (stage === 1) {
    return (
      <div className="relative w-full h-full">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-full blur-lg scale-125" />
        {/* Body */}
        <div className="absolute inset-1 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-[40%] shadow-lg" />
        {/* Belly */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/5 h-2/5 bg-gradient-to-b from-orange-100 to-orange-200 rounded-[50%]" />
        {/* Ears */}
        <motion.div 
          className="absolute -top-1 left-2 w-1/4 h-1/4 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-full"
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -top-1 right-2 w-1/4 h-1/4 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-full"
          animate={{ rotate: [3, -3, 3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Flame tufts */}
        <motion.div 
          className="absolute -top-2 left-3 w-2 h-3 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full"
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -top-2 right-3 w-2 h-3 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full"
          animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        {/* Eyes */}
        <div className={cn("absolute top-1/3 left-1/4 w-1/5 h-1/5 bg-amber-50", eyeStyle)}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-amber-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/4 h-1/4 bg-white rounded-full" />
        </div>
        <div className={cn("absolute top-1/3 right-1/4 w-1/5 h-1/5 bg-amber-50", eyeStyle)}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-amber-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/4 h-1/4 bg-white rounded-full" />
        </div>
        {/* Nose & mouth */}
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-2 h-1.5 bg-red-400 rounded-full" />
        {mood === 'happy' && (
          <div className="absolute top-[62%] left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full bg-red-400" />
        )}
        {/* Blush */}
        <div className="absolute top-[45%] left-1 w-2 h-1.5 bg-red-300/50 rounded-full" />
        <div className="absolute top-[45%] right-1 w-2 h-1.5 bg-red-300/50 rounded-full" />
        {/* Tail flame */}
        <motion.div 
          className="absolute -right-2 top-1/2 w-4 h-5"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <div className="w-full h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-200 rounded-full" />
        </motion.div>
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="relative w-full h-full">
        {/* Enhanced glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/40 to-red-500/40 rounded-full blur-xl scale-150" />
        {/* Body - more athletic */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-orange-500 rounded-[35%_35%_40%_40%] shadow-lg" />
        {/* Belly pattern */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-2/5 bg-gradient-to-b from-yellow-100 to-orange-200 rounded-[50%]" />
        {/* Ears - larger and more pointed */}
        <motion.div 
          className="absolute -top-3 left-1 w-1/4 h-1/3 bg-gradient-to-t from-red-500 to-orange-400"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -top-3 right-1 w-1/4 h-1/3 bg-gradient-to-t from-red-500 to-orange-400"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Flame mane */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full"
            style={{
              top: '-20%',
              left: `${15 + i * 15}%`,
              width: '15%',
              height: '30%',
            }}
            animate={{ 
              scaleY: [0.8, 1.2, 0.8],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
        {/* Eyes - more determined */}
        <div className={cn("absolute top-[30%] left-[22%] w-[22%] h-[22%] bg-amber-50", eyeStyle)}>
          <div className="absolute top-[20%] left-[20%] w-[55%] h-[55%] bg-gradient-to-br from-red-600 to-amber-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
        </div>
        <div className={cn("absolute top-[30%] right-[22%] w-[22%] h-[22%] bg-amber-50", eyeStyle)}>
          <div className="absolute top-[20%] left-[20%] w-[55%] h-[55%] bg-gradient-to-br from-red-600 to-amber-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
        </div>
        {/* Nose */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-3 h-2 bg-red-500 rounded-full" />
        {/* Tail - larger flame */}
        <motion.div 
          className="absolute -right-4 top-[40%] w-8 h-8"
          animate={{ rotate: [-15, 15, -15], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="w-full h-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 rounded-full" />
        </motion.div>
      </div>
    );
  }

  // Stage 3 - Final evolution
  return (
    <div className="relative w-full h-full">
      {/* Powerful aura */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-red-500/50 to-orange-400/50 rounded-full blur-2xl scale-[1.8]"
        animate={{ scale: [1.7, 2, 1.7], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Body - majestic */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-[30%_30%_35%_35%] shadow-xl" />
      {/* Armor-like pattern */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b from-orange-300/50 to-transparent rounded-t-full" />
      {/* Belly */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2/5 h-1/3 bg-gradient-to-b from-yellow-200 to-orange-300 rounded-[50%]" />
      {/* Crown flames */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-t from-red-500 via-orange-400 to-yellow-200"
          style={{
            top: '-25%',
            left: `${8 + i * 12}%`,
            width: '12%',
            height: i % 2 === 0 ? '35%' : '28%',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
          animate={{ 
            scaleY: [0.9, 1.15, 0.9],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
        />
      ))}
      {/* Intense eyes */}
      <div className={cn("absolute top-[28%] left-[20%] w-[25%] h-[25%] bg-gradient-to-br from-yellow-100 to-amber-100", eyeStyle)}>
        <div className="absolute top-[15%] left-[15%] w-[60%] h-[60%] bg-gradient-to-br from-red-700 to-orange-600 rounded-full">
          <div className="absolute inset-1 rounded-full border-2 border-yellow-400/50" />
        </div>
        <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
      </div>
      <div className={cn("absolute top-[28%] right-[20%] w-[25%] h-[25%] bg-gradient-to-br from-yellow-100 to-amber-100", eyeStyle)}>
        <div className="absolute top-[15%] left-[15%] w-[60%] h-[60%] bg-gradient-to-br from-red-700 to-orange-600 rounded-full">
          <div className="absolute inset-1 rounded-full border-2 border-yellow-400/50" />
        </div>
        <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
      </div>
      {/* Nose */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-3 h-2 bg-red-600 rounded-full" />
      {/* Tail - blazing */}
      <motion.div 
        className="absolute -right-6 top-[35%] w-10 h-12"
        animate={{ rotate: [-20, 20, -20], scale: [1, 1.15, 1] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      >
        <div className="w-full h-full bg-gradient-to-r from-red-600 via-orange-400 to-yellow-200 rounded-full" />
        <motion.div 
          className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-yellow-100 rounded-full blur-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

// Water Pet stages
const WaterPet = ({ stage, mood }: { stage: 1 | 2 | 3; mood: string }) => {
  const eyeStyle = mood === 'happy' ? 'rounded-full' : 'rounded-full';

  if (stage === 1) {
    return (
      <div className="relative w-full h-full">
        {/* Water glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/30 to-blue-400/30 rounded-full blur-lg scale-125" />
        {/* Body */}
        <div className="absolute inset-1 bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-500 rounded-[45%] shadow-lg" />
        {/* Belly */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/5 h-2/5 bg-gradient-to-b from-cyan-100 to-blue-200 rounded-[50%]" />
        {/* Fins/ears */}
        <motion.div 
          className="absolute -top-1 left-1 w-1/4 h-1/4 bg-gradient-to-t from-blue-400 to-cyan-300 rounded-t-full"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -top-1 right-1 w-1/4 h-1/4 bg-gradient-to-t from-blue-400 to-cyan-300 rounded-t-full"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        {/* Eyes */}
        <div className={cn("absolute top-1/3 left-1/4 w-1/5 h-1/5 bg-blue-50", eyeStyle)}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/4 h-1/4 bg-white rounded-full" />
        </div>
        <div className={cn("absolute top-1/3 right-1/4 w-1/5 h-1/5 bg-blue-50", eyeStyle)}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/4 h-1/4 bg-white rounded-full" />
        </div>
        {/* Nose & mouth */}
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-2 h-1.5 bg-blue-500 rounded-full" />
        {mood === 'happy' && (
          <div className="absolute top-[62%] left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full bg-blue-500" />
        )}
        {/* Bubbles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-cyan-200 rounded-full border border-white/50"
            style={{ right: `${10 + i * 8}%`, top: `${20 + i * 15}%` }}
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
        {/* Tail */}
        <motion.div 
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
          animate={{ scaleX: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="relative w-full h-full">
        {/* Enhanced glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-full blur-xl scale-150" />
        {/* Body - serpentine */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-[35%] shadow-lg" />
        {/* Scale pattern */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-3/4 h-2/3 bg-gradient-to-b from-blue-300/30 to-transparent rounded-full" />
        {/* Belly */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-gradient-to-b from-cyan-100 to-blue-200 rounded-[50%]" />
        {/* Dragon fins */}
        <motion.div 
          className="absolute -top-3 left-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-500 to-cyan-400"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -top-3 right-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-500 to-cyan-400"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{ rotate: [8, -8, 8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Eyes */}
        <div className={cn("absolute top-[28%] left-[20%] w-[22%] h-[22%] bg-blue-50", eyeStyle)}>
          <div className="absolute top-[20%] left-[20%] w-[55%] h-[55%] bg-gradient-to-br from-blue-700 to-indigo-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
        </div>
        <div className={cn("absolute top-[28%] right-[20%] w-[22%] h-[22%] bg-blue-50", eyeStyle)}>
          <div className="absolute top-[20%] left-[20%] w-[55%] h-[55%] bg-gradient-to-br from-blue-700 to-indigo-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
        </div>
        {/* Nose */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-3 h-2 bg-blue-600 rounded-full" />
        {/* Tail fin */}
        <motion.div 
          className="absolute -right-4 top-[40%] w-6 h-8"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-300 rounded-r-full" />
        </motion.div>
        {/* Bubbles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-200 rounded-full border border-white/50"
            style={{ right: `${-5 + i * 10}%`, top: `${10 + i * 12}%` }}
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>
    );
  }

  // Stage 3
  return (
    <div className="relative w-full h-full">
      {/* Majestic aura */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 rounded-full blur-2xl scale-[1.8]"
        animate={{ scale: [1.7, 2, 1.7], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Body */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 rounded-[30%] shadow-xl" />
      {/* Armor pattern */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-4/5 h-3/5 bg-gradient-to-b from-cyan-300/40 to-transparent rounded-t-full" />
      {/* Belly */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2/5 h-1/3 bg-gradient-to-b from-cyan-100 to-blue-200 rounded-[50%]" />
      {/* Crown fins */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-t from-indigo-600 to-cyan-300"
          style={{
            top: '-20%',
            left: `${12 + i * 15}%`,
            width: '15%',
            height: i % 2 === 0 ? '30%' : '22%',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
          animate={{ scaleY: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      {/* Eyes */}
      <div className={cn("absolute top-[26%] left-[18%] w-[25%] h-[25%] bg-gradient-to-br from-cyan-100 to-blue-100", eyeStyle)}>
        <div className="absolute top-[15%] left-[15%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-700 to-blue-900 rounded-full">
          <div className="absolute inset-1 rounded-full border-2 border-cyan-300/50" />
        </div>
        <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
      </div>
      <div className={cn("absolute top-[26%] right-[18%] w-[25%] h-[25%] bg-gradient-to-br from-cyan-100 to-blue-100", eyeStyle)}>
        <div className="absolute top-[15%] left-[15%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-700 to-blue-900 rounded-full">
          <div className="absolute inset-1 rounded-full border-2 border-cyan-300/50" />
        </div>
        <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
      </div>
      {/* Nose */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-3 h-2 bg-indigo-600 rounded-full" />
      {/* Tail */}
      <motion.div 
        className="absolute -right-5 top-[35%] w-8 h-10"
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-blue-400 to-cyan-200 rounded-r-full" />
      </motion.div>
      {/* Orbiting bubbles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-200 rounded-full border border-white/60"
          style={{ right: `${-8 + i * 8}%`, top: `${5 + i * 10}%` }}
          animate={{ 
            y: [0, -20, 0], 
            x: [0, i % 2 === 0 ? 5 : -5, 0],
            opacity: [0.4, 1, 0.4] 
          }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
};

// Grass Pet stages
const GrassPet = ({ stage, mood }: { stage: 1 | 2 | 3; mood: string }) => {
  const eyeStyle = mood === 'happy' ? 'rounded-full' : 'rounded-full';

  if (stage === 1) {
    return (
      <div className="relative w-full h-full">
        {/* Nature glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-300/30 to-emerald-400/30 rounded-full blur-lg scale-125" />
        {/* Body */}
        <div className="absolute inset-1 bg-gradient-to-br from-green-300 via-green-400 to-emerald-500 rounded-[45%] shadow-lg" />
        {/* Belly */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/5 h-2/5 bg-gradient-to-b from-lime-100 to-green-200 rounded-[50%]" />
        {/* Leaf ears */}
        <motion.div 
          className="absolute -top-2 left-1 w-1/4 h-1/3 bg-gradient-to-t from-green-500 to-lime-400 rounded-t-full"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -top-2 right-1 w-1/4 h-1/3 bg-gradient-to-t from-green-500 to-lime-400 rounded-t-full"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Eyes */}
        <div className={cn("absolute top-1/3 left-1/4 w-1/5 h-1/5 bg-lime-50", eyeStyle)}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/4 h-1/4 bg-white rounded-full" />
        </div>
        <div className={cn("absolute top-1/3 right-1/4 w-1/5 h-1/5 bg-lime-50", eyeStyle)}>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/4 h-1/4 bg-white rounded-full" />
        </div>
        {/* Nose & mouth */}
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-2 h-1.5 bg-green-600 rounded-full" />
        {mood === 'happy' && (
          <div className="absolute top-[62%] left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full bg-green-600" />
        )}
        {/* Blush */}
        <div className="absolute top-[45%] left-1 w-2 h-1.5 bg-pink-300/50 rounded-full" />
        <div className="absolute top-[45%] right-1 w-2 h-1.5 bg-pink-300/50 rounded-full" />
        {/* Vine tail */}
        <motion.div 
          className="absolute -right-3 top-1/2 -translate-y-1/4 w-5 h-3 bg-gradient-to-r from-green-500 to-lime-400 rounded-full"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Little leaf */}
        <motion.div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-4 bg-lime-400 rounded-t-full"
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="relative w-full h-full">
        {/* Enhanced glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/40 to-emerald-500/40 rounded-full blur-xl scale-150" />
        {/* Body */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-[35%] shadow-lg" />
        {/* Pattern */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-3/4 h-2/3 bg-gradient-to-b from-lime-300/30 to-transparent rounded-full" />
        {/* Belly */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-gradient-to-b from-lime-100 to-green-200 rounded-[50%]" />
        {/* Leaf crown */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-t from-emerald-500 to-lime-400"
            style={{
              top: '-15%',
              left: `${15 + i * 18}%`,
              width: '18%',
              height: '25%',
              borderRadius: '50% 50% 50% 50%',
              transform: `rotate(${(i - 1.5) * 20}deg)`,
            }}
            animate={{ rotate: [(i - 1.5) * 20 - 3, (i - 1.5) * 20 + 3, (i - 1.5) * 20 - 3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        {/* Eyes */}
        <div className={cn("absolute top-[28%] left-[20%] w-[22%] h-[22%] bg-lime-50", eyeStyle)}>
          <div className="absolute top-[20%] left-[20%] w-[55%] h-[55%] bg-gradient-to-br from-green-700 to-emerald-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
        </div>
        <div className={cn("absolute top-[28%] right-[20%] w-[22%] h-[22%] bg-lime-50", eyeStyle)}>
          <div className="absolute top-[20%] left-[20%] w-[55%] h-[55%] bg-gradient-to-br from-green-700 to-emerald-900 rounded-full" />
          <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
        </div>
        {/* Nose */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-3 h-2 bg-green-700 rounded-full" />
        {/* Vine tail */}
        <motion.div 
          className="absolute -right-5 top-[45%] w-7 h-4"
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full" />
        </motion.div>
        {/* Floating leaves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-3 bg-lime-400 rounded-full"
            style={{ right: `${-5 + i * 12}%`, top: `${15 + i * 20}%` }}
            animate={{ 
              y: [0, -8, 0], 
              rotate: [0, 360],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>
    );
  }

  // Stage 3
  return (
    <div className="relative w-full h-full">
      {/* Nature aura */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/50 to-green-400/50 rounded-full blur-2xl scale-[1.8]"
        animate={{ scale: [1.7, 2, 1.7], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />
      {/* Body */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-[30%] shadow-xl" />
      {/* Pattern */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-4/5 h-3/5 bg-gradient-to-b from-lime-300/40 to-transparent rounded-t-full" />
      {/* Belly */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2/5 h-1/3 bg-gradient-to-b from-lime-100 to-green-200 rounded-[50%]" />
      {/* Majestic leaf crown */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-t from-teal-600 via-emerald-500 to-lime-400"
          style={{
            top: '-22%',
            left: `${8 + i * 14}%`,
            width: '14%',
            height: i % 2 === 0 ? '30%' : '24%',
            borderRadius: '50% 50% 50% 50%',
            transform: `rotate(${(i - 2.5) * 15}deg)`,
          }}
          animate={{ 
            rotate: [(i - 2.5) * 15 - 5, (i - 2.5) * 15 + 5, (i - 2.5) * 15 - 5],
            scaleY: [1, 1.05, 1]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      {/* Center flower */}
      <motion.div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-400 rounded-full"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-1 bg-yellow-300 rounded-full" />
      </motion.div>
      {/* Eyes */}
      <div className={cn("absolute top-[26%] left-[18%] w-[25%] h-[25%] bg-gradient-to-br from-lime-100 to-green-100", eyeStyle)}>
        <div className="absolute top-[15%] left-[15%] w-[60%] h-[60%] bg-gradient-to-br from-teal-700 to-green-900 rounded-full">
          <div className="absolute inset-1 rounded-full border-2 border-lime-300/50" />
        </div>
        <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
      </div>
      <div className={cn("absolute top-[26%] right-[18%] w-[25%] h-[25%] bg-gradient-to-br from-lime-100 to-green-100", eyeStyle)}>
        <div className="absolute top-[15%] left-[15%] w-[60%] h-[60%] bg-gradient-to-br from-teal-700 to-green-900 rounded-full">
          <div className="absolute inset-1 rounded-full border-2 border-lime-300/50" />
        </div>
        <div className="absolute top-1 right-1 w-1/3 h-1/3 bg-white rounded-full" />
      </div>
      {/* Nose */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-3 h-2 bg-green-700 rounded-full" />
      {/* Vine tail */}
      <motion.div 
        className="absolute -right-6 top-[38%] w-9 h-5"
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-full h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-lime-300 rounded-full" />
        <motion.div
          className="absolute right-0 -top-1 w-3 h-3 bg-pink-400 rounded-full"
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="absolute inset-0.5 bg-yellow-300 rounded-full" />
        </motion.div>
      </motion.div>
      {/* Floating petals */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-pink-300 rounded-full"
          style={{ right: `${-5 + i * 10}%`, top: `${10 + i * 15}%` }}
          animate={{ 
            y: [0, -15, 0],
            x: [0, i % 2 === 0 ? 8 : -8, 0],
            rotate: [0, 360],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  );
};
