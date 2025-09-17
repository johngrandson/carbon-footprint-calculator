import type { Activity, ActivityResult } from '@workspace/contracts';

import { CalculationStrategy } from './base.strategy';

export class EnergyStrategy implements CalculationStrategy {
  readonly category = 'energy' as const;

  private readonly factors = {
    coal: 0.82,
    naturalGas: 0.35,
    renewable: 0.02,
    mixedGrid: 0.45,
    nuclear: 0.01,
    oil: 0.68,
    propane: 0.61,
    electric: 0.45,
    wood: 0.39
  };

  private readonly supportedTypes = new Set([
    'coal',
    'naturalGas',
    'renewable',
    'mixedGrid',
    'nuclear',
    'oil',
    'propane',
    'electric',
    'wood'
  ]);

  validate(activity: Activity): boolean {
    return (
      activity.category === 'energy' &&
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
        factorUnit: 'kg CO2e/kWh'
      };
    }

    const factor =
      this.factors[activity.type as keyof typeof this.factors] || 0;
    const emissions = activity.amount * factor;

    return {
      activity,
      emissions,
      factor,
      factorUnit: 'kg CO2e/kWh'
    };
  }
}
