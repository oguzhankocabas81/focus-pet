import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PixelPet } from '@/components/Pet/PixelPet';
import { useGameStore } from '@/store/gameStore';
import { PET_TYPES } from '@/utils/constants';
import { PetType } from '@/types';
import { cn } from '@/lib/utils';

type OnboardingStep = 'splash' | 'name' | 'pet' | 'petName';

export const Onboarding = () => {
  const [step, setStep] = useState<OnboardingStep>('splash');
  const [userName, setUserName] = useState('');
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [petName, setPetName] = useState('');
  const [error, setError] = useState('');

  const { createUser, setOnboarded } = useGameStore();

  const handleSplashComplete = () => {
    setTimeout(() => setStep('name'), 500);
  };

  const handleNameSubmit = () => {
    if (userName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (userName.trim().length > 20) {
      setError('Name must be less than 20 characters');
      return;
    }
    setError('');
    setStep('pet');
  };

  const handlePetSelect = (petType: PetType) => {
    setSelectedPet(petType);
    setStep('petName');
  };

  const handlePetNameSubmit = () => {
    if (petName.trim().length < 2) {
      setError('Pet name must be at least 2 characters');
      return;
    }
    if (!selectedPet) return;
    
    createUser(userName.trim(), selectedPet, petName.trim());
    setOnboarded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
            onAnimationComplete={handleSplashComplete}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AnProC
            </h1>
            <p className="text-muted-foreground mt-2">Anti-Procrastination Companion</p>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">What's your name?</h2>
              <p className="text-muted-foreground mt-1">Let's personalize your experience</p>
            </div>
            
            <div className="space-y-4">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="h-14 text-lg text-center rounded-2xl"
                maxLength={20}
                autoFocus
              />
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
              <Button 
                onClick={handleNameSubmit}
                className="w-full h-14 text-lg rounded-2xl"
                disabled={!userName.trim()}
              >
                Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'pet' && (
          <motion.div
            key="pet"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Choose your companion</h2>
              <p className="text-muted-foreground mt-1">Your pet will grow with every task you complete</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {PET_TYPES.map((pet, index) => (
                <motion.button
                  key={pet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePetSelect(pet.id)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all',
                    'bg-card hover:bg-accent/10',
                    'border-border hover:border-primary',
                    selectedPet === pet.id && 'border-primary bg-primary/5'
                  )}
                >
                  <PixelPet type={pet.id} size="md" isAnimated={false} />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{pet.name}</span>
                      <span className="text-lg">{pet.emoji}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{pet.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'petName' && selectedPet && (
          <motion.div
            key="petName"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm space-y-6"
          >
            <div className="text-center">
              <PixelPet type={selectedPet} size="xl" className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Name your companion</h2>
              <p className="text-muted-foreground mt-1">Give your new friend a special name</p>
            </div>
            
            <div className="space-y-4">
              <Input
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Enter pet name"
                className="h-14 text-lg text-center rounded-2xl"
                maxLength={20}
                autoFocus
              />
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
              <Button 
                onClick={handlePetNameSubmit}
                className="w-full h-14 text-lg rounded-2xl"
                disabled={!petName.trim()}
              >
                Let's Go!
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
