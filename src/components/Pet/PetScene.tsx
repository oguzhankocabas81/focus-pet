import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GameItem, EquippedItems, ItemSlot, ACCESSORY_SLOTS } from '@/types/items';
import { getItemById } from '@/data/shopItems';

interface PetSceneProps {
  equippedItems: EquippedItems;
  petSize?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode; // The pet component
  className?: string;
  showDecorations?: boolean;
}

const SIZE_DIMENSIONS = {
  sm: { width: 120, height: 120 },
  md: { width: 160, height: 160 },
  lg: { width: 200, height: 200 },
  xl: { width: 260, height: 260 },
};

export const PetScene = ({
  equippedItems,
  petSize = 'lg',
  children,
  className,
  showDecorations = true,
}: PetSceneProps) => {
  const dimensions = SIZE_DIMENSIONS[petSize];
  
  // Get equipped background
  const backgroundItem = equippedItems.background 
    ? getItemById(equippedItems.background)
    : null;

  // Get floor decorations
  const floorDecorations: GameItem[] = [];
  const wallDecorations: GameItem[] = [];

  if (showDecorations) {
    if (equippedItems.decor_floor_1) {
      const item = getItemById(equippedItems.decor_floor_1);
      if (item) floorDecorations.push(item);
    }
    if (equippedItems.decor_floor_2) {
      const item = getItemById(equippedItems.decor_floor_2);
      if (item) floorDecorations.push(item);
    }
    if (equippedItems.decor_wall_1) {
      const item = getItemById(equippedItems.decor_wall_1);
      if (item) wallDecorations.push(item);
    }
    if (equippedItems.decor_wall_2) {
      const item = getItemById(equippedItems.decor_wall_2);
      if (item) wallDecorations.push(item);
    }
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl',
        className
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Layer 1: Background */}
      <div className="absolute inset-0">
        {backgroundItem ? (
          <img
            src={backgroundItem.assetPath}
            alt={backgroundItem.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-card via-card/80 to-muted" />
        )}
      </div>

      {/* Layer 2: Wall decorations (behind pet) */}
      {wallDecorations.map((item, index) => (
        <motion.div
          key={item.id}
          className="absolute pointer-events-none"
          style={{
            zIndex: item.zIndex || 2,
            top: '5%',
            left: index === 0 ? '10%' : '60%',
            width: '35%',
            height: '35%',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <img
            src={item.assetPath}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}

      {/* Layer 3: Pet with accessories (PetRig wrapper) */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {children}
      </div>

      {/* Layer 4: Floor decorations (in front, at bottom) */}
      {floorDecorations.map((item, index) => (
        <motion.div
          key={item.id}
          className="absolute pointer-events-none"
          style={{
            zIndex: 15,
            bottom: '5%',
            left: index === 0 ? '5%' : undefined,
            right: index === 1 ? '5%' : undefined,
            width: '25%',
            height: '35%',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
        >
          <img
            src={item.assetPath}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
};
