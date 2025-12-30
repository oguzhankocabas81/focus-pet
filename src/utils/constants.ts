import { PetTypeInfo, PomodoroSettings } from '@/types';

// XP Requirements by Level
export const XP_REQUIREMENTS: Record<string, number> = {
  '1-5': 250,
  '6-10': 350,
  '11-15': 400,
  '16-20': 450,
  '21+': 500,
};

export const getXPForLevel = (level: number): number => {
  if (level <= 5) return 250;
  if (level <= 10) return 350;
  if (level <= 15) return 400;
  if (level <= 20) return 450;
  return 500 + Math.floor((level - 20) / 5) * 50;
};

// Coin Rewards by Level
export const getCoinsForLevel = (level: number): number => {
  if (level <= 10) return 5;
  if (level <= 15) return 7;
  if (level <= 20) return 10;
  return 10 + Math.floor((level - 20) / 5) * 2;
};

// Task Points
export const TASK_POINTS = {
  focus: 50,
  habit: 25,
  quest: 25,
} as const;

// Pet Types
export const PET_TYPES: PetTypeInfo[] = [
  {
    id: 'fire',
    name: 'Flameling',
    description: 'A fiery spirit that burns with motivation. Thrives on focused work sessions.',
    color: 'fire',
    emoji: '🔥',
  },
  {
    id: 'water',
    name: 'Aquapal',
    description: 'A calm water creature that flows with your habits. Perfect for building routines.',
    color: 'water',
    emoji: '💧',
  },
  {
    id: 'grass',
    name: 'Sproutkin',
    description: 'A growing plant buddy that blooms with every quest completed. Steady progress wins!',
    color: 'grass',
    emoji: '🌿',
  },
];

// Default Pomodoro Settings
export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreak: false,
};

// Streak Rewards (every 3 days)
export const STREAK_REWARDS: Record<number, number> = {
  3: 50,
  6: 100,
  9: 150,
};

export const getStreakReward = (streak: number): number => {
  if (streak < 3) return 0;
  const milestone = Math.floor(streak / 3) * 3;
  if (milestone <= 9) return STREAK_REWARDS[milestone] || 0;
  return 50; // 50 coins for every 3 days after day 12
};

// Rarity Multipliers
export const RARITY_MULTIPLIERS = {
  common: 1,
  rare: 2.5,
  epic: 5,
  legendary: 10,
} as const;

// Motivational Quotes (fallback)
export const FALLBACK_QUOTES = [
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { content: "Small progress is still progress.", author: "Unknown" },
  { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { content: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { content: "Your future self will thank you.", author: "Unknown" },
  { content: "One task at a time. One day at a time.", author: "Unknown" },
  { content: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { content: "The best time to start was yesterday. The next best time is now.", author: "Unknown" },
];
