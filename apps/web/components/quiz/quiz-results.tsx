import React from 'react';

import type { QuizCalculationResponse } from '@workspace/contracts';
import { Button, Card, CardContent, CardTitle, Progress } from '@workspace/ui';

import { ListItem } from '../ui/list-item';
import { Stat } from '../ui/stat';

export interface QuizResultsProps {
  result: QuizCalculationResponse;
  onStartNew?: () => void;
  className?: string;
}

export function QuizResults({
  result,
  onStartNew,
  className
}: QuizResultsProps) {
  const { calculation, aiResponse, answers } = result;
  const globalAverage = 4800;
  const userFootprint = calculation.totalCarbonFootprint;
  const percentageVsGlobal =
    ((userFootprint - globalAverage) / globalAverage) * 100;

  return (
    <div className={`w-full p-4 ${className || ''}`}>
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Carbon Footprint Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Based on your quiz responses
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[57vh]">
        <Card className="overflow-y-auto">
          <CardContent className="space-y-6">
            <div>
              <CardTitle className="mb-4 mt-6">Summary</CardTitle>
              <div className="grid grid-cols-3 gap-4">
                <Stat
                  value={calculation.totalCarbonFootprint}
                  label="kg CO₂/year"
                />
                <Stat
                  value={calculation.dailyAverage}
                  label="kg CO₂/day"
                  variant="muted"
                />
                <Stat
                  value={calculation.annualEstimate}
                  label="Annual est."
                  variant="light"
                />
              </div>
            </div>

            <div>
              <CardTitle className="mb-3">By Category</CardTitle>
              <div className="space-y-2">
                {Object.entries(calculation.categoryBreakdown).map(
                  ([category, value]) => (
                    <ListItem
                      key={category}
                      label={category}
                      value={`${value.toFixed(1)} kg`}
                    />
                  )
                )}
              </div>
            </div>

            <div>
              <CardTitle className="mb-3">vs Global Average</CardTitle>
              <div className="space-y-3">
                <ListItem
                  label="Global Average"
                  value="4,800 kg CO₂/year"
                />
                <ListItem
                  label="Your Footprint"
                  value={`${userFootprint.toFixed(0)} kg CO₂/year`}
                />

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Better</span>
                    <span>4.8k</span>
                    <span>Worse</span>
                  </div>
                  <Progress
                    value={(userFootprint / (globalAverage * 2)) * 100}
                    className={`h-2 ${
                      userFootprint < globalAverage
                        ? 'text-green-600'
                        : userFootprint < globalAverage * 1.5
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  />
                </div>

                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {userFootprint < globalAverage
                      ? `🌱 Great! You're ${Math.abs(percentageVsGlobal).toFixed(0)}% below global average`
                      : userFootprint < globalAverage * 1.5
                        ? `⚠️ You're ${percentageVsGlobal.toFixed(0)}% above global average`
                        : `🚨 Consider reducing - you're significantly above average`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-y-auto">
          <CardContent className="space-y-4 mt-6">
            <CardTitle>🤖 AI Recommendations</CardTitle>
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {aiResponse}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <details>
          <summary className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium">
            Your Quiz Answers
          </summary>
          <CardContent className="space-y-2">
            {Object.entries(answers).map(([questionId, answer]) => (
              <ListItem
                key={questionId}
                label={questionId.replace('_', ' ')}
                value={String(answer)}
              />
            ))}
          </CardContent>
        </details>
      </Card>

      {onStartNew && (
        <div className="text-center mt-6">
          <Button
            onClick={onStartNew}
            variant="outline"
            size="lg"
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Take Quiz Again
          </Button>
        </div>
      )}
    </div>
  );
}
