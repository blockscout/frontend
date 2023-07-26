/* eslint-disable no-console */
import type { ZodError } from 'zod-validation-error';
import { fromZodError } from 'zod-validation-error';

import { nextPublicEnvsSchema } from './schema';

try {
  const appEnvs = Object.entries(process.env)
    .filter(([ key ]) => key.startsWith('NEXT_PUBLIC_'))
    .reduce((result, [ key, value ]) => {
      result[key] = value || '';
      return result;
    }, {} as Record<string, string>);

  console.log(`⏳ Validating environment variables schema...`);
  nextPublicEnvsSchema.parse(appEnvs);
  console.log('👍 All good!\n');
} catch (error) {
  const validationError = fromZodError(
    error as ZodError,
    {
      prefix: '',
      prefixSeparator: '\n  ',
      issueSeparator: ';\n  ',
    },
  );
  console.log(validationError);
  console.log('🚨 ENV set is invalid\n');
  process.exit(1);
}
