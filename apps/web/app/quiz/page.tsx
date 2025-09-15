import * as React from 'react';
import { type Metadata } from 'next';

import { FloatingFruits } from '@workspace/ui/components/floating-fruits';

import { QuizWizard } from '~/components/quiz/quiz-wizard';

export const metadata: Metadata = {
  title: 'SINAI | Carbon Footprint Calculator',
  description:
    'Calculate your personal carbon footprint and discover ways to reduce your environmental impact.',
  keywords: [
    'carbon footprint',
    'environmental impact',
    'sustainability',
    'calculator'
  ]
};

export default function QuizPage(): React.JSX.Element {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Floating Fruits Background */}
      <FloatingFruits
        className="absolute inset-0 z-0"
        speed={0.5}
        count={70}
        depth={100}
        backgroundColor="#ffbf40"
        environment="sunset"
      />

      {/* Quiz Content */}
      <div className="relative z-10">
        <QuizWizard />
      </div>
    </div>
  );
}
