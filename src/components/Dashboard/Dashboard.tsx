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
import { TaskBadge } from '@/components/Common/TaskBadge';
import { useGameStore } from '@/store/gameStore';
import { getXPForLevel, FALLBACK_QUOTES } from '@/utils/constants';
import { Task, Quote } from '@/types';
import { cn } from '@/lib/utils';
import { isToday, parseISO } from 'date-fns';

export const Dashboard = () => {
  const { user, pet, tasks, setCurrentTab, updateStreak, startFocusTask, completeTask, equippedItems } = useGameStore();
  const [quote, setQuote] = useState<Quote>(FALLBACK_QUOTES[0]);

  useEffect(() => {
    updateStreak();
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
    <div className="min-h-screen pb-24 px-4 pt-6 bg-background">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Hey, {user.name}!
          </h1>
          <CoinDisplay amount={user.totalCoins} size="lg" />
        </motion.div>

        {/* Pet Card - Clean white card with pet on pedestal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden p-6 bg-card shadow-lg rounded-3xl border-0">
            <div className="flex flex-col items-center text-center">
              {/* Pet with Scene */}
              <div className="relative">
                <PetScene equippedItems={equippedItems} petSize="xl" showDecorations={false}>
                  <PetRig equippedItems={equippedItems} size="xl">
                    <PetBase type={pet.type} stage={getEvolutionStage(user.level)} size="xl" />
                  </PetRig>
                </PetScene>
                
                {/* Pedestal/Platform */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-6">
                  <div className="w-full h-full bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 rounded-full shadow-md" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full" />
                </div>
              </div>

              {/* Pet Name */}
              <h3 className="mt-4 text-lg font-semibold text-foreground">{pet.name}</h3>
              <p className="text-xs text-muted-foreground">
                {EVOLUTION_NAMES[pet.type][getEvolutionStage(user.level)].name}
              </p>

              {/* Level & XP Bar */}
              <div className="w-full mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Level {user.level}</span>
                  <span className="text-muted-foreground">XP</span>
                </div>
                <XPBar 
                  current={user.currentXP} 
                  max={xpRequired} 
                  level={user.level}
                />
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
            <h2 className="text-lg font-semibold text-foreground">Today's Tasks</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentTab('tasks')}
              className="text-muted-foreground text-sm"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {todaysTasks.length === 0 ? (
            <Card className="p-6 text-center rounded-2xl border-0 shadow-sm bg-card">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-muted-foreground text-sm">No tasks for today!</p>
              <Button 
                onClick={() => setCurrentTab('tasks')} 
                className="mt-4 rounded-full"
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
                    className="p-4 flex items-center gap-3 cursor-pointer transition-all hover:shadow-md rounded-2xl border-0 shadow-sm bg-card"
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
                      <h3 className="font-medium text-foreground text-sm truncate">{task.title}</h3>
                    </div>
                    <div className="w-5 h-5 rounded-md border-2 border-muted-foreground/30" />
                  </Card>
                </motion.div>
              ))}

              {todaysTasks.length > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground text-sm"
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
          className="text-center py-2"
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
            className="w-14 h-14 rounded-full shadow-lg bg-foreground text-background hover:bg-foreground/90"
            onClick={() => setCurrentTab('tasks')}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
