import React from 'react';
import { render, screen } from '@testing-library/react';

import type { QuizCalculationResponse } from '@workspace/contracts';

import { QuizResults } from './quiz-results';

const mockResult: QuizCalculationResponse = {
  sessionId: 'test-session-id',
  calculation: {
    totalCarbonFootprint: 5000,
    dailyAverage: 13.7,
    annualEstimate: 5000,
    categoryBreakdown: {
      energy: 2000,
      food: 3000
    },
    activities: [
      {
        activity: {
          category: 'energy' as const,
          type: 'renewable',
          amount: 100
        },
        emissions: 2000,
        factor: 0.02,
        factorUnit: 'kg CO2/kWh'
      },
      {
        activity: {
          category: 'food' as const,
          type: 'vegetarian',
          amount: 365
        },
        emissions: 3000,
        factor: 8.2,
        factorUnit: 'kg CO2/day'
      }
    ],
    recommendations: [
      'Consider using more renewable energy',
      'Try eating more plant-based meals'
    ],
    calculatedAt: '2024-01-01T00:00:00.000Z'
  },
  aiResponse:
    '## Great job!\n\nYour carbon footprint is **below average**. Here are some *tips* to reduce it further:\n\n- Use public transportation\n- Eat less meat\n- Use renewable energy',
  answers: {
    energy_source: 'renewable',
    diet_type: 'vegetarian'
  }
};

describe('QuizResults', () => {
  it('renders the carbon footprint results correctly', () => {
    render(<QuizResults result={mockResult} />);

    expect(
      screen.getByText('Your Carbon Footprint Results')
    ).toBeInTheDocument();
    expect(screen.getAllByText('5000.0')).toHaveLength(2); // Total and annual estimate
    expect(screen.getByText('kg CO₂/year')).toBeInTheDocument();
    expect(screen.getByText('13.7')).toBeInTheDocument(); // Daily average
  });

  it('displays category breakdown', () => {
    render(<QuizResults result={mockResult} />);

    expect(screen.getByText('By Category')).toBeInTheDocument();
    expect(screen.getByText('energy')).toBeInTheDocument();
    expect(screen.getByText('2000.0 kg')).toBeInTheDocument();
    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText('3000.0 kg')).toBeInTheDocument();
  });

  it('shows global comparison', () => {
    render(<QuizResults result={mockResult} />);

    expect(screen.getByText('vs Global Average')).toBeInTheDocument();
    expect(screen.getByText('Global Average')).toBeInTheDocument();
    expect(screen.getByText('4,800 kg CO₂/year')).toBeInTheDocument();
  });

  it('renders AI recommendations', () => {
    render(<QuizResults result={mockResult} />);

    expect(screen.getByText('🤖 AI Recommendations')).toBeInTheDocument();

    const aiContent = screen.getByText(/Great job!/);
    expect(aiContent).toBeInTheDocument();
  });

  it('shows quiz answers when expanded', () => {
    render(<QuizResults result={mockResult} />);

    expect(screen.getByText('Your Quiz Answers')).toBeInTheDocument();
  });

  it('shows "Take Quiz Again" button when onStartNew is provided', () => {
    const onStartNew = vi.fn();
    render(
      <QuizResults
        result={mockResult}
        onStartNew={onStartNew}
      />
    );

    expect(screen.getByText('Take Quiz Again')).toBeInTheDocument();
  });

  it('does not show "Take Quiz Again" button when onStartNew is not provided', () => {
    render(<QuizResults result={mockResult} />);

    expect(screen.queryByText('Take Quiz Again')).not.toBeInTheDocument();
  });
});
