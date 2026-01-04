import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { EquippedItems, AnchorPoint } from '@/types/items';
import { getItemById } from '@/data/shopItems';

interface PetRigProps {
  equippedItems: EquippedItems;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
  children: ReactNode; // The pet base visual
  className?: string;
}

// Size-based dimensions for precise positioning
const SIZE_DIMENSIONS = {
  sm: { width: 64, height: 64 },
  md: { width: 80, height: 80 },
  lg: { width: 96, height: 96 },
  xl: { width: 128, height: 128 },
};

// Anchor positions as percentage of pet container (from top-left)
// These define WHERE on the pet the accessory attaches
const ANCHOR_POSITIONS: Record<AnchorPoint, { x: number; y: number }> = {
  head: { x: 50, y: 0 },      // Top center - for hats
  face: { x: 50, y: 35 },     // Upper face - for glasses
  neck: { x: 50, y: 60 },     // Neck area - for collars
  body: { x: 50, y: 75 },     // Body center - for outfits
};

// Accessory size multipliers based on container size
const ACCESSORY_SIZE = {
  sm: 28,
  md: 36,
  lg: 44,
  xl: 56,
};

export const PetRig = ({
  equippedItems,
  size = 'lg',
  isAnimated = true,
  children,
  className,
}: PetRigProps) => {
  const dimensions = SIZE_DIMENSIONS[size];
  const accessorySize = ACCESSORY_SIZE[size];
  
  // Get accessory items that should be worn on the pet
  const accessories: Array<{ 
    item: NonNullable<ReturnType<typeof getItemById>>; 
    slot: keyof EquippedItems 
  }> = [];
  
  if (equippedItems.hat) {
    const item = getItemById(equippedItems.hat);
    if (item && item.anchor) accessories.push({ item, slot: 'hat' });
  }
  if (equippedItems.glasses) {
    const item = getItemById(equippedItems.glasses);
    if (item && item.anchor) accessories.push({ item, slot: 'glasses' });
  }
  if (equippedItems.neck) {
    const item = getItemById(equippedItems.neck);
    if (item && item.anchor) accessories.push({ item, slot: 'neck' });
  }
  if (equippedItems.outfit) {
    const item = getItemById(equippedItems.outfit);
    if (item && item.anchor) accessories.push({ item, slot: 'outfit' });
  }

  // Sort by zIndex so lower items render first
  accessories.sort((a, b) => (a.item.zIndex || 10) - (b.item.zIndex || 10));

  return (
    <motion.div
      className={cn('relative', className)}
      style={{ width: dimensions.width, height: dimensions.height }}
      animate={isAnimated ? { y: [0, -8, 0] } : undefined}
      transition={isAnimated ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
    >
      {/* Pet base - centered in container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>

      {/* Accessories layer - positioned on top of pet using anchor points */}
      {accessories.map(({ item }) => {
        const anchor = ANCHOR_POSITIONS[item.anchor!];
        const offsetX = item.offsetX || 0;
        const offsetY = item.offsetY || 0;
        const itemScale = item.scale || 1;
        const rotation = item.rotation || 0;
        const finalSize = accessorySize * itemScale;

        return (
          <motion.img
            key={item.id}
            src={item.assetPath}
            alt={item.name}
            className="absolute pointer-events-none"
            style={{
              width: finalSize,
              height: finalSize,
              // Position at anchor point, then offset by half the accessory size to center it
              left: `calc(${anchor.x}% + ${offsetX}px - ${finalSize / 2}px)`,
              top: `calc(${anchor.y}% + ${offsetY}px - ${finalSize / 2}px)`,
              transform: `rotate(${rotation}deg)`,
              zIndex: item.zIndex || 10,
              objectFit: 'contain',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        );
      })}
    </motion.div>
  );
};
