import { GameItem } from '@/types/items';

// Complete shop inventory with asset paths
export const SHOP_ITEMS: GameItem[] = [
  // ========== BACKGROUNDS ==========
  {
    id: 'bg-meadow',
    name: 'Sunny Meadow',
    description: 'A peaceful grassy meadow with flowers',
    category: 'background',
    slot: 'background',
    rarity: 'common',
    cost: 100,
    assetPath: '/items/backgrounds/meadow.svg',
    thumbnailPath: '/items/backgrounds/meadow.svg',
    petCompatibility: 'all',
  },
  {
    id: 'bg-ocean',
    name: 'Ocean Waves',
    description: 'Calming ocean with gentle waves',
    category: 'background',
    slot: 'background',
    rarity: 'common',
    cost: 100,
    assetPath: '/items/backgrounds/ocean.svg',
    thumbnailPath: '/items/backgrounds/ocean.svg',
    petCompatibility: 'all',
  },

  // ========== ACCESSORIES ==========
  {
    id: 'acc-party-hat',
    name: 'Party Hat',
    description: 'Celebrate in style!',
    category: 'accessory',
    slot: 'hat',
    rarity: 'common',
    cost: 75,
    assetPath: '/items/accessories/party-hat.svg',
    thumbnailPath: '/items/accessories/party-hat.svg',
    petCompatibility: 'all',
    anchor: 'head',
    offsetX: 0,
    offsetY: -8,  // Sits on top of head
    scale: 1,
    zIndex: 20,
  },
  {
    id: 'acc-wizard-hat',
    name: 'Wizard Hat',
    description: 'Magical headwear for focus sessions',
    category: 'accessory',
    slot: 'hat',
    rarity: 'rare',
    cost: 200,
    assetPath: '/items/accessories/wizard-hat.svg',
    thumbnailPath: '/items/accessories/wizard-hat.svg',
    petCompatibility: 'all',
    anchor: 'head',
    offsetX: 0,
    offsetY: -10, // Sits on top of head
    scale: 1.2,
    zIndex: 20,
  },
  {
    id: 'acc-cool-glasses',
    name: 'Cool Shades',
    description: 'Looking sharp and focused!',
    category: 'accessory',
    slot: 'glasses',
    rarity: 'common',
    cost: 60,
    assetPath: '/items/accessories/cool-glasses.svg',
    thumbnailPath: '/items/accessories/cool-glasses.svg',
    petCompatibility: 'all',
    anchor: 'face',
    offsetX: 0,
    offsetY: 0,   // Sits at face level
    scale: 0.8,
    zIndex: 21,   // Above head items
  },

  // ========== DECORATIONS ==========
  {
    id: 'dec-potted-plant',
    name: 'Potted Plant',
    description: 'A friendly desk companion',
    category: 'decoration',
    slot: 'decor_floor_1',
    rarity: 'common',
    cost: 80,
    assetPath: '/items/decorations/potted-plant.svg',
    thumbnailPath: '/items/decorations/potted-plant.svg',
    petCompatibility: 'all',
    zIndex: 5,
  },
  {
    id: 'dec-crystal-lamp',
    name: 'Crystal Lamp',
    description: 'Glowing ambient light',
    category: 'decoration',
    slot: 'decor_floor_2',
    rarity: 'rare',
    cost: 150,
    assetPath: '/items/decorations/crystal-lamp.svg',
    thumbnailPath: '/items/decorations/crystal-lamp.svg',
    petCompatibility: 'all',
    zIndex: 5,
  },
  {
    id: 'dec-floating-stars',
    name: 'Floating Stars',
    description: 'Magical stars orbit around',
    category: 'decoration',
    slot: 'decor_wall_1',
    rarity: 'epic',
    cost: 300,
    assetPath: '/items/decorations/floating-stars.svg',
    thumbnailPath: '/items/decorations/floating-stars.svg',
    petCompatibility: 'all',
    zIndex: 2,
  },
];

// Helper to get item by ID
export const getItemById = (id: string): GameItem | undefined => {
  return SHOP_ITEMS.find(item => item.id === id);
};

// Get items by category
export const getItemsByCategory = (category: GameItem['category']): GameItem[] => {
  return SHOP_ITEMS.filter(item => item.category === category);
};

// Get items by slot
export const getItemsBySlot = (slot: GameItem['slot']): GameItem[] => {
  return SHOP_ITEMS.filter(item => item.slot === slot);
};
