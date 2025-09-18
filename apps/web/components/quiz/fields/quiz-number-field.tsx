import React from 'react';
import { useFormContext, type FieldPath, type FieldValues } from '@workspace/ui/hooks/use-zod-form';
import { Input, Label } from '@workspace/ui';

export interface QuizNumberFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function QuizNumberField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  placeholder,
  min,
  max,
  step = 1,
  required,
  disabled,
  className,
}: QuizNumberFieldProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <Input
        {...register(name, {
          valueAsNumber: true,
          required: required ? 'This field is required' : false,
          min: min !== undefined ? {
            value: min,
            message: `Value must be at least ${min}`,
          } : undefined,
          max: max !== undefined ? {
            value: max,
            message: `Value must be at most ${max}`,
          } : undefined,
        })}
        id={name}
        type="number"
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />

      {errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}