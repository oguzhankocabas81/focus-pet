import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Moon, 
  Sun, 
  Monitor,
  Timer,
  ChevronRight,
  Save
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
] as const;

export const Settings = () => {
  const { 
    user, 
    pet, 
    settings, 
    pomodoro,
    updateUserName, 
    updatePetName,
    updateSettings,
    updatePomodoroSettings
  } = useGameStore();
  const { toast } = useToast();

  const [userName, setUserName] = useState(user?.name || '');
  const [petName, setPetName] = useState(pet?.name || '');
  const [focusDuration, setFocusDuration] = useState(pomodoro.settings.focusDuration);
  const [shortBreak, setShortBreak] = useState(pomodoro.settings.shortBreakDuration);
  const [longBreak, setLongBreak] = useState(pomodoro.settings.longBreakDuration);

  const handleSaveProfile = () => {
    if (userName.trim()) {
      updateUserName(userName.trim());
    }
    if (petName.trim()) {
      updatePetName(petName.trim());
    }
    toast({ title: 'Profile saved!' });
  };

  const handleSavePomodoroSettings = () => {
    updatePomodoroSettings({
      focusDuration,
      shortBreakDuration: shortBreak,
      longBreakDuration: longBreak,
    });
    toast({ title: 'Timer settings saved!' });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
    
    // Apply theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    toast({ title: `Theme set to ${theme}` });
  };

  const handleLanguageChange = (language: 'en' | 'es' | 'fr' | 'de' | 'ja') => {
    updateSettings({ language });
    toast({ title: 'Language preference saved (UI not yet translated)' });
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6"
        >
          <SettingsIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Your Name</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="petName">Pet Name</Label>
                <Input
                  id="petName"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Enter pet name"
                  className="mt-1"
                />
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Theme Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Appearance</h2>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                    settings.theme === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Language Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🌐</span>
              <h2 className="font-semibold text-foreground">Language</h2>
            </div>

            <div className="space-y-1">
              {LANGUAGE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleLanguageChange(value)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg transition-all',
                    settings.language === value
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <span className="font-medium">{label}</span>
                  {settings.language === value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Pomodoro Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Timer className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Pomodoro Timer</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Focus Duration</Label>
                  <span className="text-sm font-medium text-primary">{focusDuration} min</span>
                </div>
                <Slider
                  value={[focusDuration]}
                  onValueChange={([val]) => setFocusDuration(val)}
                  min={5}
                  max={60}
                  step={5}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Short Break</Label>
                  <span className="text-sm font-medium text-primary">{shortBreak} min</span>
                </div>
                <Slider
                  value={[shortBreak]}
                  onValueChange={([val]) => setShortBreak(val)}
                  min={1}
                  max={15}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Long Break</Label>
                  <span className="text-sm font-medium text-primary">{longBreak} min</span>
                </div>
                <Slider
                  value={[longBreak]}
                  onValueChange={([val]) => setLongBreak(val)}
                  min={10}
                  max={30}
                  step={5}
                />
              </div>

              <Button onClick={handleSavePomodoroSettings} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Timer Settings
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-5">
            <h2 className="font-semibold text-foreground mb-4">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{user?.level || 1}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-coin">{user?.totalCoins || 0}</p>
                <p className="text-xs text-muted-foreground">Coins</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{user?.dailyStreak || 0}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{pomodoro.completedPomodoros}</p>
                <p className="text-xs text-muted-foreground">Pomodoros</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
