import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Coffee, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

export const PomodoroTimer = () => {
  const { 
    pomodoro, 
    tasks,
    startPomodoro, 
    pausePomodoro, 
    resumePomodoro, 
    stopPomodoro, 
    tickPomodoro,
    completePomodoro,
    skipToBreak,
  } = useGameStore();

  const currentTask = pomodoro.currentTaskId 
    ? tasks.find(t => t.id === pomodoro.currentTaskId) 
    : null;

  // Timer tick effect
  useEffect(() => {
    if (!pomodoro.isRunning || pomodoro.isPaused) return;

    const interval = setInterval(() => {
      if (pomodoro.timeRemaining <= 1) {
        completePomodoro();
        // Play notification sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
          audio.play().catch(() => {});
        } catch {}
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(pomodoro.mode === 'focus' ? '🎉 Focus session complete!' : '☕ Break time over!');
        }
      } else {
        tickPomodoro();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoro.isRunning, pomodoro.isPaused, pomodoro.timeRemaining]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = pomodoro.mode === 'focus' 
      ? pomodoro.settings.focusDuration * 60
      : pomodoro.mode === 'shortBreak'
        ? pomodoro.settings.shortBreakDuration * 60
        : pomodoro.settings.longBreakDuration * 60;
    return ((total - pomodoro.timeRemaining) / total) * 100;
  };

  const getModeConfig = () => {
    switch (pomodoro.mode) {
      case 'focus':
        return {
          label: 'Focus Time',
          icon: Target,
          color: 'text-primary',
          bgColor: 'from-primary/20 to-primary/5',
          strokeColor: 'stroke-primary',
        };
      case 'shortBreak':
        return {
          label: 'Short Break',
          icon: Coffee,
          color: 'text-success',
          bgColor: 'from-success/20 to-success/5',
          strokeColor: 'stroke-success',
        };
      case 'longBreak':
        return {
          label: 'Long Break',
          icon: Coffee,
          color: 'text-accent',
          bgColor: 'from-accent/20 to-accent/5',
          strokeColor: 'stroke-accent',
        };
    }
  };

  const config = getModeConfig();
  const Icon = config.icon;
  const progress = getProgress();

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        {/* Current Task */}
        {currentTask && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-sm text-muted-foreground">Currently working on</p>
            <h2 className="text-lg font-semibold text-foreground truncate px-4">
              {currentTask.title}
            </h2>
          </motion.div>
        )}

        {/* Timer Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <Card className={cn(
            'relative w-72 h-72 rounded-full flex items-center justify-center',
            'bg-gradient-to-b',
            config.bgColor
          )}>
            {/* Progress Ring */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="4"
                className="stroke-muted"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                className={config.strokeColor}
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                initial={false}
                animate={{ 
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}` 
                }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Timer Content */}
            <div className="relative z-10 text-center">
              <div className={cn('flex items-center justify-center gap-2 mb-2', config.color)}>
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{config.label}</span>
              </div>
              <motion.div
                key={pomodoro.timeRemaining}
                className="text-5xl font-bold text-foreground font-mono"
              >
                {formatTime(pomodoro.timeRemaining)}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-2">
                Pomodoro {pomodoro.completedPomodoros + 1}/4
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mt-8"
        >
          {/* Reset */}
          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={stopPomodoro}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          {/* Play/Pause */}
          {!pomodoro.isRunning ? (
            <Button
              size="lg"
              className="w-20 h-20 rounded-full shadow-lg"
              onClick={() => startPomodoro(pomodoro.currentTaskId || undefined)}
            >
              <Play className="w-8 h-8 ml-1" />
            </Button>
          ) : pomodoro.isPaused ? (
            <Button
              size="lg"
              className="w-20 h-20 rounded-full shadow-lg"
              onClick={resumePomodoro}
            >
              <Play className="w-8 h-8 ml-1" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-20 h-20 rounded-full shadow-lg"
              onClick={pausePomodoro}
            >
              <Pause className="w-8 h-8" />
            </Button>
          )}

          {/* Skip */}
          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={skipToBreak}
            disabled={pomodoro.mode !== 'focus'}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Session Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {pomodoro.completedPomodoros} pomodoro{pomodoro.completedPomodoros !== 1 ? 's' : ''} completed today
          </p>
        </motion.div>

        {/* Quick Start Options (when no task selected) */}
        {!currentTask && !pomodoro.isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <p className="text-center text-sm text-muted-foreground mb-4">
              Or start a quick focus session
            </p>
            <div className="flex justify-center gap-3">
              {[15, 25, 45].map((mins) => (
                <Button
                  key={mins}
                  variant="outline"
                  onClick={() => {
                    useGameStore.getState().updatePomodoroSettings({ focusDuration: mins });
                    startPomodoro();
                  }}
                >
                  {mins} min
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
