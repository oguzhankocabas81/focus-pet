import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, Pet, Task, LogbookEntry, PomodoroState, 
  AppState, TabType, TaskType, UrgencyLevel, PetType 
} from '@/types';
import { 
  getXPForLevel, getCoinsForLevel, TASK_POINTS, 
  DEFAULT_POMODORO_SETTINGS, getStreakReward 
} from '@/utils/constants';

interface GameStore {
  // App State
  app: AppState;
  setOnboarded: (value: boolean) => void;
  setCurrentTab: (tab: TabType) => void;

  // User
  user: User | null;
  createUser: (name: string, petType: PetType, petName: string) => void;
  updateStreak: () => void;

  // Pet
  pet: Pet | null;
  updatePetHappiness: (amount: number) => void;
  feedPet: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'status' | 'points'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  startFocusTask: (id: string) => void;

  // Logbook
  logbook: LogbookEntry[];
  addLogEntry: (entry: Omit<LogbookEntry, 'id' | 'timestamp'>) => void;
  deleteLogEntry: (id: string) => void;

  // Pomodoro
  pomodoro: PomodoroState;
  startPomodoro: (taskId?: string) => void;
  pausePomodoro: () => void;
  resumePomodoro: () => void;
  stopPomodoro: () => void;
  tickPomodoro: () => void;
  completePomodoro: () => void;
  skipToBreak: () => void;
  updatePomodoroSettings: (settings: Partial<typeof DEFAULT_POMODORO_SETTINGS>) => void;

  // XP & Leveling
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;

  // Inventory
  ownedItems: string[];
  purchaseItem: (itemId: string, cost: number) => boolean;
  equipItem: (itemId: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const getTodayDate = () => new Date().toISOString().split('T')[0];

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // App State
      app: {
        isOnboarded: false,
        currentTab: 'dashboard',
      },
      setOnboarded: (value) => set((state) => ({ 
        app: { ...state.app, isOnboarded: value } 
      })),
      setCurrentTab: (tab) => set((state) => ({ 
        app: { ...state.app, currentTab: tab } 
      })),

      // User
      user: null,
      createUser: (name, petType, petName) => {
        const userId = generateId();
        const petId = generateId();
        
        const user: User = {
          id: userId,
          name,
          petId,
          level: 1,
          currentXP: 0,
          totalCoins: 0,
          dailyStreak: 1,
          lastLoginDate: getTodayDate(),
          createdAt: new Date().toISOString(),
        };

        const pet: Pet = {
          id: petId,
          name: petName,
          type: petType,
          level: 1,
          currentXP: 0,
          happiness: 100,
          hunger: 0,
          equippedItems: [],
          unlocked: true,
        };

        set({ user, pet });
      },

      updateStreak: () => {
        const { user } = get();
        if (!user) return;

        const today = getTodayDate();
        const lastLogin = user.lastLoginDate;

        if (lastLogin === today) return; // Already logged in today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = user.dailyStreak;
        let bonusCoins = 0;

        if (lastLogin === yesterdayStr) {
          // Consecutive day
          newStreak += 1;
          bonusCoins = getStreakReward(newStreak);
        } else {
          // Streak broken
          newStreak = 1;
        }

        set((state) => ({
          user: state.user ? {
            ...state.user,
            dailyStreak: newStreak,
            lastLoginDate: today,
            totalCoins: state.user.totalCoins + bonusCoins,
          } : null,
        }));
      },

      // Pet
      pet: null,
      updatePetHappiness: (amount) => set((state) => ({
        pet: state.pet ? {
          ...state.pet,
          happiness: Math.max(0, Math.min(100, state.pet.happiness + amount)),
        } : null,
      })),
      feedPet: () => set((state) => ({
        pet: state.pet ? { ...state.pet, hunger: 0 } : null,
      })),

      // Tasks
      tasks: [],
      addTask: (taskData) => {
        const { user } = get();
        if (!user) return;

        const task: Task = {
          id: generateId(),
          userId: user.id,
          ...taskData,
          points: TASK_POINTS[taskData.type],
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

      completeTask: (id) => {
        const { tasks, addXP, addCoins, addLogEntry, updatePetHappiness, user } = get();
        const task = tasks.find((t) => t.id === id);
        if (!task || !user) return;

        const now = new Date().toISOString();

        // Update task status
        set((state) => ({
          tasks: state.tasks.map((t) => 
            t.id === id ? { ...t, status: 'completed' as const, completedAt: now } : t
          ),
        }));

        // Add XP and coins
        addXP(task.points);
        addCoins(Math.floor(task.points / 10)); // 10% of XP as coins

        // Update pet happiness
        updatePetHappiness(5);

        // Add to logbook
        addLogEntry({
          userId: user.id,
          task: { ...task, status: 'completed', completedAt: now },
          pointsEarned: task.points,
          completedAt: now,
          result: 'completed',
        });
      },

      startFocusTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => 
            t.id === id ? { ...t, status: 'in_progress' as const, focusStarted: true } : t
          ),
        }));
        get().startPomodoro(id);
      },

      // Logbook
      logbook: [],
      addLogEntry: (entryData) => {
        const entry: LogbookEntry = {
          id: generateId(),
          ...entryData,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ logbook: [entry, ...state.logbook] }));
      },
      deleteLogEntry: (id) => set((state) => ({
        logbook: state.logbook.filter((e) => e.id !== id),
      })),

      // Pomodoro
      pomodoro: {
        isRunning: false,
        isPaused: false,
        currentTaskId: null,
        mode: 'focus',
        timeRemaining: DEFAULT_POMODORO_SETTINGS.focusDuration * 60,
        completedPomodoros: 0,
        settings: DEFAULT_POMODORO_SETTINGS,
      },

      startPomodoro: (taskId) => set((state) => ({
        pomodoro: {
          ...state.pomodoro,
          isRunning: true,
          isPaused: false,
          currentTaskId: taskId || null,
          mode: 'focus',
          timeRemaining: state.pomodoro.settings.focusDuration * 60,
        },
      })),

      pausePomodoro: () => set((state) => ({
        pomodoro: { ...state.pomodoro, isPaused: true },
      })),

      resumePomodoro: () => set((state) => ({
        pomodoro: { ...state.pomodoro, isPaused: false },
      })),

      stopPomodoro: () => set((state) => ({
        pomodoro: {
          ...state.pomodoro,
          isRunning: false,
          isPaused: false,
          currentTaskId: null,
          mode: 'focus',
          timeRemaining: state.pomodoro.settings.focusDuration * 60,
        },
      })),

      tickPomodoro: () => set((state) => {
        if (!state.pomodoro.isRunning || state.pomodoro.isPaused) return state;
        
        const newTime = state.pomodoro.timeRemaining - 1;
        if (newTime <= 0) {
          // Timer completed - will be handled by completePomodoro
          return state;
        }
        
        return {
          pomodoro: { ...state.pomodoro, timeRemaining: newTime },
        };
      }),

      completePomodoro: () => {
        const { pomodoro, completeTask } = get();
        
        if (pomodoro.mode === 'focus') {
          const newCompleted = pomodoro.completedPomodoros + 1;
          const isLongBreak = newCompleted % 4 === 0;
          
          // Complete the associated task if any
          if (pomodoro.currentTaskId) {
            completeTask(pomodoro.currentTaskId);
          }

          set((state) => ({
            pomodoro: {
              ...state.pomodoro,
              mode: isLongBreak ? 'longBreak' : 'shortBreak',
              completedPomodoros: newCompleted,
              timeRemaining: isLongBreak 
                ? state.pomodoro.settings.longBreakDuration * 60
                : state.pomodoro.settings.shortBreakDuration * 60,
              isRunning: state.pomodoro.settings.autoStartBreak,
              currentTaskId: null,
            },
          }));
        } else {
          // Break completed, back to focus
          set((state) => ({
            pomodoro: {
              ...state.pomodoro,
              mode: 'focus',
              timeRemaining: state.pomodoro.settings.focusDuration * 60,
              isRunning: false,
            },
          }));
        }
      },

      skipToBreak: () => set((state) => ({
        pomodoro: {
          ...state.pomodoro,
          mode: 'shortBreak',
          timeRemaining: state.pomodoro.settings.shortBreakDuration * 60,
          isRunning: false,
        },
      })),

      updatePomodoroSettings: (settings) => set((state) => ({
        pomodoro: {
          ...state.pomodoro,
          settings: { ...state.pomodoro.settings, ...settings },
          timeRemaining: settings.focusDuration 
            ? settings.focusDuration * 60 
            : state.pomodoro.timeRemaining,
        },
      })),

      // XP & Leveling
      addXP: (amount) => {
        const { user, pet, addCoins, updatePetHappiness } = get();
        if (!user) return;

        let newXP = user.currentXP + amount;
        let newLevel = user.level;
        let leveledUp = false;

        // Check for level up
        const xpRequired = getXPForLevel(newLevel);
        while (newXP >= xpRequired) {
          newXP -= xpRequired;
          newLevel += 1;
          leveledUp = true;
          
          // Award coins for leveling up
          const coinReward = getCoinsForLevel(newLevel);
          addCoins(coinReward);
        }

        if (leveledUp) {
          updatePetHappiness(10);
        }

        set((state) => ({
          user: state.user ? { ...state.user, currentXP: newXP, level: newLevel } : null,
          pet: state.pet && leveledUp ? { ...state.pet, level: newLevel, currentXP: newXP } : state.pet,
        }));
      },

      addCoins: (amount) => set((state) => ({
        user: state.user ? { 
          ...state.user, 
          totalCoins: state.user.totalCoins + amount 
        } : null,
      })),

      // Inventory
      ownedItems: [],
      purchaseItem: (itemId, cost) => {
        const { user, ownedItems } = get();
        if (!user || user.totalCoins < cost || ownedItems.includes(itemId)) {
          return false;
        }

        set((state) => ({
          user: state.user ? { 
            ...state.user, 
            totalCoins: state.user.totalCoins - cost 
          } : null,
          ownedItems: [...state.ownedItems, itemId],
        }));
        return true;
      },

      equipItem: (itemId) => set((state) => ({
        pet: state.pet ? {
          ...state.pet,
          equippedItems: state.pet.equippedItems.includes(itemId)
            ? state.pet.equippedItems.filter((i) => i !== itemId)
            : [...state.pet.equippedItems, itemId],
        } : null,
      })),
    }),
    {
      name: 'anproc-game-storage',
    }
  )
);
