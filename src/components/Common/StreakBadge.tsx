import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StreakBadge = ({ streak, size = 'md', className }: StreakBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const isHot = streak >= 7;
  const isOnFire = streak >= 3;

  return (
    <motion.div 
      className={cn(
        'inline-flex items-center font-semibold rounded-full',
        isHot 
          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
          : isOnFire 
            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
            : 'bg-muted text-muted-foreground',
        sizeClasses[size],
        className
      )}
      animate={isOnFire ? { 
        scale: [1, 1.02, 1],
      } : undefined}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <motion.div
        animate={isOnFire ? { 
          rotate: [-5, 5, -5],
        } : undefined}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Flame 
          size={iconSizes[size]} 
          className={isHot ? 'fill-yellow-300 text-yellow-300' : ''}
        />
      </motion.div>
      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
    </motion.div>
  );
};
