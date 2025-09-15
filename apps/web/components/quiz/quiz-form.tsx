'use client';

import React from 'react';

export function QuizForm(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Carbon Footprint Quiz
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Coming soon: Interactive quiz to calculate your carbon footprint
      </p>
    </div>
  );
}
