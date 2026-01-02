import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, ShoppingBag, Sparkles, Image, 
  Palette, Crown, Check, Lock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EvolvingPet } from '@/components/Pet/EvolvingPet';
import { CoinDisplay } from '@/components/Common/CoinDisplay';
import { useGameStore } from '@/store/gameStore';
import { ShopItem, Rarity } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Shop items data
const SHOP_ITEMS: ShopItem[] = [
  // Backgrounds
  { id: 'bg-meadow', name: 'Meadow', description: 'A peaceful grassy meadow', category: 'background', rarity: 'common', cost: 75, spriteUrl: '🌾', petCompatibility: 'all' },
  { id: 'bg-ocean', name: 'Ocean Waves', description: 'Calming ocean backdrop', category: 'background', rarity: 'common', cost: 100, spriteUrl: '🌊', petCompatibility: 'all' },
  { id: 'bg-volcano', name: 'Volcano', description: 'A fiery volcanic landscape', category: 'background', rarity: 'rare', cost: 250, spriteUrl: '🌋', petCompatibility: 'all' },
  { id: 'bg-forest', name: 'Enchanted Forest', description: 'Mystical woodland setting', category: 'background', rarity: 'rare', cost: 200, spriteUrl: '🌲', petCompatibility: 'all' },
  { id: 'bg-crystal', name: 'Crystal Cave', description: 'Shimmering crystal cavern', category: 'background', rarity: 'epic', cost: 500, spriteUrl: '💎', petCompatibility: 'all' },
  { id: 'bg-galaxy', name: 'Galaxy', description: 'Cosmic starfield', category: 'background', rarity: 'legendary', cost: 1000, spriteUrl: '🌌', petCompatibility: 'all' },
  
  // Accessories
  { id: 'acc-bow', name: 'Cute Bow', description: 'A stylish bow', category: 'accessory', rarity: 'common', cost: 50, spriteUrl: '🎀', petCompatibility: 'all' },
  { id: 'acc-glasses', name: 'Cool Glasses', description: 'Looking sharp!', category: 'accessory', rarity: 'common', cost: 75, spriteUrl: '🕶️', petCompatibility: 'all' },
  { id: 'acc-hat', name: 'Top Hat', description: 'Fancy headwear', category: 'accessory', rarity: 'rare', cost: 175, spriteUrl: '🎩', petCompatibility: 'all' },
  { id: 'acc-crown', name: 'Royal Crown', description: 'Fit for royalty', category: 'accessory', rarity: 'epic', cost: 600, spriteUrl: '👑', petCompatibility: 'all' },
  { id: 'acc-halo', name: 'Halo', description: 'Angelic glow', category: 'accessory', rarity: 'legendary', cost: 1200, spriteUrl: '😇', petCompatibility: 'all' },
  
  // Decorations
  { id: 'dec-sparkle', name: 'Sparkles', description: 'Shiny particles', category: 'decoration', rarity: 'common', cost: 60, spriteUrl: '✨', petCompatibility: 'all' },
  { id: 'dec-hearts', name: 'Love Hearts', description: 'Floating hearts', category: 'decoration', rarity: 'common', cost: 80, spriteUrl: '💕', petCompatibility: 'all' },
  { id: 'dec-stars', name: 'Star Trail', description: 'Trailing stars', category: 'decoration', rarity: 'rare', cost: 225, spriteUrl: '⭐', petCompatibility: 'all' },
  { id: 'dec-rainbow', name: 'Rainbow Aura', description: 'Colorful aura', category: 'decoration', rarity: 'epic', cost: 450, spriteUrl: '🌈', petCompatibility: 'all' },
  { id: 'dec-fire', name: 'Fire Aura', description: 'Blazing flames', category: 'decoration', rarity: 'epic', cost: 550, spriteUrl: '🔥', petCompatibility: ['fire'] },
  { id: 'dec-water', name: 'Water Aura', description: 'Flowing water', category: 'decoration', rarity: 'epic', cost: 550, spriteUrl: '💧', petCompatibility: ['water'] },
  { id: 'dec-leaf', name: 'Leaf Aura', description: 'Floating leaves', category: 'decoration', rarity: 'epic', cost: 550, spriteUrl: '🍃', petCompatibility: ['grass'] },
];

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-blue-500/20 text-blue-500',
  epic: 'bg-purple-500/20 text-purple-500',
  legendary: 'bg-amber-500/20 text-amber-500',
};

const RARITY_BORDERS: Record<Rarity, string> = {
  common: 'border-muted',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-amber-500/50 shadow-lg shadow-amber-500/20',
};

export const Shop = () => {
  const { user, pet, ownedItems, purchaseItem, equipItem } = useGameStore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handlePurchase = (item: ShopItem) => {
    if (!user) return;

    if (ownedItems.includes(item.id)) {
      // Toggle equip
      equipItem(item.id);
      toast({ 
        title: pet?.equippedItems.includes(item.id) ? "Item unequipped" : "Item equipped! ✨" 
      });
      return;
    }

    if (user.totalCoins < item.cost) {
      toast({ 
        title: "Not enough coins", 
        description: `You need ${item.cost - user.totalCoins} more coins`,
        variant: "destructive" 
      });
      return;
    }

    setSelectedItem(item);
    setShowConfirmDialog(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    const success = purchaseItem(selectedItem.id, selectedItem.cost);
    if (success) {
      equipItem(selectedItem.id);
      toast({ 
        title: "Item purchased! 🎉", 
        description: `${selectedItem.name} has been equipped` 
      });
    }
    setShowConfirmDialog(false);
    setSelectedItem(null);
  };

  const getItemsByCategory = (category: ShopItem['category']) => {
    return SHOP_ITEMS.filter(item => {
      if (item.category !== category) return false;
      if (item.petCompatibility === 'all') return true;
      return pet && item.petCompatibility.includes(pet.type);
    });
  };

  const renderItemGrid = (items: ShopItem[]) => (
    <div className="grid grid-cols-2 gap-3">
      <AnimatePresence>
        {items.map((item, index) => {
          const isOwned = ownedItems.includes(item.id);
          const isEquipped = pet?.equippedItems.includes(item.id);
          const canAfford = user && user.totalCoins >= item.cost;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={cn(
                  'p-4 cursor-pointer transition-all hover:shadow-lg border-2',
                  RARITY_BORDERS[item.rarity],
                  isEquipped && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                )}
                onClick={() => handlePurchase(item)}
              >
                {/* Sprite */}
                <div className="text-4xl mb-2 text-center">{item.spriteUrl}</div>

                {/* Name & Rarity */}
                <h3 className="font-medium text-sm text-foreground text-center mb-1">
                  {item.name}
                </h3>
                <div className="flex justify-center mb-2">
                  <span className={cn(
                    'text-[10px] font-medium uppercase px-2 py-0.5 rounded-full',
                    RARITY_COLORS[item.rarity]
                  )}>
                    {item.rarity}
                  </span>
                </div>

                {/* Price/Status */}
                <div className="text-center">
                  {isOwned ? (
                    <div className={cn(
                      'flex items-center justify-center gap-1 text-xs font-medium',
                      isEquipped ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {isEquipped ? (
                        <>
                          <Check className="w-3 h-3" />
                          Equipped
                        </>
                      ) : (
                        'Owned'
                      )}
                    </div>
                  ) : (
                    <div className={cn(
                      'flex items-center justify-center gap-1 text-sm font-bold',
                      canAfford ? 'text-coin' : 'text-muted-foreground'
                    )}>
                      {!canAfford && <Lock className="w-3 h-3" />}
                      <Coins className="w-3 h-3" />
                      {item.cost}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Pet Shop</h1>
          </div>
          <CoinDisplay amount={user?.totalCoins || 0} size="lg" />
        </motion.div>

        {/* Pet Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
            <div className="flex items-center justify-center">
              {pet && user && (
                <EvolvingPet type={pet.type} level={user.level} size="xl" showEquipment={true} />
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-3">
              {pet?.name} • Level {user?.level}
            </p>
          </Card>
        </motion.div>

        {/* Shop Tabs */}
        <Tabs defaultValue="background" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="background" className="text-xs">
              <Image className="w-4 h-4 mr-1" />
              Backgrounds
            </TabsTrigger>
            <TabsTrigger value="accessory" className="text-xs">
              <Crown className="w-4 h-4 mr-1" />
              Accessories
            </TabsTrigger>
            <TabsTrigger value="decoration" className="text-xs">
              <Sparkles className="w-4 h-4 mr-1" />
              Decorations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="background">
            {renderItemGrid(getItemsByCategory('background'))}
          </TabsContent>
          <TabsContent value="accessory">
            {renderItemGrid(getItemsByCategory('accessory'))}
          </TabsContent>
          <TabsContent value="decoration">
            {renderItemGrid(getItemsByCategory('decoration'))}
          </TabsContent>
        </Tabs>

        {/* Purchase Confirmation */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-sm mx-4 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-center">Confirm Purchase</DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="text-center py-4">
                <div className="text-6xl mb-4">{selectedItem.spriteUrl}</div>
                <h3 className="font-bold text-lg text-foreground mb-1">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedItem.description}
                </p>
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-coin mb-4">
                  <Coins className="w-5 h-5" />
                  {selectedItem.cost}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={confirmPurchase}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};