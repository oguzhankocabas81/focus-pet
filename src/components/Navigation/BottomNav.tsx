import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Timer, ListTodo, BookOpen, ShoppingBag, Settings 
} from 'lucide-react';
import { TabType } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const BottomNav = () => {
  const { app, setCurrentTab } = useGameStore();
  const currentTab = app.currentTab;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/30" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
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
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon 
                size={22} 
                className={cn(
                  'transition-all',
                  isActive && 'scale-110'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span 
                className={cn(
                  'text-[10px] font-medium mt-0.5',
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
