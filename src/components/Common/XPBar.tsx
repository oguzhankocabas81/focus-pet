import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface XPBarProps {
  current: number;
  max: number;
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const XPBar = ({ 
  current, 
  max, 
  level, 
  showLabel = true,
  size = 'md',
  className 
}: XPBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Level {level}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {current} / {max} XP
          </span>
        </div>
      )}
      <div 
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <motion.div
          className="h-full xp-bar rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
