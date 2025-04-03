import type { FieldError } from 'react-hook-form';

export default function getFieldErrorText(error: FieldError | undefined) {
  if (!error?.message && error?.type === 'pattern') {
    return 'Invalid format';
  }

  return error?.message;
}
