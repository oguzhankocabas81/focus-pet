import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PetScene } from '@/components/Pet/PetScene';
import { PetRig } from '@/components/Pet/PetRig';
import { PetBase, EVOLUTION_NAMES, getEvolutionStage } from '@/components/Pet/PetBase';
import { XPBar } from '@/components/Common/XPBar';
import { CoinDisplay } from '@/components/Common/CoinDisplay';
import { StreakBadge } from '@/components/Common/StreakBadge';
import { TaskBadge } from '@/components/Common/TaskBadge';
import { useGameStore } from '@/store/gameStore';
import { getXPForLevel, FALLBACK_QUOTES } from '@/utils/constants';
import { Task, Quote } from '@/types';
import { cn } from '@/lib/utils';
import { format, isToday, parseISO } from 'date-fns';

export const Dashboard = () => {
  const { user, pet, tasks, setCurrentTab, updateStreak, startFocusTask, completeTask, equippedItems } = useGameStore();
  const [quote, setQuote] = useState<Quote>(FALLBACK_QUOTES[0]);

  useEffect(() => {
    updateStreak();
    // Get random quote
    const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  if (!user || !pet) return null;

  const xpRequired = getXPForLevel(user.level);
  const todaysTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'expired' && t.dueDate && isToday(parseISO(t.dueDate))
  );

  const handleTaskAction = (task: Task) => {
    if (task.type === 'focus') {
      startFocusTask(task.id);
      setCurrentTab('timer');
    } else {
      completeTask(task.id);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header with greeting and coins */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Hey, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground text-sm">Ready to be productive?</p>
          </div>
          <CoinDisplay amount={user.totalCoins} size="lg" />
        </motion.div>

        {/* Pet Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-card via-card to-primary/5">
            <div className="flex flex-col items-center text-center">
              <PetScene equippedItems={equippedItems} petSize="xl">
                <PetRig equippedItems={equippedItems} size="xl">
                  <PetBase type={pet.type} stage={getEvolutionStage(user.level)} size="xl" />
                </PetRig>
              </PetScene>
              <h3 className="mt-3 font-pixel text-sm text-foreground">{pet.name}</h3>
              <p className="text-xs text-muted-foreground">
                {EVOLUTION_NAMES[pet.type][getEvolutionStage(user.level)].name}
              </p>
              
              {/* Pet stats */}
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>❤️ {pet.happiness}%</span>
                <span>🍖 {100 - pet.hunger}%</span>
              </div>

              {/* XP Bar */}
              <div className="w-full mt-4">
                <XPBar 
                  current={user.currentXP} 
                  max={xpRequired} 
                  level={user.level}
                />
              </div>

              {/* Streak */}
              <div className="mt-4">
                <StreakBadge streak={user.dailyStreak} />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Today's Tasks</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentTab('tasks')}
              className="text-muted-foreground"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {todaysTasks.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-muted-foreground">No tasks for today!</p>
              <Button 
                onClick={() => setCurrentTab('tasks')} 
                className="mt-4"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add a task
              </Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {todaysTasks.slice(0, 3).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card 
                    className={cn(
                      'p-4 flex items-center gap-3 cursor-pointer transition-all hover:shadow-md',
                      task.urgencyLevel === 'high' && 'urgency-high',
                      task.urgencyLevel === 'medium' && 'urgency-medium',
                      task.urgencyLevel === 'low' && 'urgency-low',
                    )}
                    onClick={() => handleTaskAction(task)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <TaskBadge type={task.type} />
                        {task.dueTime && (
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {task.dueTime}
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-foreground truncate">{task.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-xp">
                        +{task.points} XP
                      </span>
                      <Button 
                        size="sm" 
                        className="h-8 px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskAction(task);
                        }}
                      >
                        {task.type === 'focus' ? 'Start' : 'Done'}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {todaysTasks.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCurrentTab('tasks')}
                >
                  +{todaysTasks.length - 3} more tasks
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-4"
        >
          <p className="text-sm italic text-muted-foreground">"{quote.content}"</p>
          <p className="text-xs text-muted-foreground/70 mt-1">— {quote.author}</p>
        </motion.div>

        {/* FAB for adding tasks */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="fixed bottom-24 right-4 z-40"
        >
          <Button
            size="lg"
            className="w-14 h-14 rounded-full shadow-lg"
            onClick={() => setCurrentTab('tasks')}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
