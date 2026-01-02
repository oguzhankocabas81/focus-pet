import { motion, AnimatePresence } from 'framer-motion';
import { PetType } from '@/types';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/gameStore';

interface EvolvingPetProps {
  type: PetType;
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
  className?: string;
  onClick?: () => void;
  showParticles?: boolean;
  mood?: 'happy' | 'neutral' | 'sad';
  showEquipment?: boolean;
}

// Evolution stages: Stage 1 (1-10), Stage 2 (11-20), Stage 3 (21+)
export const getEvolutionStage = (level: number): 1 | 2 | 3 => {
  if (level >= 21) return 3;
  if (level >= 11) return 2;
  return 1;
};

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

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-28 h-28',
  lg: 'w-36 h-36',
  xl: 'w-44 h-44',
};

// Shop items data (must match Shop.tsx)
const SHOP_ITEMS_DATA: Record<string, { emoji: string; category: string }> = {
  'bg-meadow': { emoji: '🌾', category: 'background' },
  'bg-ocean': { emoji: '🌊', category: 'background' },
  'bg-volcano': { emoji: '🌋', category: 'background' },
  'bg-forest': { emoji: '🌲', category: 'background' },
  'bg-crystal': { emoji: '💎', category: 'background' },
  'bg-galaxy': { emoji: '🌌', category: 'background' },
  'acc-bow': { emoji: '🎀', category: 'accessory' },
  'acc-glasses': { emoji: '🕶️', category: 'accessory' },
  'acc-hat': { emoji: '🎩', category: 'accessory' },
  'acc-crown': { emoji: '👑', category: 'accessory' },
  'acc-halo': { emoji: '😇', category: 'accessory' },
  'dec-sparkle': { emoji: '✨', category: 'decoration' },
  'dec-hearts': { emoji: '💕', category: 'decoration' },
  'dec-stars': { emoji: '⭐', category: 'decoration' },
  'dec-rainbow': { emoji: '🌈', category: 'decoration' },
  'dec-fire': { emoji: '🔥', category: 'decoration' },
  'dec-water': { emoji: '💧', category: 'decoration' },
  'dec-leaf': { emoji: '🍃', category: 'decoration' },
};

const BACKGROUND_STYLES: Record<string, string> = {
  'bg-meadow': 'bg-gradient-to-br from-green-200 via-lime-100 to-green-300',
  'bg-ocean': 'bg-gradient-to-br from-cyan-300 via-blue-200 to-blue-400',
  'bg-volcano': 'bg-gradient-to-br from-orange-400 via-red-500 to-orange-600',
  'bg-forest': 'bg-gradient-to-br from-emerald-300 via-green-400 to-teal-500',
  'bg-crystal': 'bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-400',
  'bg-galaxy': 'bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-900',
};

export const EvolvingPet = ({ 
  type, 
  level,
  size = 'lg', 
  isAnimated = true,
  className,
  onClick,
  showParticles = false,
  mood = 'happy',
  showEquipment = true,
}: EvolvingPetProps) => {
  const { pet } = useGameStore();
  const stage = getEvolutionStage(level);
  const sizeClass = sizeClasses[size];

  // Get equipped items by category
  const equippedItems = showEquipment && pet?.equippedItems ? pet.equippedItems : [];
  const equippedBackground = equippedItems.find(id => SHOP_ITEMS_DATA[id]?.category === 'background');
  const equippedAccessories = equippedItems.filter(id => SHOP_ITEMS_DATA[id]?.category === 'accessory');
  const equippedDecorations = equippedItems.filter(id => SHOP_ITEMS_DATA[id]?.category === 'decoration');

  return (
    <div className={cn('relative', className)}>
      {/* Background layer */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-3xl overflow-hidden',
          equippedBackground ? BACKGROUND_STYLES[equippedBackground] : 'bg-gradient-to-br from-card/50 to-card',
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background effects based on type */}
        {equippedBackground === 'bg-galaxy' && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </>
        )}
        {equippedBackground === 'bg-ocean' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-400/50 to-transparent"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        {equippedBackground === 'bg-volcano' && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 text-lg"
                style={{ left: `${10 + i * 20}%` }}
                animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              >
                🔥
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Pet container */}
      <motion.div
        className={cn(
          'relative cursor-pointer select-none flex items-center justify-center p-4',
          sizeClass,
        )}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Decorations behind pet */}
        <AnimatePresence>
          {equippedDecorations.includes('dec-rainbow') && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute top-1/4 left-0 right-0 h-12 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 opacity-30 blur-xl rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The actual pet */}
        <div className="relative">
          {type === 'fire' && <FirePet stage={stage} isAnimated={isAnimated} mood={mood} size={size} />}
          {type === 'water' && <WaterPet stage={stage} isAnimated={isAnimated} mood={mood} size={size} />}
          {type === 'grass' && <GrassPet stage={stage} isAnimated={isAnimated} mood={mood} size={size} />}

          {/* Accessories on top of pet */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-0.5">
            {equippedAccessories.map((id) => (
              <motion.span
                key={id}
                className="text-2xl drop-shadow-lg"
                initial={{ scale: 0, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              >
                {SHOP_ITEMS_DATA[id]?.emoji}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Decorations around pet */}
        <AnimatePresence>
          {equippedDecorations.includes('dec-sparkle') && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute text-xl pointer-events-none"
                  style={{
                    left: `${20 + (i % 3) * 30}%`,
                    top: `${15 + Math.floor(i / 3) * 50}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}

          {equippedDecorations.includes('dec-hearts') && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`heart-${i}`}
                  className="absolute text-lg pointer-events-none"
                  style={{
                    left: `${10 + i * 25}%`,
                    bottom: '70%',
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  💕
                </motion.div>
              ))}
            </>
          )}

          {equippedDecorations.includes('dec-stars') && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-sm pointer-events-none"
                  style={{
                    left: `${5 + i * 20}%`,
                    top: `${10 + (i % 2) * 20}%`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    rotate: [0, 180],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  ⭐
                </motion.div>
              ))}
            </>
          )}

          {equippedDecorations.includes('dec-fire') && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`fire-${i}`}
                  className="absolute text-lg pointer-events-none"
                  style={{
                    left: `${15 + i * 22}%`,
                    bottom: '10%',
                  }}
                  animate={{
                    y: [0, -8, 0],
                    scale: [0.9, 1.15, 0.9],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                >
                  🔥
                </motion.div>
              ))}
            </>
          )}

          {equippedDecorations.includes('dec-water') && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`water-${i}`}
                  className="absolute text-lg pointer-events-none"
                  style={{
                    left: `${10 + i * 25}%`,
                    top: '0%',
                  }}
                  animate={{
                    y: [0, 30, 60],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  💧
                </motion.div>
              ))}
            </>
          )}

          {equippedDecorations.includes('dec-leaf') && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`leaf-${i}`}
                  className="absolute text-lg pointer-events-none"
                  style={{
                    left: `${5 + i * 20}%`,
                    top: '-10%',
                  }}
                  animate={{
                    y: [0, 40, 80],
                    x: [0, 10, -10, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.8,
                  }}
                >
                  🍃
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Ambient particles */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-sm"
                style={{ left: `${20 + i * 30}%`, bottom: '100%' }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              >
                {type === 'fire' ? '🔥' : type === 'water' ? '💧' : '🍃'}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Fire Pet - Evolution stages inspired by reference images
const FirePet = ({ 
  stage, 
  isAnimated, 
  mood,
  size,
}: { 
  stage: 1 | 2 | 3; 
  isAnimated: boolean; 
  mood: string;
  size: string;
}) => {
  const baseAnimation = isAnimated ? { y: [0, -4, 0] } : {};
  const isSmall = size === 'sm' || size === 'md';

  if (stage === 1) {
    // Flare-Kit: Cute baby fire fox - round, fluffy, small flames
    return (
      <motion.div 
        className="relative"
        animate={baseAnimation}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/40 to-red-400/40 rounded-full blur-xl scale-150" />
        
        {/* Body - Round cute shape */}
        <div className="relative w-16 h-16">
          {/* Main body */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-[45%] shadow-lg" 
            style={{ boxShadow: 'inset 4px 4px 8px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.1)' }}
          />
          
          {/* Cream belly */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-orange-100 to-orange-200 rounded-[50%]" />
          
          {/* Ears */}
          <motion.div 
            className="absolute -top-2 left-2 w-4 h-5 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-full"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -top-2 right-2 w-4 h-5 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-full"
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Flame tufts on ears */}
          <motion.div 
            className="absolute -top-4 left-2.5 w-2 h-3 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full"
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -top-4 right-2.5 w-2 h-3 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full"
            animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          
          {/* Eyes */}
          <div className="absolute top-5 left-3 w-4 h-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full">
            <div className="absolute top-1 left-1 w-2 h-2 bg-amber-900 rounded-full" />
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
          <div className="absolute top-5 right-3 w-4 h-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full">
            <div className="absolute top-1 left-1 w-2 h-2 bg-amber-900 rounded-full" />
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
          
          {/* Nose */}
          <div className="absolute top-9 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-red-400 rounded-full" />
          
          {/* Mouth */}
          <div className={cn(
            "absolute top-10 left-1/2 -translate-x-1/2 w-4",
            mood === 'happy' ? 'h-2 rounded-b-full bg-red-400' : 'h-0.5 rounded-full bg-gray-600'
          )} />
          
          {/* Blush */}
          <div className="absolute top-7 left-0.5 w-3 h-2 bg-red-300/50 rounded-full" />
          <div className="absolute top-7 right-0.5 w-3 h-2 bg-red-300/50 rounded-full" />
          
          {/* Tail flame */}
          <motion.div 
            className="absolute -right-3 top-6 w-4 h-6"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <div className="w-full h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-200 rounded-full" 
              style={{ clipPath: 'polygon(30% 100%, 0% 50%, 30% 0%, 100% 50%)' }}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (stage === 2) {
    // Pyro-Dash: Sleek fire fox, more defined, speed lines
    return (
      <motion.div 
        className="relative"
        animate={baseAnimation}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Intense glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/50 to-red-500/50 rounded-full blur-2xl scale-150" />
        
        <div className={cn("relative", isSmall ? "w-18 h-18" : "w-24 h-24")}>
          {/* Flame mane */}
          <motion.div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-t-full"
                style={{
                  left: `${i * 20}%`,
                  width: '25%',
                  height: `${60 + (i % 2) * 30}%`,
                }}
                animate={{ scaleY: [1, 1.2, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
          
          {/* Body - More fox-like */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-16 bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 rounded-[40%] shadow-lg"
            style={{ boxShadow: 'inset 4px 4px 12px rgba(255,255,255,0.3), 0 8px 20px rgba(255,100,0,0.4)' }}
          />
          
          {/* Cream chest */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-10 bg-gradient-to-b from-orange-100 to-orange-200 rounded-[50%]" />
          
          {/* Sharp ears */}
          <div className="absolute top-1 left-3 w-5 h-7 bg-gradient-to-t from-red-500 to-orange-400 rounded-t-full transform -rotate-12" />
          <div className="absolute top-1 right-3 w-5 h-7 bg-gradient-to-t from-red-500 to-orange-400 rounded-t-full transform rotate-12" />
          
          {/* Inner ear flame */}
          <motion.div 
            className="absolute -top-1 left-4 w-3 h-4 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full"
            animate={{ scaleY: [0.9, 1.15, 0.9] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -top-1 right-4 w-3 h-4 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full"
            animate={{ scaleY: [1.15, 0.9, 1.15] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
          
          {/* Eyes - More intense */}
          <div className="absolute top-8 left-5 w-5 h-5 bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-full shadow-inner">
            <div className="absolute top-1 left-1.5 w-2.5 h-2.5 bg-gradient-to-br from-amber-600 to-red-700 rounded-full" />
            <div className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute top-8 right-5 w-5 h-5 bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-full shadow-inner">
            <div className="absolute top-1 left-1.5 w-2.5 h-2.5 bg-gradient-to-br from-amber-600 to-red-700 rounded-full" />
            <div className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          
          {/* Nose */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-red-600 rounded-full" />
          
          {/* Mouth */}
          <div className={cn(
            "absolute top-14 left-1/2 -translate-x-1/2",
            mood === 'happy' ? 'w-5 h-2 rounded-b-full bg-red-500' : 'w-4 h-0.5 rounded-full bg-gray-700'
          )} />
          
          {/* Speed lines */}
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1"
            animate={{ opacity: [0.3, 0.7, 0.3], x: [-3, 0, -3] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-4 h-0.5 bg-orange-400/60 rounded-full" />
            ))}
          </motion.div>
          
          {/* Flame tail */}
          <motion.div 
            className="absolute -right-6 top-8 w-8 h-10"
            animate={{ rotate: [-15, 15, -15], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <div className="w-full h-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 rounded-full transform -rotate-45" 
              style={{ clipPath: 'polygon(20% 100%, 0% 40%, 40% 0%, 100% 40%, 60% 100%)' }}
            />
          </motion.div>
          
          {/* Legs */}
          <div className="absolute bottom-0 left-4 w-4 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-b-lg" />
          <div className="absolute bottom-0 right-4 w-4 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-b-lg" />
        </div>
      </motion.div>
    );
  }

  // Stage 3: Flame Kinetic - Majestic fire creature
  return (
    <motion.div 
      className="relative"
      animate={baseAnimation}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Epic glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/60 to-yellow-500/60 rounded-full blur-3xl scale-[2]" />
      
      <div className={cn("relative", isSmall ? "w-22 h-22" : "w-28 h-28")}>
        {/* Blazing crown */}
        <motion.div 
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 rounded-t-full"
              style={{
                left: `${i * 12 + 5}%`,
                width: '20%',
                height: `${50 + (i % 3) * 25}%`,
                background: `linear-gradient(to top, #dc2626, #f97316, #fcd34d)`,
              }}
              animate={{ 
                scaleY: [1, 1.3, 1], 
                opacity: [0.85, 1, 0.85] 
              }}
              transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </motion.div>
        
        {/* Main body - Majestic */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-[35%] shadow-2xl"
          style={{ boxShadow: 'inset 6px 6px 16px rgba(255,255,255,0.35), 0 12px 30px rgba(255,50,0,0.5)' }}
        />
        
        {/* Armor-like chest plate */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-14 h-12 bg-gradient-to-b from-yellow-300 via-orange-200 to-yellow-400 rounded-[45%]" 
          style={{ boxShadow: 'inset 2px 2px 6px rgba(255,255,255,0.5)' }}
        />
        
        {/* Fierce ears with flames */}
        <div className="absolute top-0 left-2 w-6 h-9 bg-gradient-to-t from-red-600 to-red-500 rounded-t-full transform -rotate-12" />
        <div className="absolute top-0 right-2 w-6 h-9 bg-gradient-to-t from-red-600 to-red-500 rounded-t-full transform rotate-12" />
        <motion.div 
          className="absolute -top-3 left-3 w-4 h-5 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full"
          animate={{ scaleY: [0.85, 1.2, 0.85] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -top-3 right-3 w-4 h-5 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full"
          animate={{ scaleY: [1.2, 0.85, 1.2] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        
        {/* Piercing eyes */}
        <div className="absolute top-10 left-5 w-6 h-5 bg-gradient-to-br from-yellow-300 to-yellow-100 rounded-full shadow-lg"
          style={{ clipPath: 'polygon(0 30%, 100% 0%, 100% 100%, 0 70%)' }}
        >
          <div className="absolute top-0.5 left-1.5 w-3 h-3 bg-gradient-to-br from-red-600 to-red-800 rounded-full" />
          <div className="absolute top-0 right-1 w-2 h-2 bg-white rounded-full" />
        </div>
        <div className="absolute top-10 right-5 w-6 h-5 bg-gradient-to-br from-yellow-300 to-yellow-100 rounded-full shadow-lg"
          style={{ clipPath: 'polygon(0 0%, 100% 30%, 100% 70%, 0 100%)' }}
        >
          <div className="absolute top-0.5 left-1.5 w-3 h-3 bg-gradient-to-br from-red-600 to-red-800 rounded-full" />
          <div className="absolute top-0 right-1 w-2 h-2 bg-white rounded-full" />
        </div>
        
        {/* Nose */}
        <div className="absolute top-15 left-1/2 -translate-x-1/2 w-3 h-2 bg-red-700 rounded-full" />
        
        {/* Fierce mouth */}
        <div className={cn(
          "absolute top-[4.5rem] left-1/2 -translate-x-1/2",
          mood === 'happy' ? 'w-6 h-3 rounded-b-full bg-red-600' : 'w-5 h-1 rounded-full bg-gray-800'
        )} />
        
        {/* Fire mane flowing */}
        <motion.div 
          className="absolute -left-3 top-8 w-4 h-10 bg-gradient-to-l from-red-500 to-yellow-400 rounded-l-full"
          animate={{ scaleX: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -right-3 top-8 w-4 h-10 bg-gradient-to-r from-red-500 to-yellow-400 rounded-r-full"
          animate={{ scaleX: [1.2, 1, 1.2], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        
        {/* Epic flame tail */}
        <motion.div 
          className="absolute -right-10 top-10 w-12 h-14"
          animate={{ rotate: [-20, 20, -20], scale: [1, 1.15, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${i * 15}%`,
                top: `${i * 10}%`,
                width: `${40 - i * 5}%`,
                height: `${70 - i * 10}%`,
                background: `linear-gradient(45deg, #dc2626, #f97316, #fcd34d)`,
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
        
        {/* Strong legs */}
        <div className="absolute bottom-0 left-4 w-5 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-b-lg shadow-lg" />
        <div className="absolute bottom-0 right-4 w-5 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-b-lg shadow-lg" />
        
        {/* Fire orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{
              left: `${-10 + i * 50}%`,
              top: `${20 + (i % 2) * 30}%`,
            }}
            animate={{ 
              scale: [0.5, 1, 0.5], 
              opacity: [0.4, 0.9, 0.4],
              y: [0, -5, 0],
            }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Water Pet - Evolution stages
const WaterPet = ({ 
  stage, 
  isAnimated, 
  mood,
  size,
}: { 
  stage: 1 | 2 | 3; 
  isAnimated: boolean; 
  mood: string;
  size: string;
}) => {
  const baseAnimation = isAnimated ? { y: [0, -4, 0] } : {};
  const isSmall = size === 'sm' || size === 'md';

  if (stage === 1) {
    // Tick-Tot: Cute baby seal pup
    return (
      <motion.div 
        className="relative"
        animate={baseAnimation}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 rounded-full blur-xl scale-150" />
        
        <div className="relative w-16 h-16">
          {/* Round body */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-cyan-300 to-blue-400 rounded-[50%] shadow-lg"
            style={{ boxShadow: 'inset 4px 4px 8px rgba(255,255,255,0.5), inset -2px -2px 6px rgba(0,0,0,0.1)' }}
          />
          
          {/* White belly */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-white to-sky-100 rounded-[50%]" />
          
          {/* Flipper ears */}
          <motion.div 
            className="absolute top-2 -left-1 w-4 h-5 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full transform -rotate-12"
            animate={{ rotate: [-15, -8, -15] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-2 -right-1 w-4 h-5 bg-gradient-to-bl from-cyan-300 to-blue-400 rounded-full transform rotate-12"
            animate={{ rotate: [15, 8, 15] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Eyes */}
          <div className="absolute top-5 left-3 w-4 h-4 bg-gradient-to-br from-white to-sky-100 rounded-full">
            <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-blue-900 rounded-full" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute top-5 right-3 w-4 h-4 bg-gradient-to-br from-white to-sky-100 rounded-full">
            <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-blue-900 rounded-full" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          
          {/* Nose */}
          <div className="absolute top-9 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-blue-600 rounded-full" />
          
          {/* Mouth */}
          <div className={cn(
            "absolute top-10 left-1/2 -translate-x-1/2",
            mood === 'happy' ? 'w-4 h-2 rounded-b-full bg-blue-500' : 'w-3 h-0.5 rounded-full bg-gray-600'
          )} />
          
          {/* Blush */}
          <div className="absolute top-7 left-0.5 w-3 h-2 bg-pink-300/50 rounded-full" />
          <div className="absolute top-7 right-0.5 w-3 h-2 bg-pink-300/50 rounded-full" />
          
          {/* Tail */}
          <motion.div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-blue-400 to-cyan-300 rounded-b-full"
            animate={{ scaleX: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Bubbles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 border-2 border-white/60 rounded-full"
              style={{ right: `${-10 + i * 5}%`, top: `${20 + i * 15}%` }}
              animate={{ y: [0, -10, -20], opacity: [0.6, 0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (stage === 2) {
    // Tempo-Serpent: Sleek water dragon/serpent with gears
    return (
      <motion.div 
        className="relative"
        animate={baseAnimation}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-full blur-2xl scale-150" />
        
        <div className={cn("relative", isSmall ? "w-18 h-18" : "w-24 h-24")}>
          {/* Serpentine body */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-16 bg-gradient-to-br from-cyan-300 via-blue-400 to-cyan-500 rounded-[40%] shadow-lg"
            style={{ boxShadow: 'inset 4px 4px 12px rgba(255,255,255,0.4), 0 8px 20px rgba(0,150,200,0.4)' }}
          />
          
          {/* Light underbelly */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-10 bg-gradient-to-b from-sky-100 to-cyan-200 rounded-[50%]" />
          
          {/* Fin ears */}
          <motion.div 
            className="absolute top-1 left-2 w-6 h-8 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-t-full transform -rotate-12"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            animate={{ rotate: [-15, -5, -15] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1 right-2 w-6 h-8 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-t-full transform rotate-12"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            animate={{ rotate: [15, 5, 15] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Eyes */}
          <div className="absolute top-8 left-4 w-5 h-5 bg-gradient-to-br from-white to-sky-100 rounded-full shadow-inner">
            <div className="absolute top-1 left-1.5 w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full" />
            <div className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute top-8 right-4 w-5 h-5 bg-gradient-to-br from-white to-sky-100 rounded-full shadow-inner">
            <div className="absolute top-1 left-1.5 w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full" />
            <div className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          
          {/* Nose */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-blue-700 rounded-full" />
          
          {/* Mouth */}
          <div className={cn(
            "absolute top-14 left-1/2 -translate-x-1/2",
            mood === 'happy' ? 'w-5 h-2 rounded-b-full bg-blue-600' : 'w-4 h-0.5 rounded-full bg-gray-700'
          )} />
          
          {/* Gear decorations */}
          <motion.div 
            className="absolute left-0 top-10 w-4 h-4 border-2 border-cyan-200/60 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-1 border border-cyan-300/40 rounded-full" />
          </motion.div>
          <motion.div 
            className="absolute right-0 top-10 w-4 h-4 border-2 border-cyan-200/60 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-1 border border-cyan-300/40 rounded-full" />
          </motion.div>
          
          {/* Water trail */}
          <motion.div 
            className="absolute -right-5 top-10 flex flex-col gap-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                className="w-3 h-1 bg-cyan-300/60 rounded-full"
                animate={{ scaleX: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
          
          {/* Flippers */}
          <motion.div 
            className="absolute bottom-0 left-3 w-5 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-b-full"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-3 w-5 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-b-full"
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Bubbles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 border border-white/50 rounded-full"
              style={{ left: `${i * 20}%`, top: `${-5 + i * 5}%` }}
              animate={{ y: [0, -15, -30], opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // Stage 3: Aqua Chronos - Majestic time-controlling water dragon
  return (
    <motion.div 
      className="relative"
      animate={baseAnimation}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Epic glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/60 to-blue-600/60 rounded-full blur-3xl scale-[2]" />
      
      <div className={cn("relative", isSmall ? "w-22 h-22" : "w-28 h-28")}>
        {/* Crown of water/ice */}
        <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 rounded-t-full"
              style={{
                left: `${i * 18 + 5}%`,
                width: '18%',
                height: `${40 + (i % 2) * 30}%`,
                background: `linear-gradient(to top, #0891b2, #22d3ee, #ecfeff)`,
              }}
              animate={{ scaleY: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
        
        {/* Main body */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 rounded-[35%] shadow-2xl"
          style={{ boxShadow: 'inset 6px 6px 16px rgba(255,255,255,0.4), 0 12px 30px rgba(0,150,200,0.5)' }}
        />
        
        {/* Crystalline chest */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-14 h-12 bg-gradient-to-b from-white via-sky-100 to-cyan-200 rounded-[45%]"
          style={{ boxShadow: 'inset 2px 2px 6px rgba(0,150,200,0.3)' }}
        />
        
        {/* Majestic fins */}
        <motion.div 
          className="absolute top-0 left-1 w-7 h-10 bg-gradient-to-t from-blue-600 to-cyan-300 rounded-t-full transform -rotate-12"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{ rotate: [-15, -5, -15] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-0 right-1 w-7 h-10 bg-gradient-to-t from-blue-600 to-cyan-300 rounded-t-full transform rotate-12"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{ rotate: [15, 5, 15] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        
        {/* Glowing eyes */}
        <div className="absolute top-10 left-4 w-6 h-5 bg-gradient-to-br from-white to-cyan-100 rounded-full shadow-lg">
          <div className="absolute top-0.5 left-1.5 w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full" />
          <motion.div 
            className="absolute top-0 right-0.5 w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
        <div className="absolute top-10 right-4 w-6 h-5 bg-gradient-to-br from-white to-cyan-100 rounded-full shadow-lg">
          <div className="absolute top-0.5 left-1.5 w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full" />
          <motion.div 
            className="absolute top-0 right-0.5 w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
        
        {/* Nose */}
        <div className="absolute top-[3.75rem] left-1/2 -translate-x-1/2 w-3 h-2 bg-blue-700 rounded-full" />
        
        {/* Mouth */}
        <div className={cn(
          "absolute top-[4.5rem] left-1/2 -translate-x-1/2",
          mood === 'happy' ? 'w-6 h-3 rounded-b-full bg-blue-700' : 'w-5 h-1 rounded-full bg-gray-800'
        )} />
        
        {/* Time gears - rotating */}
        <motion.div 
          className="absolute -left-4 top-8 w-6 h-6 border-2 border-cyan-300/70 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-1 border border-cyan-400/50 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        <motion.div 
          className="absolute -right-4 top-8 w-6 h-6 border-2 border-cyan-300/70 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-1 border border-cyan-400/50 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        
        {/* Flowing water wings */}
        <motion.div 
          className="absolute -left-4 top-12 w-5 h-8 bg-gradient-to-l from-cyan-400/80 to-blue-300/40 rounded-l-full"
          animate={{ scaleX: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -right-4 top-12 w-5 h-8 bg-gradient-to-r from-cyan-400/80 to-blue-300/40 rounded-r-full"
          animate={{ scaleX: [1.3, 1, 1.3], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Flippers */}
        <div className="absolute bottom-0 left-4 w-5 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-b-lg shadow-lg" />
        <div className="absolute bottom-0 right-4 w-5 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-b-lg shadow-lg" />
        
        {/* Water orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full"
            style={{
              left: `${-15 + i * 40}%`,
              top: `${10 + (i % 2) * 25}%`,
            }}
            animate={{ 
              scale: [0.6, 1, 0.6], 
              opacity: [0.5, 0.9, 0.5],
              y: [0, -8, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
        
        {/* Rising bubbles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 border border-white/60 rounded-full"
            style={{ left: `${10 + i * 18}%`, top: '0%' }}
            animate={{ y: [0, -25, -50], opacity: [0, 0.8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Grass Pet - Evolution stages
const GrassPet = ({ 
  stage, 
  isAnimated, 
  mood,
  size,
}: { 
  stage: 1 | 2 | 3; 
  isAnimated: boolean; 
  mood: string;
  size: string;
}) => {
  const baseAnimation = isAnimated ? { y: [0, -4, 0] } : {};
  const isSmall = size === 'sm' || size === 'md';

  if (stage === 1) {
    // Root-Ling: Cute baby forest creature with leaf sprout
    return (
      <motion.div 
        className="relative"
        animate={baseAnimation}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/40 to-lime-400/40 rounded-full blur-xl scale-150" />
        
        <div className="relative w-16 h-16">
          {/* Round body */}
          <div className="absolute inset-0 bg-gradient-to-br from-lime-200 via-green-300 to-lime-400 rounded-[50%] shadow-lg"
            style={{ boxShadow: 'inset 4px 4px 8px rgba(255,255,255,0.5), inset -2px -2px 6px rgba(0,0,0,0.1)' }}
          />
          
          {/* Cream belly */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-lime-50 to-green-100 rounded-[50%]" />
          
          {/* Leaf sprout on head */}
          <motion.div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-5 bg-gradient-to-t from-green-500 to-lime-400 rounded-full"
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-3 bg-gradient-to-t from-lime-400 to-lime-300 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Ears */}
          <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-t from-green-300 to-lime-300 rounded-full" />
          <div className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-t from-green-300 to-lime-300 rounded-full" />
          
          {/* Eyes */}
          <div className="absolute top-5 left-3 w-4 h-4 bg-gradient-to-br from-white to-green-50 rounded-full">
            <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-emerald-800 rounded-full" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute top-5 right-3 w-4 h-4 bg-gradient-to-br from-white to-green-50 rounded-full">
            <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-emerald-800 rounded-full" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          
          {/* Nose */}
          <div className="absolute top-9 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-green-600 rounded-full" />
          
          {/* Mouth */}
          <div className={cn(
            "absolute top-10 left-1/2 -translate-x-1/2",
            mood === 'happy' ? 'w-4 h-2 rounded-b-full bg-green-600' : 'w-3 h-0.5 rounded-full bg-gray-600'
          )} />
          
          {/* Blush */}
          <div className="absolute top-7 left-0.5 w-3 h-2 bg-pink-300/40 rounded-full" />
          <div className="absolute top-7 right-0.5 w-3 h-2 bg-pink-300/40 rounded-full" />
          
          {/* Little paws */}
          <div className="absolute bottom-0 left-3 w-3 h-3 bg-gradient-to-b from-green-300 to-green-400 rounded-b-lg" />
          <div className="absolute bottom-0 right-3 w-3 h-3 bg-gradient-to-b from-green-300 to-green-400 rounded-b-lg" />
          
          {/* Floating leaves */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs"
              style={{ left: `${i * 80}%`, top: '0%' }}
              animate={{ 
                y: [0, 10, 20], 
                x: [0, 5, -5, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.8, 0] 
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
            >
              🍃
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (stage === 2) {
    // Ignis-Prime: Growing forest fox spirit
    return (
      <motion.div 
        className="relative"
        animate={baseAnimation}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-full blur-2xl scale-150" />
        
        <div className={cn("relative", isSmall ? "w-18 h-18" : "w-24 h-24")}>
          {/* Leaf crown */}
          <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 rounded-t-full"
                style={{
                  left: `${i * 18}%`,
                  width: '22%',
                  height: `${50 + (i % 2) * 25}%`,
                  background: `linear-gradient(to top, #16a34a, #4ade80, #bbf7d0)`,
                }}
                animate={{ rotate: [(i-2) * 5, (i-2) * 8, (i-2) * 5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </motion.div>
          
          {/* Body */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-16 bg-gradient-to-br from-green-300 via-emerald-400 to-green-500 rounded-[40%] shadow-lg"
            style={{ boxShadow: 'inset 4px 4px 12px rgba(255,255,255,0.3), 0 8px 20px rgba(0,150,0,0.3)' }}
          />
          
          {/* Light belly */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-10 bg-gradient-to-b from-lime-50 to-green-200 rounded-[50%]" />
          
          {/* Fluffy tail */}
          <motion.div 
            className="absolute -right-4 top-8 w-8 h-10 bg-gradient-to-r from-green-400 via-lime-400 to-lime-300 rounded-full"
            animate={{ rotate: [-10, 10, -10], scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Ears with leaf tips */}
          <div className="absolute top-1 left-2 w-5 h-7 bg-gradient-to-t from-green-400 to-lime-300 rounded-t-full transform -rotate-12" />
          <div className="absolute top-1 right-2 w-5 h-7 bg-gradient-to-t from-green-400 to-lime-300 rounded-t-full transform rotate-12" />
          <motion.div 
            className="absolute -top-1 left-3 w-2 h-3 bg-gradient-to-t from-lime-400 to-lime-200 rounded-full"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -top-1 right-3 w-2 h-3 bg-gradient-to-t from-lime-400 to-lime-200 rounded-full"
            animate={{ scale: [1.15, 1, 1.15] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Eyes */}
          <div className="absolute top-8 left-4 w-5 h-5 bg-gradient-to-br from-white to-lime-50 rounded-full shadow-inner">
            <div className="absolute top-1 left-1.5 w-3 h-3 bg-gradient-to-br from-emerald-600 to-green-800 rounded-full" />
            <div className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute top-8 right-4 w-5 h-5 bg-gradient-to-br from-white to-lime-50 rounded-full shadow-inner">
            <div className="absolute top-1 left-1.5 w-3 h-3 bg-gradient-to-br from-emerald-600 to-green-800 rounded-full" />
            <div className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          
          {/* Nose */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-green-700 rounded-full" />
          
          {/* Mouth */}
          <div className={cn(
            "absolute top-14 left-1/2 -translate-x-1/2",
            mood === 'happy' ? 'w-5 h-2 rounded-b-full bg-green-700' : 'w-4 h-0.5 rounded-full bg-gray-700'
          )} />
          
          {/* Legs */}
          <div className="absolute bottom-0 left-3 w-4 h-5 bg-gradient-to-b from-green-400 to-green-500 rounded-b-lg" />
          <div className="absolute bottom-0 right-3 w-4 h-5 bg-gradient-to-b from-green-400 to-green-500 rounded-b-lg" />
          
          {/* Floating petals */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{ left: `${i * 30}%`, top: '-10%' }}
              animate={{ 
                y: [0, 15, 30], 
                x: [0, 8, -8, 0],
                rotate: [0, 90, 180],
                opacity: [0, 0.9, 0] 
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.8 }}
            >
              🌸
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Stage 3: Terra Savant - Wise ancient tree guardian
  return (
    <motion.div 
      className="relative"
      animate={baseAnimation}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Epic glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/60 to-lime-500/60 rounded-full blur-3xl scale-[2]" />
      
      <div className={cn("relative", isSmall ? "w-22 h-22" : "w-28 h-28")}>
        {/* Majestic tree crown */}
        <motion.div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12">
          {/* Tree foliage */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-10 bg-gradient-to-t from-green-600 via-emerald-500 to-lime-400 rounded-t-full" />
          {/* Golden fruits */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2.5 h-2.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full"
              style={{
                left: `${20 + i * 18}%`,
                top: `${30 + (i % 2) * 25}%`,
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </motion.div>
        
        {/* Main body */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-20 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-[35%] shadow-2xl"
          style={{ boxShadow: 'inset 6px 6px 16px rgba(255,255,255,0.35), 0 12px 30px rgba(0,150,50,0.4)' }}
        />
        
        {/* Bark-like chest pattern */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-14 h-12 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300 rounded-[45%]"
          style={{ boxShadow: 'inset 2px 2px 6px rgba(0,100,0,0.2)' }}
        />
        
        {/* Wise ears with crystals */}
        <div className="absolute top-0 left-2 w-6 h-9 bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-full transform -rotate-12" />
        <div className="absolute top-0 right-2 w-6 h-9 bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-full transform rotate-12" />
        <motion.div 
          className="absolute -top-2 left-3 w-3 h-4 bg-gradient-to-t from-lime-400 to-lime-200 rounded-full"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -top-2 right-3 w-3 h-4 bg-gradient-to-t from-lime-400 to-lime-200 rounded-full"
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Crystal gem on forehead */}
        <motion.div 
          className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-cyan-300 to-emerald-400 rounded-full"
          style={{ boxShadow: '0 0 10px rgba(0,255,200,0.5)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Wise eyes */}
        <div className="absolute top-10 left-4 w-6 h-5 bg-gradient-to-br from-white to-lime-100 rounded-full shadow-lg">
          <div className="absolute top-0.5 left-1.5 w-3 h-3 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full" />
          <motion.div 
            className="absolute top-0 right-0.5 w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="absolute top-10 right-4 w-6 h-5 bg-gradient-to-br from-white to-lime-100 rounded-full shadow-lg">
          <div className="absolute top-0.5 left-1.5 w-3 h-3 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full" />
          <motion.div 
            className="absolute top-0 right-0.5 w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        
        {/* Nose */}
        <div className="absolute top-[3.75rem] left-1/2 -translate-x-1/2 w-3 h-2 bg-green-800 rounded-full" />
        
        {/* Mouth */}
        <div className={cn(
          "absolute top-[4.5rem] left-1/2 -translate-x-1/2",
          mood === 'happy' ? 'w-6 h-3 rounded-b-full bg-green-800' : 'w-5 h-1 rounded-full bg-gray-800'
        )} />
        
        {/* Flowing leaf wings */}
        <motion.div 
          className="absolute -left-4 top-10 w-6 h-10 bg-gradient-to-l from-green-500 to-lime-300/50 rounded-l-full"
          animate={{ scaleX: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -right-4 top-10 w-6 h-10 bg-gradient-to-r from-green-500 to-lime-300/50 rounded-r-full"
          animate={{ scaleX: [1.2, 1, 1.2], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        
        {/* Root-like feet */}
        <div className="absolute bottom-0 left-4 w-5 h-6 bg-gradient-to-b from-green-500 to-amber-700 rounded-b-lg shadow-lg" />
        <div className="absolute bottom-0 right-4 w-5 h-6 bg-gradient-to-b from-green-500 to-amber-700 rounded-b-lg shadow-lg" />
        
        {/* Orbiting leaves */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{ 
              rotate: [0, 360],
              x: [Math.cos(i * 1.57) * 40, Math.cos(i * 1.57 + 6.28) * 40],
              y: [Math.sin(i * 1.57) * 40, Math.sin(i * 1.57 + 6.28) * 40],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: 'linear',
              delay: i * 0.5,
            }}
          >
            🍃
          </motion.div>
        ))}
        
        {/* Magical sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              left: `${10 + i * 35}%`,
              top: `${-10 + (i % 2) * 20}%`,
            }}
            animate={{ 
              scale: [0.5, 1.2, 0.5], 
              opacity: [0.3, 1, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default EvolvingPet;
