import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Timer, ListTodo, BookOpen, ShoppingBag 
} from 'lucide-react';
import { TabType } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'logbook', label: 'Logbook', icon: BookOpen },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
];

export const BottomNav = () => {
  const { app, setCurrentTab } = useGameStore();
  const currentTab = app.currentTab;

  return (
    <nav className="bottom-nav z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={cn(
                'relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <Icon 
                size={22} 
                className={cn(
                  'relative z-10 transition-transform',
                  isActive && 'scale-110'
                )}
              />
              <span 
                className={cn(
                  'relative z-10 text-[10px] font-medium mt-0.5',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
