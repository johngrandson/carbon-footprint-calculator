'use client';

import { useState, useCallback } from 'react';

import { FloatingFruits } from '@workspace/ui/components/floating-fruits';
import { EnergyBackground } from '@workspace/ui/components/energy-background';

import { QuizForm } from '~/components/quiz/quiz-form';

const BACKGROUND_CONFIG = {
  food: {
    speed: 0.5,
    count: 70,
    depth: 100,
    backgroundColor: '#ffbf40',
    environment: 'sunset' as const,
  },
  energy: {},
  default: {
    speed: 0.5,
    count: 70,
    depth: 100,
    backgroundColor: '#ffbf40',
    environment: 'sunset' as const,
  }
} as const;

const BACKGROUND_STYLES = 'absolute inset-0 z-0';

type QuizCategory = 'food' | 'energy' | null;

const BackgroundRenderer = ({ category }: { category: QuizCategory }) => {
  switch (category) {
    case 'food':
      return (
        <FloatingFruits
          className={BACKGROUND_STYLES}
          {...BACKGROUND_CONFIG.food}
        />
      );
    case 'energy':
      return (
        <EnergyBackground className={BACKGROUND_STYLES} />
      );
    default:
      return (
        <FloatingFruits
          className={BACKGROUND_STYLES}
          {...BACKGROUND_CONFIG.default}
        />
      );
  }
};

export default function QuizPage() {
  const [currentCategory, setCurrentCategory] = useState<QuizCategory>(null);

  const handleCategoryChange = useCallback((category: string | null) => {
    setCurrentCategory(category as QuizCategory);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Dynamic Background based on category */}
      <BackgroundRenderer category={currentCategory} />

      {/* Quiz Content */}
      <div className="relative z-10">
        <QuizForm onCategoryChange={handleCategoryChange} />
      </div>
    </div>
  );
}
