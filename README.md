# 🌱 Carbon Footprint Calculator

[![Tests](https://img.shields.io/badge/tests-170%20passing-brightgreen)](package.json)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](package.json)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🏗️ Architecture

### Apps and Packages

- **`apps/api`**: Fastify-based REST API server with carbon footprint calculations
- **`apps/web`**: Next.js frontend application with interactive quiz interface
- **`packages/contracts`**: Shared TypeScript types and Zod validation schemas
- **`packages/ui`**: Reusable React components with Tailwind CSS
- **`packages/routes`**: Route definitions and navigation utilities

### Tooling Packages

- **`@workspace/typescript-config`**: Shared TypeScript configurations
- **`@workspace/eslint-config`**: ESLint configurations with Next.js and Prettier
- **`@workspace/prettier-config`**: Code formatting configuration
- **`@workspace/vitest-config`**: Testing configuration and utilities

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **pnpm**: Version 9.0.0 (specified in package.json)
- **OpenAI API Key**: For AI-powered analysis features

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd carbon-footprint-calculator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Copy the environment example file and configure your API keys:

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   Edit `apps/api/.env` and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=4000
   HOST=0.0.0.0
   LOG_LEVEL=info
   ```

### Development

#### Start All Services

To run the entire development environment:

```bash
pnpm dev
```

This will start:

- **API Server**: http://localhost:4000
- **Web Application**: http://localhost:3000
- **API Documentation**: http://localhost:4000/documentation

#### Start Individual Services

**API Server Only:**

```bash
pnpm dev --filter=api
```

**Web Application Only:**

```bash
pnpm dev --filter=web
```

### API Endpoints

The API provides several endpoints for carbon footprint calculation:

- **Health Check**: `GET /health`
- **Start Quiz**: `POST /api/quiz/start`
- **Submit Answer**: `POST /api/quiz/answer`
- **Quiz Status**: `GET /api/quiz/status/:sessionId`
- **Calculate Results**: `POST /api/quiz/calculate`
- **Direct Calculation**: `POST /api/calculate`

#### API Documentation

Interactive API documentation is available at:

- **Swagger UI**: http://localhost:4000/documentation
- **OpenAPI Spec**: http://localhost:4000/documentation/json

### Testing

#### Run All Tests

```bash
pnpm test
```

#### Run Tests in Watch Mode

```bash
pnpm test:projects:watch
```

#### Run API Tests Only

```bash
pnpm test --filter=api
```

#### Test Coverage

View comprehensive test reports:

```bash
pnpm view-report
```

The test suite includes:

- **Unit Tests**: Service layer testing with isolation
- **Integration Tests**: Full API endpoint testing
- **Type Testing**: TypeScript compilation and validation

### Building

#### Development Build (Type Check Only)

```bash
pnpm build
```

This performs type checking without generating JavaScript files.

#### Production Build

```bash
pnpm build:prod
```

This generates optimized JavaScript files for production deployment.

#### Build Specific Packages

```bash
# Build only the API
pnpm build --filter=api

# Build only the web app
pnpm build --filter=web

# Build shared packages
pnpm build --filter=contracts
```

### Code Quality

#### Linting

```bash
pnpm lint
```

#### Format Code

```bash
pnpm format
```

#### Type Checking

```bash
pnpm typecheck
```

## 🧪 Development Workflow

### Adding New Features

1. **Add Types**: Define interfaces in `packages/contracts/src/types/`
2. **Add Validation**: Create Zod schemas in `packages/contracts/src/schemas/`
3. **Implement Service**: Add business logic in `apps/api/src/services/`
4. **Create Controller**: Add API endpoints in `apps/api/src/controllers/`
5. **Add Routes**: Register routes in `apps/api/src/routes/`
6. **Write Tests**: Add unit and integration tests
7. **Update Documentation**: Add examples to Swagger configuration

### Adding New Carbon Footprint Categories

This section provides a comprehensive guide for adding new categories to the carbon footprint calculator.
Follow these steps to ensure consistency and maintainability.

#### Step 1: Define the Category Type

First, add your new category to the category type definition:

**File**: `packages/contracts/src/schemas/activity.schemas.ts`

```typescript
// Add your new category to the CategoryTypeSchema
export const CategoryTypeSchema = z.enum([
  "transport",
  "energy",
  "food",
  "water", // ← Add new category here
  "waste", // ← Add new category here
  "consumption", // ← Add new category here
]);
```

#### Step 2: Create Category-Specific Activity Types

Define specific activity types for your new category:

**File**: `packages/contracts/src/schemas/activity.schemas.ts`

```typescript
// Example: Adding water category activities
export const WaterActivityTypeSchema = z.enum([
  "daily_consumption",
  "shower_duration",
  "dishwasher_usage",
  "laundry_frequency",
]);

// Add to the main ActivityTypeSchema union
export const ActivityTypeSchema = z.union([
  TransportActivityTypeSchema,
  EnergyActivityTypeSchema,
  FoodActivityTypeSchema,
  WaterActivityTypeSchema, // ← Add your new schema here
  // ... other categories
]);
```

#### Step 3: Define Emission Factors

Add emission factors for your new category:

**File**: `apps/api/src/services/calculation/emission-factors.ts`

```typescript
// Add emission factors for your new category
export const EMISSION_FACTORS = {
  // ... existing factors
  water: {
    daily_consumption: {
      unit: "liters",
      kgCO2PerUnit: 0.001, // kg CO2 per liter
      description: "Water consumption and treatment",
    },
    shower_duration: {
      unit: "minutes",
      kgCO2PerUnit: 0.5, // kg CO2 per minute
      description: "Hot water heating for showers",
    },
    // ... add more activity types
  },
} as const;
```

#### Step 4: Implement Category Calculation Logic

Create calculation logic for your new category:

**File**: `apps/api/src/services/calculation/calculators/water-calculator.ts`

```typescript
import { Activity, ActivityResult } from "@workspace/contracts";
import { EMISSION_FACTORS } from "../emission-factors";

export class WaterCalculator {
  static calculate(activity: Activity): ActivityResult {
    const factor = EMISSION_FACTORS.water[activity.type];

    if (!factor) {
      throw new Error(`Unknown water activity type: ${activity.type}`);
    }

    const emissions = activity.value * factor.kgCO2PerUnit;

    return {
      id: `water-${activity.type}-${Date.now()}`,
      category: "water",
      type: activity.type,
      value: activity.value,
      unit: activity.unit,
      carbonFootprint: emissions,
      emissionFactor: factor.kgCO2PerUnit,
      calculatedAt: new Date().toISOString(),
    };
  }
}
```

#### Step 5: Integrate with Main Calculator

Add your new calculator to the main calculation service:

**File**: `apps/api/src/services/calculation/carbon-calculator.service.ts`

```typescript
import { WaterCalculator } from "./calculators/water-calculator";

export class CarbonCalculatorService {
  static calculateActivity(activity: Activity): ActivityResult {
    switch (activity.category) {
      case "transport":
        return TransportCalculator.calculate(activity);
      case "energy":
        return EnergyCalculator.calculate(activity);
      case "food":
        return FoodCalculator.calculate(activity);
      case "water": // ← Add new case
        return WaterCalculator.calculate(activity); // ← Add new case
      default:
        throw new Error(`Unknown activity category: ${activity.category}`);
    }
  }
}
```

#### Step 6: Add Quiz Questions

Create quiz questions for your new category:

**File**: `apps/api/src/data/quiz-questions.ts`

```typescript
// Add questions for your new category
const waterQuestions: QuizQuestion[] = [
  {
    id: "water-daily-consumption",
    category: "water",
    question: "How many liters of water do you consume daily for drinking?",
    type: "number",
    unit: "liters",
    validation: {
      min: 0,
      max: 10,
      step: 0.5,
    },
  },
  {
    id: "water-shower-duration",
    category: "water",
    question: "How long are your typical showers?",
    type: "single_choice",
    options: [
      { value: "5", label: "Less than 5 minutes" },
      { value: "10", label: "5-10 minutes" },
      { value: "15", label: "10-15 minutes" },
      { value: "20", label: "More than 15 minutes" },
    ],
  },
];

// Add to the main questions array
export const quizQuestions: QuizQuestion[] = [
  ...foodQuestions,
  ...energyQuestions,
  ...waterQuestions, // ← Add your questions here
  // ... other categories
];
```

#### Step 7: Update Frontend Components

Add UI components for your new category:

**File**: `apps/web/components/quiz/fields/water-fields.tsx`

```typescript
import { QuizQuestion } from '@workspace/contracts';
import { NumberInput, SelectField } from '@workspace/ui';

interface WaterFieldsProps {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
}

export function WaterFields({ question, value, onChange }: WaterFieldsProps) {
  if (question.type === 'number') {
    return (
      <NumberInput
        value={Number(value) || 0}
        onChange={(val) => onChange(val.toString())}
        min={question.validation?.min}
        max={question.validation?.max}
        step={question.validation?.step}
        unit={question.unit}
      />
    );
  }

  if (question.type === 'single_choice') {
    return (
      <SelectField
        value={value}
        onValueChange={onChange}
        options={question.options || []}
      />
    );
  }

  return null;
}
```

#### Step 8: Write Tests

Create comprehensive tests for your new category:

**File**: `apps/api/src/services/calculation/calculators/__tests__/water-calculator.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { WaterCalculator } from "../water-calculator";

describe("WaterCalculator", () => {
  it("should calculate water consumption correctly", () => {
    const activity = {
      category: "water" as const,
      type: "daily_consumption" as const,
      value: 3,
      unit: "liters",
    };

    const result = WaterCalculator.calculate(activity);

    expect(result.carbonFootprint).toBe(0.003); // 3 liters * 0.001 kg/liter
    expect(result.category).toBe("water");
    expect(result.type).toBe("daily_consumption");
  });

  it("should handle shower duration calculation", () => {
    const activity = {
      category: "water" as const,
      type: "shower_duration" as const,
      value: 10,
      unit: "minutes",
    };

    const result = WaterCalculator.calculate(activity);

    expect(result.carbonFootprint).toBe(5); // 10 minutes * 0.5 kg/minute
  });

  it("should throw error for unknown activity type", () => {
    const activity = {
      category: "water" as const,
      type: "unknown" as any,
      value: 1,
      unit: "liters",
    };

    expect(() => WaterCalculator.calculate(activity)).toThrow();
  });
});
```

#### Step 9: Update API Documentation

The OpenAPI documentation will automatically include your new endpoints, but you may want to add specific examples:

**File**: `packages/contracts/src/schemas/openapi/spec.ts`

Add examples for your new category in the calculation request examples.

#### Step 10: Run Tests and Validation

Before committing your changes:

```bash
# Run type checking
pnpm typechecking

# Run all tests
pnpm test

# Run linting
pnpm lint

# Test the API manually
curl -X POST http://localhost:4000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "activities": [
      {
        "category": "water",
        "type": "daily_consumption",
        "value": 3,
        "unit": "liters"
      }
    ]
  }'
```

#### Step 11: Update Documentation

1. **Update this README** with any new API endpoints or usage examples
2. **Add JSDoc comments** to your new functions and classes
3. **Update the API documentation** examples if needed

### Category Implementation Checklist

Use this checklist when adding a new category:

- [ ] Added category to `CategoryTypeSchema`
- [ ] Created category-specific activity type schema
- [ ] Added emission factors for all activity types
- [ ] Implemented calculator class with proper error handling
- [ ] Integrated calculator with main calculation service
- [ ] Added quiz questions for the category
- [ ] Created frontend components for quiz fields
- [ ] Wrote comprehensive unit tests
- [ ] Added integration tests
- [ ] Updated API documentation examples
- [ ] Ran all tests and type checking
- [ ] Tested API endpoints manually
- [ ] Updated README with new examples

### Common Pitfalls to Avoid

1. **Inconsistent naming**: Use kebab-case for activity types (e.g., `daily_consumption`)
2. **Missing validation**: Always add proper Zod validation for new schemas
3. **Incomplete testing**: Test both success and error cases
4. **Hard-coded values**: Use emission factors from the centralized configuration
5. **Missing error handling**: Always handle unknown activity types gracefully
6. **Forgetting integration**: Remember to add your calculator to the main service
7. **Outdated documentation**: Keep API docs and README examples current

### Testing Strategy

- **Unit Tests**: Test individual services and utilities in isolation
- **Integration Tests**: Test complete API workflows

## 📁 Project Structure

```
carbon-footprint-calculator/
├── apps/                      # Apps
│   ├── api/                   # Fastify API server
│   └── web/                   # Next.js frontend
├── packages/                  # Shared packages
│   ├── contracts/             # Shared types and validation
│   ├── ui/                    # Shared React components
│   └── routes/                # Route utilities
├── tooling/                   # Development tooling
│   ├── eslint-config/         # Linting configuration
│   ├── prettier-config/       # Code formatting
│   ├── typescript-config/     # TypeScript settings
│   └── vitest-config/         # Testing configuration
└── turbo.json                 # Monorepo build configuration
```

## 📝 License

This project is licensed under the MIT License.

## 🔗 Useful Links

- [Turborepo Documentation](https://turborepo.org/docs)
- [Fastify Documentation](https://www.fastify.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zod Documentation](https://zod.dev/)
- [Vitest Documentation](https://vitest.dev/)
