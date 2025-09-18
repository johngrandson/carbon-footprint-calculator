import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@workspace/ui/lib/utils';

const listItemVariants = cva(
  "flex justify-between items-center",
  {
    variants: {
      variant: {
        default: "py-2 border-b border-gray-100 dark:border-gray-700 last:border-0",
        simple: "py-1",
        spacious: "py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
      },
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const listItemLabelVariants = cva(
  "capitalize",
  {
    variants: {
      weight: {
        default: "text-gray-700 dark:text-gray-300",
        medium: "font-medium text-gray-800 dark:text-gray-200",
        semibold: "font-semibold text-gray-900 dark:text-gray-100"
      }
    },
    defaultVariants: {
      weight: "default"
    }
  }
);

const listItemValueVariants = cva(
  "",
  {
    variants: {
      weight: {
        default: "font-medium text-gray-900 dark:text-white",
        normal: "text-gray-800 dark:text-gray-200",
        bold: "font-bold text-gray-900 dark:text-white"
      }
    },
    defaultVariants: {
      weight: "default"
    }
  }
);

export interface ListItemProps extends VariantProps<typeof listItemVariants> {
  label: string;
  value: string | number;
  className?: string;
  labelWeight?: VariantProps<typeof listItemLabelVariants>['weight'];
  valueWeight?: VariantProps<typeof listItemValueVariants>['weight'];
  icon?: React.ReactNode;
}

export function ListItem({
  label,
  value,
  variant,
  size,
  className,
  labelWeight,
  valueWeight,
  icon
}: ListItemProps) {
  return (
    <div className={cn(listItemVariants({ variant, size }), className)}>
      <div className="flex items-center space-x-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className={cn(listItemLabelVariants({ weight: labelWeight }))}>
          {label}
        </span>
      </div>
      <span className={cn(listItemValueVariants({ weight: valueWeight }))}>
        {value}
      </span>
    </div>
  );
}