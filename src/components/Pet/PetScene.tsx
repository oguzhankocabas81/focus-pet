import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GameItem, EquippedItems } from '@/types/items';
import { getItemById } from '@/data/shopItems';

interface PetSceneProps {
  equippedItems: EquippedItems;
  petSize?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode; // The pet component (PetRig with PetBase inside)
  className?: string;
  showDecorations?: boolean;
}

const SIZE_DIMENSIONS = {
  sm: { width: 140, height: 140 },
  md: { width: 180, height: 180 },
  lg: { width: 220, height: 220 },
  xl: { width: 280, height: 280 },
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

  // Get decorations
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
        'relative overflow-hidden rounded-3xl shadow-lg',
        className
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Layer 1: Background - fills entire scene */}
      <div className="absolute inset-0 z-0">
        {backgroundItem ? (
          <img
            src={backgroundItem.assetPath}
            alt={backgroundItem.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-card to-secondary/20" />
        )}
      </div>

      {/* Layer 2: Wall decorations (behind pet, upper area) */}
      {wallDecorations.map((item, index) => (
        <motion.img
          key={item.id}
          src={item.assetPath}
          alt={item.name}
          className="absolute pointer-events-none object-contain"
          style={{
            zIndex: 2,
            top: '8%',
            left: index === 0 ? '8%' : undefined,
            right: index === 1 ? '8%' : undefined,
            width: '30%',
            height: '30%',
          }}
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        />
      ))}

      {/* Layer 3: Pet with accessories (PetRig - centered) */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {children}
      </div>

      {/* Layer 4: Floor decorations (in front of pet, bottom area) */}
      {floorDecorations.map((item, index) => (
        <motion.img
          key={item.id}
          src={item.assetPath}
          alt={item.name}
          className="absolute pointer-events-none object-contain"
          style={{
            zIndex: 15,
            bottom: '5%',
            left: index === 0 ? '5%' : undefined,
            right: index === 1 ? '5%' : undefined,
            width: '28%',
            height: '35%',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, duration: 0.4 }}
        />
      ))}
    </div>
  );
};
