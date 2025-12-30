import { useGameStore } from '@/store/gameStore';
import { Onboarding } from '@/components/Onboarding/Onboarding';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { PomodoroTimer } from '@/components/PomodoroTimer/PomodoroTimer';
import { TaskManager } from '@/components/TaskManager/TaskManager';
import { BottomNav } from '@/components/Navigation/BottomNav';

const Index = () => {
  const { app } = useGameStore();

  if (!app.isOnboarded) {
    return <Onboarding />;
  }

  const renderContent = () => {
    switch (app.currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'timer':
        return <PomodoroTimer />;
      case 'tasks':
        return <TaskManager />;
      case 'logbook':
        return (
          <div className="min-h-screen pb-24 px-4 pt-6 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-5xl mb-4">📚</div>
              <p>Logbook coming soon!</p>
            </div>
          </div>
        );
      case 'shop':
        return (
          <div className="min-h-screen pb-24 px-4 pt-6 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-5xl mb-4">🛒</div>
              <p>Shop coming soon!</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <BottomNav />
    </div>
  );
};

export default Index;
