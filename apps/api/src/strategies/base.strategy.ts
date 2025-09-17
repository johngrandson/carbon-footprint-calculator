import type {
  Activity,
  ActivityResult,
  CategoryType
} from '@workspace/contracts';

export interface CalculationStrategy {
  readonly category: CategoryType;

  calculate(activity: Activity): ActivityResult;
  validate(activity: Activity): boolean;
}
