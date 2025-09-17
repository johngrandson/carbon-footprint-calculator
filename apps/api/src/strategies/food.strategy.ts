import type { Activity, ActivityResult } from '@workspace/contracts';

import { CalculationStrategy } from './base.strategy';

export class FoodStrategy implements CalculationStrategy {
  readonly category = 'food' as const;

  private readonly factors = {
    highMeat: 2555,
    moderateMeat: 1460,
    lowMeat: 547.5,
    vegetarian: 292,
    localFood: 0.9,
    processedFood: 2.5
  };

  private readonly supportedTypes = new Set([
    'highMeat',
    'moderateMeat',
    'lowMeat',
    'vegetarian',
    'localFood',
    'processedFood'
  ]);

  validate(activity: Activity): boolean {
    return (
      activity.category === 'food' &&
      this.supportedTypes.has(activity.type) &&
      activity.amount > 0 &&
      typeof activity.amount === 'number'
    );
  }

  calculate(activity: Activity): ActivityResult {
    if (!this.validate(activity)) {
      return {
        activity,
        emissions: 0,
        factor: 0,
        factorUnit: 'kg CO2e/year or kg CO2e/kg'
      };
    }

    const factor =
      this.factors[activity.type as keyof typeof this.factors] || 0;
    const emissions = activity.amount * factor;

    return {
      activity,
      emissions,
      factor,
      factorUnit: 'kg CO2e/year or kg CO2e/kg'
    };
  }
}
