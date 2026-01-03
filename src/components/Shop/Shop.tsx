import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, ShoppingBag, Sparkles, Image, 
  Crown, Check, Lock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PetScene } from '@/components/Pet/PetScene';
import { PetRig } from '@/components/Pet/PetRig';
import { PetBase, getEvolutionStage } from '@/components/Pet/PetBase';
import { CoinDisplay } from '@/components/Common/CoinDisplay';
import { useGameStore } from '@/store/gameStore';
import { GameItem, ItemRarity, ItemSlot } from '@/types/items';
import { SHOP_ITEMS, getItemById } from '@/data/shopItems';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const RARITY_COLORS: Record<ItemRarity, string> = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-blue-500/20 text-blue-500',
  epic: 'bg-purple-500/20 text-purple-500',
  legendary: 'bg-amber-500/20 text-amber-500',
};

const RARITY_BORDERS: Record<ItemRarity, string> = {
  common: 'border-muted',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-amber-500/50 shadow-lg shadow-amber-500/20',
};

export const Shop = () => {
  const { user, pet, ownedItems, equippedItems, purchaseItem, equipItem, unequipSlot } = useGameStore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [previewEquipped, setPreviewEquipped] = useState(equippedItems);

  const handleItemClick = (item: GameItem) => {
    const isOwned = ownedItems.includes(item.id);

    if (isOwned) {
      // Toggle equip/unequip
      const isCurrentlyEquipped = equippedItems[item.slot] === item.id;
      
      if (isCurrentlyEquipped) {
        unequipSlot(item.slot);
        setPreviewEquipped(prev => {
          const newState = { ...prev };
          delete newState[item.slot];
          return newState;
        });
        toast({ title: "Item unequipped" });
      } else {
        equipItem(item.id, item.slot);
        setPreviewEquipped(prev => ({ ...prev, [item.slot]: item.id }));
        toast({ title: "Item equipped!" });
      }
      return;
    }

    // Not owned - show purchase dialog
    if (!user || user.totalCoins < item.cost) {
      toast({ 
        title: "Not enough coins", 
        description: `You need ${item.cost - (user?.totalCoins || 0)} more coins`,
        variant: "destructive" 
      });
      return;
    }

    setSelectedItem(item);
    // Show preview
    setPreviewEquipped(prev => ({ ...prev, [item.slot]: item.id }));
    setShowConfirmDialog(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    const success = purchaseItem(selectedItem.id, selectedItem.cost);
    if (success) {
      equipItem(selectedItem.id, selectedItem.slot);
      toast({ 
        title: "Item purchased!", 
        description: `${selectedItem.name} has been equipped` 
      });
    }
    setShowConfirmDialog(false);
    setSelectedItem(null);
  };

  const cancelPurchase = () => {
    // Reset preview
    setPreviewEquipped(equippedItems);
    setShowConfirmDialog(false);
    setSelectedItem(null);
  };

  const getItemsByCategory = (category: GameItem['category']) => {
    return SHOP_ITEMS.filter(item => {
      if (item.category !== category) return false;
      if (item.petCompatibility === 'all') return true;
      return pet && item.petCompatibility.includes(pet.type);
    });
  };

  const renderItemGrid = (items: GameItem[]) => (
    <div className="grid grid-cols-2 gap-3">
      <AnimatePresence>
        {items.map((item, index) => {
          const isOwned = ownedItems.includes(item.id);
          const isEquipped = equippedItems[item.slot] === item.id;
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
                onClick={() => handleItemClick(item)}
              >
                {/* Thumbnail */}
                <div className="w-full h-16 mb-2 flex items-center justify-center">
                  <img 
                    src={item.thumbnailPath} 
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

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

        {/* Pet Preview with Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
            <div className="flex items-center justify-center">
              {pet && user && (
                <PetScene 
                  equippedItems={previewEquipped} 
                  petSize="xl"
                >
                  <PetRig equippedItems={previewEquipped} size="xl">
                    <PetBase 
                      type={pet.type} 
                      stage={getEvolutionStage(user.level)} 
                      size="xl"
                    />
                  </PetRig>
                </PetScene>
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
        <Dialog open={showConfirmDialog} onOpenChange={(open) => !open && cancelPurchase()}>
          <DialogContent className="max-w-sm mx-4 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-center">Confirm Purchase</DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="text-center py-4">
                <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src={selectedItem.assetPath}
                    alt={selectedItem.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
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
                    onClick={cancelPurchase}
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
