import { beforeEach, describe, expect, it } from 'vitest';

import { EnergyStrategy } from '../../../../src/strategies/energy.strategy';

describe('EnergyStrategy', () => {
  let energyStrategy: EnergyStrategy;

  beforeEach(() => {
    energyStrategy = new EnergyStrategy();
  });

  describe('Strategy Properties', () => {
    it('should have correct category', () => {
      expect(energyStrategy.category).toBe('energy');
    });
  });

  describe('Validation', () => {
    it('should validate correct energy activities', () => {
      const validActivities = [
        {
          category: 'energy' as const,
          type: 'coal',
          amount: 1000
        },
        {
          category: 'energy' as const,
          type: 'renewable',
          amount: 500
        },
        {
          category: 'energy' as const,
          type: 'naturalGas',
          amount: 750
        }
      ];

      validActivities.forEach((activity) => {
        expect(energyStrategy.validate(activity)).toBe(true);
      });
    });

    it('should reject invalid category', () => {
      const activity = {
        category: 'food' as const,
        type: 'coal',
        amount: 1000
      };

      expect(energyStrategy.validate(activity)).toBe(false);
    });

    it('should reject unsupported energy types', () => {
      const activity = {
        category: 'energy' as const,
        type: 'invalidEnergyType',
        amount: 1000
      };

      expect(energyStrategy.validate(activity)).toBe(false);
    });

    it('should reject zero or negative amounts', () => {
      const activities = [
        {
          category: 'energy' as const,
          type: 'coal',
          amount: 0
        },
        {
          category: 'energy' as const,
          type: 'renewable',
          amount: -500
        }
      ];

      activities.forEach((activity) => {
        expect(energyStrategy.validate(activity)).toBe(false);
      });
    });

    it('should reject non-numeric amounts', () => {
      const activity = {
        category: 'energy' as const,
        type: 'coal',
        amount: '1000' as any
      };

      expect(energyStrategy.validate(activity)).toBe(false);
    });
  });

  describe('Fossil Fuel Energy Calculations', () => {
    it('should calculate coal energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'coal',
        amount: 1000 // kWh
      };

      const result = energyStrategy.calculate(activity);

      expect(result.activity).toEqual(activity);
      expect(result.emissions).toBe(1000 * 0.82); // 820 kg CO2e
      expect(result.factor).toBe(0.82);
      expect(result.factorUnit).toBe('kg CO2e/kWh');
    });

    it('should calculate natural gas energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'naturalGas',
        amount: 2000 // kWh
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(2000 * 0.35); // 700 kg CO2e
      expect(result.factor).toBe(0.35);
    });

    it('should calculate oil energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'oil',
        amount: 500 // kWh
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(500 * 0.68); // 340 kg CO2e
      expect(result.factor).toBe(0.68);
    });

    it('should calculate propane energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'propane',
        amount: 300 // kWh
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(300 * 0.61); // 183 kg CO2e
      expect(result.factor).toBe(0.61);
    });
  });

  describe('Clean Energy Calculations', () => {
    it('should calculate renewable energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'renewable',
        amount: 3000 // kWh
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(3000 * 0.02); // 60 kg CO2e
      expect(result.factor).toBe(0.02);
    });

    it('should calculate nuclear energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'nuclear',
        amount: 2500 // kWh
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(2500 * 0.01); // 25 kg CO2e
      expect(result.factor).toBe(0.01);
    });
  });

  describe('Mixed Grid Energy Calculations', () => {
    it('should calculate mixed grid energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'mixedGrid',
        amount: 1200 // kWh
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(1200 * 0.45); // 540 kg CO2e
      expect(result.factor).toBe(0.45);
    });

    it('should calculate electric energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'electric',
        amount: 800 // kWh
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(800 * 0.45); // 360 kg CO2e
      expect(result.factor).toBe(0.45);
    });
  });

  describe('Alternative Energy Calculations', () => {
    it('should calculate wood energy correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'wood',
        amount: 600 // kWh equivalent
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(600 * 0.39); // 234 kg CO2e
      expect(result.factor).toBe(0.39);
    });
  });

  describe('Realistic Usage Scenarios', () => {
    it('should calculate typical household annual consumption', () => {
      // Average US household: ~11,000 kWh/year
      const activity = {
        category: 'energy' as const,
        type: 'mixedGrid',
        amount: 11000
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(11000 * 0.45); // 4,950 kg CO2e/year
      expect(result.factor).toBe(0.45);
    });

    it('should calculate high-efficiency home with renewable energy', () => {
      const activity = {
        category: 'energy' as const,
        type: 'renewable',
        amount: 6000 // Efficient home with solar
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(6000 * 0.02); // 120 kg CO2e/year
      expect(result.factor).toBe(0.02);
    });

    it('should calculate high-consumption home with coal power', () => {
      const activity = {
        category: 'energy' as const,
        type: 'coal',
        amount: 15000 // High consumption area
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(15000 * 0.82); // 12,300 kg CO2e/year
      expect(result.factor).toBe(0.82);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should return zero emissions for invalid activities', () => {
      const invalidActivity = {
        category: 'energy' as const,
        type: 'invalidType',
        amount: 1000
      };

      const result = energyStrategy.calculate(invalidActivity);

      expect(result.emissions).toBe(0);
      expect(result.factor).toBe(0);
      expect(result.activity).toEqual(invalidActivity);
    });

    it('should handle decimal amounts correctly', () => {
      const activity = {
        category: 'energy' as const,
        type: 'renewable',
        amount: 1500.75
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(1500.75 * 0.02); // 30.015 kg CO2e
      expect(result.factor).toBe(0.02);
    });

    it('should handle very large consumption amounts', () => {
      const activity = {
        category: 'energy' as const,
        type: 'coal',
        amount: 100000 // Commercial/industrial scale
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(100000 * 0.82); // 82,000 kg CO2e
      expect(result.factor).toBe(0.82);
    });

    it('should handle very small consumption amounts', () => {
      const activity = {
        category: 'energy' as const,
        type: 'nuclear',
        amount: 0.5
      };

      const result = energyStrategy.calculate(activity);

      expect(result.emissions).toBe(0.5 * 0.01); // 0.005 kg CO2e
      expect(result.factor).toBe(0.01);
    });
  });

  describe('Emission Factor Accuracy', () => {
    it('should have realistic emission factors ordered by carbon intensity', () => {
      // Nuclear should be lowest, coal should be highest
      const testCases = [
        { type: 'nuclear', expectedMax: 0.02 },
        { type: 'renewable', expectedMax: 0.05 },
        { type: 'naturalGas', expectedMax: 0.4 },
        { type: 'wood', expectedMax: 0.5 },
        { type: 'mixedGrid', expectedMax: 0.5 },
        { type: 'propane', expectedMax: 0.7 },
        { type: 'oil', expectedMax: 0.7 },
        { type: 'coal', expectedMin: 0.7 }
      ];

      testCases.forEach(({ type, expectedMax, expectedMin }) => {
        const activity = {
          category: 'energy' as const,
          type,
          amount: 1
        };

        const result = energyStrategy.calculate(activity);
        if (expectedMax) {
          expect(result.factor).toBeLessThanOrEqual(expectedMax);
        }
        if (expectedMin) {
          expect(result.factor).toBeGreaterThanOrEqual(expectedMin);
        }
      });
    });

    it('should have consistent factor units', () => {
      const activity = {
        category: 'energy' as const,
        type: 'mixedGrid',
        amount: 1000
      };

      const result = energyStrategy.calculate(activity);
      expect(result.factorUnit).toBe('kg CO2e/kWh');
    });
  });

  describe('Supported Energy Types', () => {
    it('should support all expected energy source types', () => {
      const expectedTypes = [
        'coal',
        'naturalGas',
        'renewable',
        'mixedGrid',
        'nuclear',
        'oil',
        'propane',
        'electric',
        'wood'
      ];

      expectedTypes.forEach((type) => {
        const activity = {
          category: 'energy' as const,
          type,
          amount: 1000
        };

        expect(energyStrategy.validate(activity)).toBe(true);
        const result = energyStrategy.calculate(activity);
        expect(result.emissions).toBeGreaterThanOrEqual(0);
        expect(result.factor).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Comparative Analysis', () => {
    it('should show renewable energy has much lower emissions than fossil fuels', () => {
      const renewableActivity = {
        category: 'energy' as const,
        type: 'renewable',
        amount: 1000
      };

      const coalActivity = {
        category: 'energy' as const,
        type: 'coal',
        amount: 1000
      };

      const renewableResult = energyStrategy.calculate(renewableActivity);
      const coalResult = energyStrategy.calculate(coalActivity);

      // Renewable should be at least 10x cleaner than coal
      expect(coalResult.emissions).toBeGreaterThan(
        renewableResult.emissions * 10
      );
    });

    it('should show nuclear energy has very low emissions', () => {
      const nuclearActivity = {
        category: 'energy' as const,
        type: 'nuclear',
        amount: 1000
      };

      const gasActivity = {
        category: 'energy' as const,
        type: 'naturalGas',
        amount: 1000
      };

      const nuclearResult = energyStrategy.calculate(nuclearActivity);
      const gasResult = energyStrategy.calculate(gasActivity);

      // Nuclear should be much cleaner than natural gas
      expect(gasResult.emissions).toBeGreaterThan(nuclearResult.emissions * 5);
    });
  });
});
