import type { Activity } from '@workspace/contracts';

export interface QuizAnswers {
  diet_type?: string;
  energy_source?: string;
  monthly_kwh?: string | number;
  [key: string]: string | number | undefined;
}

export class QuizAnswerConverterService {
  private static readonly SINGLE_UNIT_FOR_ANNUAL_DIET_TYPE = 1;

  /**
   * Converts quiz answers to calculation activities
   */
  static convertToActivities(answers: QuizAnswers): Activity[] {
    const activities: Activity[] = [];

    // Convert diet type to food activity
    const foodActivity = this.convertDietAnswer(answers.diet_type);
    if (foodActivity) {
      activities.push(foodActivity);
    }

    // Convert energy source and consumption to energy activity
    const energyActivity = this.convertEnergyAnswers(
      answers.energy_source,
      answers.monthly_kwh
    );
    if (energyActivity) {
      activities.push(energyActivity);
    }

    return activities;
  }

  /**
   * Converts diet answer to food activity
   */
  private static convertDietAnswer(dietType?: string): Activity | null {
    if (!dietType) return null;

    const dietMap: Record<string, string> = {
      'High meat consumption (meat multiple times per day)': 'highMeat',
      'Moderate meat consumption (meat once per day)': 'moderateMeat',
      'Low meat consumption (meat few times per week)': 'lowMeat',
      'Vegetarian (no meat, but dairy and eggs)': 'vegetarian',
      'Vegan (no animal products)': 'vegetarian'
    };

    const mappedDietType = dietMap[dietType];
    if (!mappedDietType) return null;

    return {
      category: 'food',
      type: mappedDietType,
      amount: this.SINGLE_UNIT_FOR_ANNUAL_DIET_TYPE,
      unit: 'year'
    };
  }

  /**
   * Converts energy answers to energy activity
   */
  private static convertEnergyAnswers(
    energySource?: string,
    monthlyKwh?: string | number
  ): Activity | null {
    if (!energySource || !monthlyKwh) return null;

    const energyMap: Record<string, string> = {
      'Renewable energy (solar, wind, hydro)': 'renewable',
      'Natural gas': 'naturalGas',
      'Coal-based electricity': 'coal',
      'Nuclear power': 'nuclear',
      'Mixed grid electricity (standard utility)': 'mixedGrid'
    };

    const mappedEnergyType = energyMap[energySource];
    if (!mappedEnergyType) return null;

    const annualKwh = Number(monthlyKwh) * 12;
    if (isNaN(annualKwh) || annualKwh <= 0) return null;

    return {
      category: 'energy',
      type: mappedEnergyType,
      amount: annualKwh,
      unit: 'kWh'
    };
  }
}
