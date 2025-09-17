import { beforeEach, describe, expect, it } from 'vitest';

import type { CategoryType } from '@workspace/contracts';

import { CalculationService } from '../../../../src/services/calculation.service';

describe('CalculationService', () => {
  let calculationService: CalculationService;

  beforeEach(() => {
    calculationService = new CalculationService();
  });

  describe('Service Initialization', () => {
    it('should initialize with food and energy strategies', () => {
      // This test verifies the service was constructed properly
      // We test this indirectly through the calculate method
      expect(calculationService).toBeDefined();
    });
  });

  describe('Single Activity Calculations', () => {
    it('should calculate food activity correctly', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'vegetarian',
            amount: 365
          }
        ]
      };

      const result = await calculationService.calculate(request);

      expect(result.totalCarbonFootprint).toBe(365 * 292); // 106,580 kg CO2e
      expect(result.activities).toHaveLength(1);
      expect(result.activities[0].emissions).toBe(365 * 292);
      expect(result.categoryBreakdown.food).toBe(365 * 292);
      expect(result.categoryBreakdown.energy).toBeUndefined();
    });

    it('should calculate energy activity correctly', async () => {
      const request = {
        activities: [
          {
            category: 'energy' as const,
            type: 'renewable',
            amount: 6000
          }
        ]
      };

      const result = await calculationService.calculate(request);

      expect(result.totalCarbonFootprint).toBe(6000 * 0.02); // 120 kg CO2e
      expect(result.activities).toHaveLength(1);
      expect(result.activities[0].emissions).toBe(6000 * 0.02);
      expect(result.categoryBreakdown.energy).toBe(6000 * 0.02);
      expect(result.categoryBreakdown.food).toBeUndefined();
    });
  });

  describe('Multiple Activity Calculations', () => {
    it('should calculate combined food and energy activities', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'moderateMeat',
            amount: 365
          },
          {
            category: 'energy' as const,
            type: 'mixedGrid',
            amount: 12000
          }
        ]
      };

      const result = await calculationService.calculate(request);

      const expectedFoodEmissions = 365 * 1460; // 532,900 kg CO2e
      const expectedEnergyEmissions = 12000 * 0.45; // 5,400 kg CO2e
      const expectedTotal = expectedFoodEmissions + expectedEnergyEmissions; // 538,300 kg CO2e

      expect(result.totalCarbonFootprint).toBe(expectedTotal);
      expect(result.activities).toHaveLength(2);
      expect(result.categoryBreakdown.food).toBe(expectedFoodEmissions);
      expect(result.categoryBreakdown.energy).toBe(expectedEnergyEmissions);
    });

    it('should calculate multiple activities of same category', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'vegetarian',
            amount: 365
          },
          {
            category: 'food' as const,
            type: 'localFood',
            amount: 100
          }
        ]
      };

      const result = await calculationService.calculate(request);

      const expectedDietEmissions = 365 * 292; // 106,580 kg CO2e
      const expectedLocalEmissions = 100 * 0.9; // 90 kg CO2e
      const expectedTotal = expectedDietEmissions + expectedLocalEmissions; // 106,670 kg CO2e

      expect(result.totalCarbonFootprint).toBe(expectedTotal);
      expect(result.activities).toHaveLength(2);
      expect(result.categoryBreakdown.food).toBe(expectedTotal);
    });
  });

  describe('Realistic User Scenarios', () => {
    it('should calculate typical vegetarian with renewable energy', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'vegetarian',
            amount: 365
          },
          {
            category: 'energy' as const,
            type: 'renewable',
            amount: 8000 // ~670 kWh/month
          }
        ]
      };

      const result = await calculationService.calculate(request);

      const expectedFoodEmissions = 365 * 292; // 106,580 kg CO2e
      const expectedEnergyEmissions = 8000 * 0.02; // 160 kg CO2e
      const expectedTotal = expectedFoodEmissions + expectedEnergyEmissions; // 106,740 kg CO2e

      expect(result.totalCarbonFootprint).toBe(expectedTotal);
      expect(result.dailyAverage).toBeCloseTo(expectedTotal / 365, 2);
      expect(result.annualEstimate).toBe(expectedTotal);
    });

    it('should calculate high-impact user with meat and coal', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'highMeat',
            amount: 365
          },
          {
            category: 'energy' as const,
            type: 'coal',
            amount: 15000 // High consumption
          }
        ]
      };

      const result = await calculationService.calculate(request);

      const expectedFoodEmissions = 365 * 2555; // 932,575 kg CO2e
      const expectedEnergyEmissions = 15000 * 0.82; // 12,300 kg CO2e
      const expectedTotal = expectedFoodEmissions + expectedEnergyEmissions; // 944,875 kg CO2e

      expect(result.totalCarbonFootprint).toBe(expectedTotal);
      expect(result.categoryBreakdown.food).toBe(expectedFoodEmissions);
      expect(result.categoryBreakdown.energy).toBe(expectedEnergyEmissions);
    });

    it('should calculate average US household', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'moderateMeat',
            amount: 365
          },
          {
            category: 'energy' as const,
            type: 'mixedGrid',
            amount: 11000 // Average US household
          }
        ]
      };

      const result = await calculationService.calculate(request);

      const expectedFoodEmissions = 365 * 1460; // 532,900 kg CO2e
      const expectedEnergyEmissions = 11000 * 0.45; // 4,950 kg CO2e
      const expectedTotal = expectedFoodEmissions + expectedEnergyEmissions; // 537,850 kg CO2e

      expect(result.totalCarbonFootprint).toBe(expectedTotal);

      // Check that result is in reasonable range for US household
      expect(result.totalCarbonFootprint).toBeGreaterThan(500000); // > 0.5 tons
      expect(result.totalCarbonFootprint).toBeLessThan(1000000); // < 1 ton
    });
  });

  describe('Result Structure and Metadata', () => {
    it('should return correct result structure', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'vegetarian',
            amount: 365
          }
        ]
      };

      const result = await calculationService.calculate(request);

      expect(result).toHaveProperty('totalCarbonFootprint');
      expect(result).toHaveProperty('categoryBreakdown');
      expect(result).toHaveProperty('dailyAverage');
      expect(result).toHaveProperty('annualEstimate');
      expect(result).toHaveProperty('activities');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('calculatedAt');
    });

    it('should calculate daily and annual averages correctly', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'vegetarian',
            amount: 365
          }
        ]
      };

      const result = await calculationService.calculate(request);

      expect(result.dailyAverage).toBe(result.totalCarbonFootprint / 365);
      expect(result.annualEstimate).toBe(result.totalCarbonFootprint);
    });

    it('should include timestamp in ISO format', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'vegetarian',
            amount: 365
          }
        ]
      };

      const result = await calculationService.calculate(request);

      expect(result.calculatedAt).toBeDefined();
      expect(new Date(result.calculatedAt).toISOString()).toBe(
        result.calculatedAt
      );
    });

    it('should initialize recommendations as empty array', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'vegetarian',
            amount: 365
          }
        ]
      };

      const result = await calculationService.calculate(request);

      expect(result.recommendations).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle unsupported activity category', async () => {
      const request = {
        activities: [
          {
            category: 'transportation' as any,
            type: 'car',
            amount: 1000
          }
        ]
      };

      await expect(calculationService.calculate(request)).rejects.toThrow(
        'Unsupported category: transportation'
      );
    });

    it('should handle empty activities array', async () => {
      const request = {
        activities: []
      };

      const result = await calculationService.calculate(request);

      expect(result.totalCarbonFootprint).toBe(0);
      expect(result.activities).toHaveLength(0);
      expect(result.categoryBreakdown).toEqual({});
      expect(result.dailyAverage).toBe(0);
      expect(result.annualEstimate).toBe(0);
    });

    it('should handle invalid activity data gracefully', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'invalidType',
            amount: 365
          }
        ]
      };

      const result = await calculationService.calculate(request);

      // Invalid activities should return zero emissions
      expect(result.totalCarbonFootprint).toBe(0);
      expect(result.activities).toHaveLength(1);
      expect(result.activities[0].emissions).toBe(0);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large numbers of activities', async () => {
      const activities = Array.from({ length: 100 }, (_, i) => ({
        category: (i % 2 === 0 ? 'food' : 'energy') as CategoryType,
        type: (i % 2 === 0 ? 'vegetarian' : 'renewable') as any,
        amount: 100
      }));

      const request = { activities };

      const result = await calculationService.calculate(request);

      expect(result.activities).toHaveLength(100);
      expect(result.totalCarbonFootprint).toBeGreaterThan(0);
    });

    it('should handle very large emission values', async () => {
      const request = {
        activities: [
          {
            category: 'food' as const,
            type: 'highMeat',
            amount: 100000 // Extreme amount
          }
        ]
      };

      const result = await calculationService.calculate(request);

      expect(result.totalCarbonFootprint).toBe(100000 * 2555);
      expect(result.totalCarbonFootprint).toBeGreaterThan(250000000);
    });

    it('should handle decimal values correctly', async () => {
      const request = {
        activities: [
          {
            category: 'energy' as const,
            type: 'renewable',
            amount: 1000.5
          }
        ]
      };

      const result = await calculationService.calculate(request);

      expect(result.totalCarbonFootprint).toBe(1000.5 * 0.02);
      expect(result.totalCarbonFootprint).toBeCloseTo(20.01, 2);
    });
  });
});
