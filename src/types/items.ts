import { PetType } from './index';

// Item slot definitions
export type ItemSlot = 
  | 'background'      // Scene background
  | 'hat'             // Head accessory
  | 'glasses'         // Face accessory
  | 'neck'            // Neck/collar
  | 'outfit'          // Body outfit
  | 'decor_floor_1'   // Floor decoration 1
  | 'decor_floor_2'   // Floor decoration 2
  | 'decor_wall_1'    // Wall decoration 1
  | 'decor_wall_2';   // Wall decoration 2

export type ItemCategory = 'background' | 'accessory' | 'decoration';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

// Anchor points for accessories on the pet
export type AnchorPoint = 'head' | 'face' | 'neck' | 'body';

// Enhanced ShopItem with proper asset paths and anchoring
export interface GameItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  slot: ItemSlot;
  rarity: ItemRarity;
  cost: number;
  assetPath: string;        // Path to PNG/SVG asset in public/
  thumbnailPath: string;    // Path to thumbnail for shop display
  petCompatibility: 'all' | PetType[];
  // Accessory positioning (for category: 'accessory')
  anchor?: AnchorPoint;
  offsetX?: number;         // Horizontal offset in pixels
  offsetY?: number;         // Vertical offset in pixels  
  scale?: number;           // Scale multiplier (default 1)
  rotation?: number;        // Rotation in degrees
  zIndex?: number;          // Stacking order
}

// Equipment state - one item per slot
export interface EquippedItems {
  background?: string;
  hat?: string;
  glasses?: string;
  neck?: string;
  outfit?: string;
  decor_floor_1?: string;
  decor_floor_2?: string;
  decor_wall_1?: string;
  decor_wall_2?: string;
}

// Slot to anchor mapping for accessories
export const SLOT_ANCHOR_MAP: Partial<Record<ItemSlot, AnchorPoint>> = {
  hat: 'head',
  glasses: 'face',
  neck: 'neck',
  outfit: 'body',
};

// Decoration slots
export const DECORATION_SLOTS: ItemSlot[] = [
  'decor_floor_1',
  'decor_floor_2', 
  'decor_wall_1',
  'decor_wall_2',
];

// Accessory slots
export const ACCESSORY_SLOTS: ItemSlot[] = [
  'hat',
  'glasses',
  'neck',
  'outfit',
];
