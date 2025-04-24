import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '@radix-ui/react-label';
import { Field, ErrorMessage, FieldProps } from 'formik';

export const FormField = ({
  name,
  label,
  placeholder,
  testId,
  errorTestId,
}: {
  name: string;
  label: string;
  placeholder: string;
  testId: string;
  errorTestId: string;
}) => (
  <div>
    <Label
      htmlFor={name}
      className='block mb-1 text-sm font-medium'>
      {label}
    </Label>
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <Input
          {...field}
          id={name}
          data-testid={testId}
          placeholder={placeholder}
          className={cn(
            'w-full border-2 focus-visible:outline-none focus-visible:border-gray-800',
            meta.touched && meta.error ? 'border-red-500' : ''
          )}
        />
      )}
    </Field>
    <ErrorMessage name={name}>
      {(msg) => (
        <p
          className='text-red-600 text-sm mt-1'
          data-testid={errorTestId}>
          {msg}
        </p>
      )}
    </ErrorMessage>
  </div>
);
