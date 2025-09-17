import { beforeEach, describe, expect, it } from 'vitest';

import { FoodStrategy } from '../../../../src/strategies/food.strategy';

describe('FoodStrategy', () => {
  let foodStrategy: FoodStrategy;

  beforeEach(() => {
    foodStrategy = new FoodStrategy();
  });

  describe('Strategy Properties', () => {
    it('should have correct category', () => {
      expect(foodStrategy.category).toBe('food');
    });
  });

  describe('Validation', () => {
    it('should validate correct food activities', () => {
      const validActivities = [
        {
          category: 'food' as const,
          type: 'highMeat',
          amount: 365
        },
        {
          category: 'food' as const,
          type: 'vegetarian',
          amount: 100
        },
        {
          category: 'food' as const,
          type: 'localFood',
          amount: 50
        }
      ];

      validActivities.forEach((activity) => {
        expect(foodStrategy.validate(activity)).toBe(true);
      });
    });

    it('should reject invalid category', () => {
      const activity = {
        category: 'energy' as const,
        type: 'highMeat',
        amount: 365
      };

      expect(foodStrategy.validate(activity)).toBe(false);
    });

    it('should reject unsupported food types', () => {
      const activity = {
        category: 'food' as const,
        type: 'invalidFoodType',
        amount: 365
      };

      expect(foodStrategy.validate(activity)).toBe(false);
    });

    it('should reject zero or negative amounts', () => {
      const activities = [
        {
          category: 'food' as const,
          type: 'highMeat',
          amount: 0
        },
        {
          category: 'food' as const,
          type: 'vegetarian',
          amount: -100
        }
      ];

      activities.forEach((activity) => {
        expect(foodStrategy.validate(activity)).toBe(false);
      });
    });

    it('should reject non-numeric amounts', () => {
      const activity = {
        category: 'food' as const,
        type: 'highMeat',
        amount: '365' as any
      };

      expect(foodStrategy.validate(activity)).toBe(false);
    });
  });

  describe('Diet Type Calculations', () => {
    it('should calculate high meat consumption correctly', () => {
      const activity = {
        category: 'food' as const,
        type: 'highMeat',
        amount: 365
      };

      const result = foodStrategy.calculate(activity);

      expect(result.activity).toEqual(activity);
      expect(result.emissions).toBe(365 * 2555); // 932,575 kg CO2e/year
      expect(result.factor).toBe(2555);
      expect(result.factorUnit).toBe('kg CO2e/year or kg CO2e/kg');
    });

    it('should calculate moderate meat consumption correctly', () => {
      const activity = {
        category: 'food' as const,
        type: 'moderateMeat',
        amount: 365
      };

      const result = foodStrategy.calculate(activity);

      expect(result.emissions).toBe(365 * 1460); // 532,900 kg CO2e/year
      expect(result.factor).toBe(1460);
    });

    it('should calculate low meat consumption correctly', () => {
      const activity = {
        category: 'food' as const,
        type: 'lowMeat',
        amount: 365
      };

      const result = foodStrategy.calculate(activity);

      expect(result.emissions).toBe(365 * 547.5); // 199,837.5 kg CO2e/year
      expect(result.factor).toBe(547.5);
    });

    it('should calculate vegetarian diet correctly', () => {
      const activity = {
        category: 'food' as const,
        type: 'vegetarian',
        amount: 365
      };

      const result = foodStrategy.calculate(activity);

      expect(result.emissions).toBe(365 * 292); // 106,580 kg CO2e/year
      expect(result.factor).toBe(292);
    });
  });

  describe('Food Source Calculations', () => {
    it('should calculate local food impact correctly', () => {
      const activity = {
        category: 'food' as const,
        type: 'localFood',
        amount: 100 // kg of local food
      };

      const result = foodStrategy.calculate(activity);

      expect(result.emissions).toBe(100 * 0.9); // 90 kg CO2e
      expect(result.factor).toBe(0.9);
    });

    it('should calculate processed food impact correctly', () => {
      const activity = {
        category: 'food' as const,
        type: 'processedFood',
        amount: 50 // kg of processed food
      };

      const result = foodStrategy.calculate(activity);

      expect(result.emissions).toBe(50 * 2.5); // 125 kg CO2e
      expect(result.factor).toBe(2.5);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should return zero emissions for invalid activities', () => {
      const invalidActivity = {
        category: 'food' as const,
        type: 'invalidType',
        amount: 365
      };

      const result = foodStrategy.calculate(invalidActivity);

      expect(result.emissions).toBe(0);
      expect(result.factor).toBe(0);
      expect(result.activity).toEqual(invalidActivity);
    });

    it('should handle decimal amounts correctly', () => {
      const activity = {
        category: 'food' as const,
        type: 'vegetarian',
        amount: 365.5
      };

      const result = foodStrategy.calculate(activity);

      expect(result.emissions).toBe(365.5 * 292); // 106,726 kg CO2e/year
      expect(result.factor).toBe(292);
    });

    it('should handle very large amounts', () => {
      const activity = {
        category: 'food' as const,
        type: 'highMeat',
        amount: 10000
      };

      const result = foodStrategy.calculate(activity);

      expect(result.emissions).toBe(10000 * 2555); // 25,550,000 kg CO2e
      expect(result.factor).toBe(2555);
    });

    it('should handle very small amounts', () => {
      const activity = {
        category: 'food' as const,
        type: 'localFood',
        amount: 0.1
      };

      const result = foodStrategy.calculate(activity);

      expect(result.emissions).toBe(0.1 * 0.9); // 0.09 kg CO2e
      expect(result.factor).toBe(0.9);
    });
  });

  describe('Emission Factor Accuracy', () => {
    it('should have realistic emission factors for diet types', () => {
      // Test that emission factors are in expected ranges
      const testCases = [
        { type: 'vegetarian', expectedRange: [250, 350] },
        { type: 'lowMeat', expectedRange: [500, 600] },
        { type: 'moderateMeat', expectedRange: [1400, 1500] },
        { type: 'highMeat', expectedRange: [2500, 2600] }
      ];

      testCases.forEach(({ type, expectedRange }) => {
        const activity = {
          category: 'food' as const,
          type,
          amount: 1
        };

        const result = foodStrategy.calculate(activity);
        expect(result.factor).toBeGreaterThanOrEqual(expectedRange[0]);
        expect(result.factor).toBeLessThanOrEqual(expectedRange[1]);
      });
    });

    it('should have consistent factor units', () => {
      const activity = {
        category: 'food' as const,
        type: 'vegetarian',
        amount: 365
      };

      const result = foodStrategy.calculate(activity);
      expect(result.factorUnit).toBe('kg CO2e/year or kg CO2e/kg');
    });
  });

  describe('Supported Food Types', () => {
    it('should support all expected diet types', () => {
      const expectedDietTypes = [
        'highMeat',
        'moderateMeat',
        'lowMeat',
        'vegetarian'
      ];

      expectedDietTypes.forEach((type) => {
        const activity = {
          category: 'food' as const,
          type,
          amount: 365
        };

        expect(foodStrategy.validate(activity)).toBe(true);
        const result = foodStrategy.calculate(activity);
        expect(result.emissions).toBeGreaterThan(0);
      });
    });

    it('should support food source types', () => {
      const expectedSourceTypes = ['localFood', 'processedFood'];

      expectedSourceTypes.forEach((type) => {
        const activity = {
          category: 'food' as const,
          type,
          amount: 100
        };

        expect(foodStrategy.validate(activity)).toBe(true);
        const result = foodStrategy.calculate(activity);
        expect(result.emissions).toBeGreaterThan(0);
      });
    });
  });
});
