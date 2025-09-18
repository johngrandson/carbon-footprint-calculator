import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn
} from 'react-hook-form';
import type { z } from 'zod';

export function useZodForm<TSchema extends z.ZodTypeAny>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  }
): UseFormReturn<TSchema['_input'], unknown, TSchema['_input']> {
  return useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
      raw: true
    })
  });
}

export {
  FormProvider,
  UseFormReturn,
  useFormContext,
  type FieldPath,
  type FieldValues
};

// Re-export zod for web app to use
export { z } from 'zod';
