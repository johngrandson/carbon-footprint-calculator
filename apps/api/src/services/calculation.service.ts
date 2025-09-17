import type {
  ActivityResult,
  CalculationRequest,
  CalculationResponse
} from '@workspace/contracts';

import { CalculationStrategy } from '../strategies/base.strategy';
import { EnergyStrategy } from '../strategies/energy.strategy';
import { FoodStrategy } from '../strategies/food.strategy';

export class CalculationService {
  private strategies: Map<string, CalculationStrategy>;

  constructor() {
    this.strategies = new Map();
    this.strategies.set('food', new FoodStrategy());
    this.strategies.set('energy', new EnergyStrategy());
  }

  async calculate(request: CalculationRequest): Promise<CalculationResponse> {
    const { activities } = request;
    const activityResults: ActivityResult[] = [];
    const categoryBreakdown: Record<string, number> = {};

    // Calculate emissions for each activity
    for (const activity of activities) {
      const strategy = this.strategies.get(activity.category);

      if (!strategy) {
        throw new Error(`Unsupported category: ${activity.category}`);
      }

      const result = strategy.calculate(activity);
      activityResults.push(result);

      // Add to category breakdown
      categoryBreakdown[activity.category] =
        (categoryBreakdown[activity.category] || 0) + result.emissions;
    }

    // Calculate total emissions
    const totalCarbonFootprint = activityResults.reduce(
      (total, result) => total + result.emissions,
      0
    );

    // Calculate averages
    const dailyAverage = totalCarbonFootprint / 365;
    const annualEstimate = totalCarbonFootprint;

    return {
      totalCarbonFootprint,
      categoryBreakdown,
      dailyAverage,
      annualEstimate,
      activities: activityResults,
      recommendations: [],
      calculatedAt: new Date().toISOString()
    };
  }
}
