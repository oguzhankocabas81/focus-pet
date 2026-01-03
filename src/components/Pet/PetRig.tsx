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

// Size-based scaling for accessories
const SIZE_SCALES = {
  sm: 0.5,
  md: 0.7,
  lg: 0.9,
  xl: 1.1,
};

// Anchor positions relative to pet center (in percentages)
const ANCHOR_POSITIONS: Record<AnchorPoint, { x: number; y: number }> = {
  head: { x: 50, y: 5 },    // Top center
  face: { x: 50, y: 35 },   // Upper middle
  neck: { x: 50, y: 55 },   // Lower middle
  body: { x: 50, y: 70 },   // Lower area
};

export const PetRig = ({
  equippedItems,
  size = 'lg',
  isAnimated = true,
  children,
  className,
}: PetRigProps) => {
  const sizeScale = SIZE_SCALES[size];
  
  // Get accessory items
  const accessories: Array<{ item: ReturnType<typeof getItemById>; slot: keyof EquippedItems }> = [];
  
  if (equippedItems.hat) {
    const item = getItemById(equippedItems.hat);
    if (item) accessories.push({ item, slot: 'hat' });
  }
  if (equippedItems.glasses) {
    const item = getItemById(equippedItems.glasses);
    if (item) accessories.push({ item, slot: 'glasses' });
  }
  if (equippedItems.neck) {
    const item = getItemById(equippedItems.neck);
    if (item) accessories.push({ item, slot: 'neck' });
  }
  if (equippedItems.outfit) {
    const item = getItemById(equippedItems.outfit);
    if (item) accessories.push({ item, slot: 'outfit' });
  }

  return (
    <motion.div
      className={cn('relative', className)}
      animate={isAnimated ? { y: [0, -6, 0] } : undefined}
      transition={isAnimated ? { duration: 2, repeat: Infinity, ease: 'easeInOut' as const } : undefined}
    >
      {/* Pet base */}
      <div className="relative">
        {children}
      </div>

      {/* Accessories layer - positioned absolutely on top of pet */}
      {accessories.map(({ item }) => {
        if (!item || !item.anchor) return null;

        const anchor = ANCHOR_POSITIONS[item.anchor];
        const offsetX = (item.offsetX || 0) * sizeScale;
        const offsetY = (item.offsetY || 0) * sizeScale;
        const scale = (item.scale || 1) * sizeScale;
        const rotation = item.rotation || 0;

        return (
          <motion.div
            key={item.id}
            className="absolute pointer-events-none"
            style={{
              left: `${anchor.x}%`,
              top: `${anchor.y}%`,
              transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`,
              zIndex: item.zIndex || 10,
              width: 60 * sizeScale,
              height: 60 * sizeScale,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img
              src={item.assetPath}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};
