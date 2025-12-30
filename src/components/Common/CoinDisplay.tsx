import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoinDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  className?: string;
}

export const CoinDisplay = ({ 
  amount, 
  size = 'md',
  showAnimation = false,
  className 
}: CoinDisplayProps) => {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-lg gap-2',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <motion.div 
      className={cn(
        'flex items-center font-semibold',
        sizeClasses[size],
        className
      )}
      animate={showAnimation ? { scale: [1, 1.1, 1] } : undefined}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Coins 
          size={iconSizes[size]} 
          className="text-coin"
          style={{
            filter: 'drop-shadow(0 0 4px hsl(var(--coin-glow) / 0.5))',
          }}
        />
      </div>
      <span className="text-foreground">{amount.toLocaleString()}</span>
    </motion.div>
  );
};
