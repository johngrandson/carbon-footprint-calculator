import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@workspace/ui/lib/utils';

const statVariants = cva(
  "text-center",
  {
    variants: {
      size: {
        default: "space-y-1",
        sm: "space-y-0.5",
        lg: "space-y-2"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

const statValueVariants = cva(
  "font-bold",
  {
    variants: {
      size: {
        default: "text-2xl",
        sm: "text-lg",
        lg: "text-3xl"
      },
      variant: {
        default: "text-gray-900 dark:text-white",
        muted: "text-gray-700 dark:text-gray-200",
        light: "text-gray-600 dark:text-gray-300"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
);

const statLabelVariants = cva(
  "text-gray-500 dark:text-gray-400",
  {
    variants: {
      size: {
        default: "text-xs",
        sm: "text-xs",
        lg: "text-sm"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

export interface StatProps extends VariantProps<typeof statVariants>, VariantProps<typeof statValueVariants> {
  value: number | string;
  label: string;
  className?: string;
  precision?: number;
}

export function Stat({
  value,
  label,
  size,
  variant,
  className,
  precision = 1
}: StatProps) {
  const displayValue = typeof value === 'number' ? value.toFixed(precision) : value;

  return (
    <div className={cn(statVariants({ size }), className)}>
      <div className={cn(statValueVariants({ size, variant }))}>
        {displayValue}
      </div>
      <div className={cn(statLabelVariants({ size }))}>
        {label}
      </div>
    </div>
  );
}