import { TaskType, UrgencyLevel } from '@/types';
import { cn } from '@/lib/utils';
import { Target, RotateCcw, Compass } from 'lucide-react';

interface TaskBadgeProps {
  type: TaskType;
  size?: 'sm' | 'md';
  className?: string;
}

export const TaskBadge = ({ type, size = 'sm', className }: TaskBadgeProps) => {
  const config = {
    focus: {
      label: 'Focus',
      icon: Target,
      class: 'task-focus',
    },
    habit: {
      label: 'Habit',
      icon: RotateCcw,
      class: 'task-habit',
    },
    quest: {
      label: 'Quest',
      icon: Compass,
      class: 'task-quest',
    },
  };

  const { label, icon: Icon, class: badgeClass } = config[type];

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    md: 'text-xs px-2 py-1 gap-1',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center font-medium rounded-md',
        badgeClass,
        sizeClasses[size],
        className
      )}
    >
      <Icon size={iconSizes[size]} />
      {label}
    </span>
  );
};

interface UrgencyIndicatorProps {
  level: UrgencyLevel;
  className?: string;
}

export const UrgencyIndicator = ({ level, className }: UrgencyIndicatorProps) => {
  const config = {
    low: 'bg-muted-foreground/30',
    medium: 'bg-warning',
    high: 'bg-destructive',
  };

  return (
    <div 
      className={cn(
        'w-1 h-full rounded-full',
        config[level],
        className
      )}
    />
  );
};
