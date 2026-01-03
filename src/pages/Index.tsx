import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Onboarding } from '@/components/Onboarding/Onboarding';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { PomodoroTimer } from '@/components/PomodoroTimer/PomodoroTimer';
import { TaskManager } from '@/components/TaskManager/TaskManager';
import { Logbook } from '@/components/Logbook/Logbook';
import { Shop } from '@/components/Shop/Shop';
import { Settings } from '@/components/Settings/Settings';
import { BottomNav } from '@/components/Navigation/BottomNav';
import { LevelUpOverlay } from '@/components/Common/LevelUpOverlay';
import { getCoinsForLevel } from '@/utils/constants';

const Index = () => {
  const { app, user, updateStreak } = useGameStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ level: 1, coins: 5 });
  const prevLevelRef = useRef(user?.level || 1);

  useEffect(() => {
    if (user && user.level > prevLevelRef.current) {
      setLevelUpData({
        level: user.level,
        coins: getCoinsForLevel(user.level),
      });
      setShowLevelUp(true);
    }
    prevLevelRef.current = user?.level || 1;
  }, [user?.level]);

  useEffect(() => {
    if (app.isOnboarded) {
      updateStreak();
    }
  }, [app.isOnboarded, updateStreak]);

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
        return <Logbook />;
      case 'shop':
        return <Shop />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <BottomNav />
      
      {/* Level Up Overlay */}
      <LevelUpOverlay
        show={showLevelUp}
        level={levelUpData.level}
        coinsEarned={levelUpData.coins}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
};

export default Index;