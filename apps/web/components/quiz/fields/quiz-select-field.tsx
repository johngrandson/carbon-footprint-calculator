import React from 'react';
import { useFormContext, type FieldPath, type FieldValues } from '@workspace/ui/hooks/use-zod-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label
} from '@workspace/ui';

export interface QuizSelectFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function QuizSelectField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  options,
  placeholder = 'Select an option...',
  required,
  disabled,
  className,
}: QuizSelectFieldProps<TFieldValues>) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  const value = watch(name) as string;

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

      <Select
        value={value || ''}
        onValueChange={(newValue: string) => setValue(name, newValue as never)}
        disabled={disabled}
      >
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}