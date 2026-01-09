import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PetBase, getEvolutionStage } from '@/components/Pet/PetBase';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

export const PomodoroTimer = () => {
  const { 
    pomodoro, 
    pet,
    user,
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
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
          audio.play().catch(() => {});
        } catch {}
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(pomodoro.mode === 'focus' ? '🎉 Focus session complete!' : '☕ Break time over!');
        }
      } else {
        tickPomodoro();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoro.isRunning, pomodoro.isPaused, pomodoro.timeRemaining]);

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

  const progress = getProgress();
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 bg-background flex flex-col items-center">
      <div className="max-w-lg mx-auto w-full flex flex-col items-center">
        
        {/* Current Task */}
        {currentTask && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-sm text-muted-foreground">Working on</p>
            <h2 className="text-lg font-semibold text-foreground truncate px-4">
              {currentTask.title}
            </h2>
          </motion.div>
        )}

        {/* Circular Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-72 h-72 flex items-center justify-center"
        >
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="144"
              cy="144"
              r="120"
              fill="none"
              strokeWidth="8"
              className="stroke-muted"
            />
            {/* Progress circle */}
            <motion.circle
              cx="144"
              cy="144"
              r="120"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Timer Content */}
          <div className="relative z-10 text-center">
            <p className="text-lg text-muted-foreground mb-1">{Math.round(progress)}%</p>
            <motion.div
              key={pomodoro.timeRemaining}
              className="text-6xl font-bold text-foreground tracking-tight"
            >
              {formatTime(pomodoro.timeRemaining)}
            </motion.div>
            <p className="text-sm text-muted-foreground mt-2">
              Pomodoro {pomodoro.completedPomodoros + 1} of 4
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center gap-6 mt-8"
        >
          {/* Reset */}
          <Button
            variant="ghost"
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={stopPomodoro}
          >
            <RotateCcw className="w-6 h-6 text-muted-foreground" />
          </Button>

          {/* Play/Pause */}
          {!pomodoro.isRunning ? (
            <Button
              size="lg"
              className="w-20 h-20 rounded-full shadow-xl bg-foreground text-background hover:bg-foreground/90"
              onClick={() => startPomodoro(pomodoro.currentTaskId || undefined)}
            >
              <Play className="w-10 h-10 ml-1" fill="currentColor" />
            </Button>
          ) : pomodoro.isPaused ? (
            <Button
              size="lg"
              className="w-20 h-20 rounded-full shadow-xl bg-foreground text-background hover:bg-foreground/90"
              onClick={resumePomodoro}
            >
              <Play className="w-10 h-10 ml-1" fill="currentColor" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-20 h-20 rounded-full shadow-xl bg-foreground text-background hover:bg-foreground/90"
              onClick={pausePomodoro}
            >
              <Pause className="w-10 h-10" fill="currentColor" />
            </Button>
          )}

          {/* Skip */}
          <Button
            variant="ghost"
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={skipToBreak}
            disabled={pomodoro.mode !== 'focus'}
          >
            <SkipForward className="w-6 h-6 text-muted-foreground" />
          </Button>
        </motion.div>

        {/* Duration Options */}
        {!pomodoro.isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-3 mt-8"
          >
            {[15, 25, 45].map((mins) => (
              <Button
                key={mins}
                variant={pomodoro.settings.focusDuration === mins ? "default" : "secondary"}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium",
                  pomodoro.settings.focusDuration === mins 
                    ? "bg-foreground text-background" 
                    : "bg-secondary text-foreground"
                )}
                onClick={() => {
                  useGameStore.getState().updatePomodoroSettings({ focusDuration: mins });
                }}
              >
                {mins} min
              </Button>
            ))}
          </motion.div>
        )}

        {/* Meditating Pet */}
        {pet && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="w-32 h-32 mx-auto">
              <PetBase 
                type={pet.type} 
                stage={getEvolutionStage(user.level)} 
                size="lg" 
                mood="happy"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
