/* eslint-disable no-console */
import type { ZodError } from 'zod-validation-error';
import { fromZodError } from 'zod-validation-error';

import { nextPublicEnvsSchema } from './schema';

try {
  console.log(`⏳ Checking environment variables...`);
  nextPublicEnvsSchema.parse({
    NEXT_PUBLIC_NETWORK_NAME: process.env.NEXT_PUBLIC_NETWORK_NAME,
    NEXT_PUBLIC_APP_PROTOCOL: process.env.NEXT_PUBLIC_APP_PROTOCOL,
    NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: process.env.NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  });
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
  console.log('🚨 File is invalid\n');
  process.exit(1);
}
