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
      {type === 'fire' && <FirePet3D stage={stage} mood={mood} />}
      {type === 'water' && <WaterPet3D stage={stage} mood={mood} />}
      {type === 'grass' && <GrassPet3D stage={stage} mood={mood} />}
    </div>
  );
};

// 3D-style Fire Pet
const FirePet3D = ({ stage, mood }: { stage: 1 | 2 | 3; mood: string }) => {
  const colors = {
    primary: 'from-orange-400 via-orange-500 to-red-500',
    secondary: 'from-yellow-300 to-orange-400',
    highlight: 'from-yellow-200 to-yellow-300',
    belly: 'from-orange-100 via-orange-200 to-orange-300',
  };

  return (
    <div className="relative w-full h-full">
      {/* Soft glow/shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400/20 to-red-500/30 rounded-full blur-xl scale-110" />
      
      {/* Main body - 3D rounded shape */}
      <div className={cn(
        "absolute inset-[5%] rounded-[45%_45%_50%_50%] shadow-lg",
        "bg-gradient-to-br", colors.primary
      )}>
        {/* 3D highlight on top */}
        <div className="absolute top-[5%] left-[15%] w-[70%] h-[30%] bg-gradient-to-b from-white/40 to-transparent rounded-full" />
        
        {/* Belly - lighter 3D area */}
        <div className={cn(
          "absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[45%] rounded-[50%]",
          "bg-gradient-to-b", colors.belly, "shadow-inner"
        )} />
      </div>

      {/* Ears */}
      <motion.div 
        className="absolute -top-[5%] left-[15%] w-[25%] h-[30%] bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-full shadow-md"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[40%] bg-gradient-to-t from-orange-300 to-yellow-200 rounded-t-full" />
      </motion.div>
      <motion.div 
        className="absolute -top-[5%] right-[15%] w-[25%] h-[30%] bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-full shadow-md"
        animate={{ rotate: [2, -2, 2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[40%] bg-gradient-to-t from-orange-300 to-yellow-200 rounded-t-full" />
      </motion.div>

      {/* Flame on head (stage 2+) */}
      {stage >= 2 && (
        <motion.div 
          className="absolute -top-[15%] left-1/2 -translate-x-1/2"
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="w-4 h-5 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full blur-[1px]" />
        </motion.div>
      )}

      {/* Eyes - 3D style with highlights */}
      <div className="absolute top-[30%] left-[20%] w-[22%] h-[22%] bg-white rounded-full shadow-md">
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-gradient-to-br from-amber-800 to-amber-900 rounded-full" />
        <div className="absolute top-[15%] right-[20%] w-[25%] h-[25%] bg-white rounded-full" />
        {mood === 'happy' && (
          <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-amber-800 to-transparent rounded-b-full" />
        )}
      </div>
      <div className="absolute top-[30%] right-[20%] w-[22%] h-[22%] bg-white rounded-full shadow-md">
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-gradient-to-br from-amber-800 to-amber-900 rounded-full" />
        <div className="absolute top-[15%] right-[20%] w-[25%] h-[25%] bg-white rounded-full" />
        {mood === 'happy' && (
          <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-amber-800 to-transparent rounded-b-full" />
        )}
      </div>

      {/* Nose */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[12%] h-[8%] bg-gradient-to-b from-red-400 to-red-500 rounded-full shadow-sm" />

      {/* Mouth */}
      {mood === 'happy' && (
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[20%] h-[10%] bg-gradient-to-b from-red-400 to-red-500 rounded-b-full" />
      )}

      {/* Blush */}
      <div className="absolute top-[48%] left-[8%] w-[15%] h-[10%] bg-red-300/50 rounded-full blur-sm" />
      <div className="absolute top-[48%] right-[8%] w-[15%] h-[10%] bg-red-300/50 rounded-full blur-sm" />

      {/* Tail flame */}
      <motion.div 
        className="absolute -right-[10%] top-[45%] w-[25%] h-[30%]"
        animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      >
        <div className="w-full h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-200 rounded-full shadow-lg blur-[1px]" />
      </motion.div>

      {/* Crown (stage 3) */}
      {stage >= 3 && (
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-4 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-t-full"
              animate={{ scaleY: [0.9, 1.1, 0.9] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 3D-style Water Pet  
const WaterPet3D = ({ stage, mood }: { stage: 1 | 2 | 3; mood: string }) => {
  return (
    <div className="relative w-full h-full">
      {/* Soft glow/shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-blue-500/30 rounded-full blur-xl scale-110" />
      
      {/* Main body - 3D rounded shape */}
      <div className="absolute inset-[5%] rounded-[45%_45%_50%_50%] shadow-lg bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500">
        {/* 3D highlight on top */}
        <div className="absolute top-[5%] left-[15%] w-[70%] h-[30%] bg-gradient-to-b from-white/40 to-transparent rounded-full" />
        
        {/* Belly - lighter 3D area */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[45%] rounded-[50%] bg-gradient-to-b from-cyan-100 via-cyan-200 to-blue-200 shadow-inner" />
      </div>

      {/* Fins/ears */}
      <motion.div 
        className="absolute -top-[5%] left-[15%] w-[25%] h-[30%] bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-full shadow-md"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[40%] bg-gradient-to-t from-cyan-300 to-cyan-200 rounded-t-full" />
      </motion.div>
      <motion.div 
        className="absolute -top-[5%] right-[15%] w-[25%] h-[30%] bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-full shadow-md"
        animate={{ rotate: [3, -3, 3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[40%] bg-gradient-to-t from-cyan-300 to-cyan-200 rounded-t-full" />
      </motion.div>

      {/* Water droplet on head (stage 2+) */}
      {stage >= 2 && (
        <motion.div 
          className="absolute -top-[12%] left-1/2 -translate-x-1/2"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-3 h-4 bg-gradient-to-b from-cyan-300 to-blue-400 rounded-full shadow-md" />
          <div className="absolute top-[20%] left-[25%] w-[30%] h-[20%] bg-white/60 rounded-full" />
        </motion.div>
      )}

      {/* Eyes - 3D style */}
      <div className="absolute top-[30%] left-[20%] w-[22%] h-[22%] bg-white rounded-full shadow-md">
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-gradient-to-br from-blue-700 to-blue-900 rounded-full" />
        <div className="absolute top-[15%] right-[20%] w-[25%] h-[25%] bg-white rounded-full" />
      </div>
      <div className="absolute top-[30%] right-[20%] w-[22%] h-[22%] bg-white rounded-full shadow-md">
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-gradient-to-br from-blue-700 to-blue-900 rounded-full" />
        <div className="absolute top-[15%] right-[20%] w-[25%] h-[25%] bg-white rounded-full" />
      </div>

      {/* Nose */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[12%] h-[8%] bg-gradient-to-b from-blue-400 to-blue-500 rounded-full shadow-sm" />

      {/* Mouth */}
      {mood === 'happy' && (
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[20%] h-[10%] bg-gradient-to-b from-blue-400 to-blue-500 rounded-b-full" />
      )}

      {/* Blush */}
      <div className="absolute top-[48%] left-[8%] w-[15%] h-[10%] bg-pink-300/40 rounded-full blur-sm" />
      <div className="absolute top-[48%] right-[8%] w-[15%] h-[10%] bg-pink-300/40 rounded-full blur-sm" />

      {/* Tail fin */}
      <motion.div 
        className="absolute -right-[12%] top-[40%] w-[22%] h-[25%]"
        animate={{ scaleX: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full shadow-md" />
      </motion.div>

      {/* Bubbles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[8%] h-[8%] bg-gradient-to-br from-cyan-200 to-blue-300 rounded-full border border-white/50"
          style={{ right: `${-5 + i * 8}%`, top: `${15 + i * 12}%` }}
          animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Crown/crest (stage 3) */}
      {stage >= 3 && (
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2">
          <div className="w-6 h-3 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-t-full shadow-md" style={{ clipPath: 'polygon(0% 100%, 20% 0%, 50% 60%, 80% 0%, 100% 100%)' }} />
        </div>
      )}
    </div>
  );
};

// 3D-style Grass Pet
const GrassPet3D = ({ stage, mood }: { stage: 1 | 2 | 3; mood: string }) => {
  return (
    <div className="relative w-full h-full">
      {/* Soft glow/shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-400/20 to-emerald-500/30 rounded-full blur-xl scale-110" />
      
      {/* Main body - 3D rounded shape */}
      <div className="absolute inset-[5%] rounded-[45%_45%_50%_50%] shadow-lg bg-gradient-to-br from-green-400 via-emerald-400 to-green-500">
        {/* 3D highlight on top */}
        <div className="absolute top-[5%] left-[15%] w-[70%] h-[30%] bg-gradient-to-b from-white/40 to-transparent rounded-full" />
        
        {/* Belly - lighter 3D area */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[45%] rounded-[50%] bg-gradient-to-b from-green-100 via-lime-200 to-green-200 shadow-inner" />
      </div>

      {/* Leaf ears */}
      <motion.div 
        className="absolute -top-[8%] left-[12%] w-[28%] h-[35%] bg-gradient-to-t from-green-500 to-lime-400 rounded-t-full shadow-md"
        style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }}
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-[3px] h-[50%] bg-green-600/50" />
      </motion.div>
      <motion.div 
        className="absolute -top-[8%] right-[12%] w-[28%] h-[35%] bg-gradient-to-t from-green-500 to-lime-400 rounded-t-full shadow-md"
        style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }}
        animate={{ rotate: [3, -3, 3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-[3px] h-[50%] bg-green-600/50" />
      </motion.div>

      {/* Sprout on head (stage 2+) */}
      {stage >= 2 && (
        <motion.div 
          className="absolute -top-[18%] left-1/2 -translate-x-1/2"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-4 bg-gradient-to-t from-green-600 to-green-500" />
          <div className="absolute -top-1 -left-1.5 w-3 h-2 bg-gradient-to-br from-lime-400 to-green-500 rounded-full" />
          <div className="absolute -top-1 -right-1.5 w-3 h-2 bg-gradient-to-bl from-lime-400 to-green-500 rounded-full" />
        </motion.div>
      )}

      {/* Eyes - 3D style */}
      <div className="absolute top-[30%] left-[20%] w-[22%] h-[22%] bg-white rounded-full shadow-md">
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-gradient-to-br from-green-700 to-emerald-900 rounded-full" />
        <div className="absolute top-[15%] right-[20%] w-[25%] h-[25%] bg-white rounded-full" />
      </div>
      <div className="absolute top-[30%] right-[20%] w-[22%] h-[22%] bg-white rounded-full shadow-md">
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] bg-gradient-to-br from-green-700 to-emerald-900 rounded-full" />
        <div className="absolute top-[15%] right-[20%] w-[25%] h-[25%] bg-white rounded-full" />
      </div>

      {/* Nose */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[12%] h-[8%] bg-gradient-to-b from-green-500 to-green-600 rounded-full shadow-sm" />

      {/* Mouth */}
      {mood === 'happy' && (
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[20%] h-[10%] bg-gradient-to-b from-green-500 to-green-600 rounded-b-full" />
      )}

      {/* Blush */}
      <div className="absolute top-[48%] left-[8%] w-[15%] h-[10%] bg-pink-300/40 rounded-full blur-sm" />
      <div className="absolute top-[48%] right-[8%] w-[15%] h-[10%] bg-pink-300/40 rounded-full blur-sm" />

      {/* Leaf tail */}
      <motion.div 
        className="absolute -right-[10%] top-[45%] w-[20%] h-[22%]"
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-full h-full bg-gradient-to-r from-green-500 to-lime-400 rounded-full shadow-md" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[2px] bg-green-600/50" />
      </motion.div>

      {/* Flower crown (stage 3) */}
      {stage >= 3 && (
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 flex gap-0.5">
          {['bg-pink-400', 'bg-yellow-400', 'bg-pink-400'].map((color, i) => (
            <motion.div
              key={i}
              className={cn('w-2.5 h-2.5 rounded-full shadow-sm', color)}
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};