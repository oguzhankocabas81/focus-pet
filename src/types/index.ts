// User Profile
export interface User {
  id: string;
  name: string;
  petId: string;
  level: number;
  currentXP: number;
  totalCoins: number;
  dailyStreak: number;
  lastLoginDate: string;
  createdAt: string;
}

// Pet System
export interface Pet {
  id: string;
  name: string;
  type: PetType;
  level: number;
  currentXP: number;
  happiness: number;
  hunger: number;
  equippedItems: string[];
  unlocked: boolean;
}

export type PetType = 'fire' | 'water' | 'grass';

export interface PetTypeInfo {
  id: PetType;
  name: string;
  description: string;
  color: string;
  emoji: string;
}

// Task System
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: TaskType;
  points: number;
  dueDate: string;
  dueTime?: string;
  urgencyLevel: UrgencyLevel;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  focusStarted?: boolean;
}

export type TaskType = 'focus' | 'habit' | 'quest';
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'expired';

// Logbook
export interface LogbookEntry {
  id: string;
  userId: string;
  task: Task;
  pointsEarned: number;
  completedAt?: string;
  result: 'completed' | 'expired';
  timestamp: string;
}

// Shop Items (legacy - use GameItem from items.ts for new code)
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'background' | 'accessory' | 'decoration';
  rarity: Rarity;
  cost: number;
  spriteUrl: string;
  petCompatibility: 'all' | PetType[];
}

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

// Settings
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'de' | 'ja';
}

// Pomodoro
export interface PomodoroState {
  isRunning: boolean;
  isPaused: boolean;
  currentTaskId: string | null;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  timeRemaining: number; // seconds
  completedPomodoros: number;
  settings: PomodoroSettings;
}

export interface PomodoroSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreak: boolean;
}

// App State
export interface AppState {
  isOnboarded: boolean;
  currentTab: TabType;
}

export type TabType = 'dashboard' | 'timer' | 'tasks' | 'logbook' | 'shop' | 'settings';

// Quote
export interface Quote {
  content: string;
  author: string;
}
