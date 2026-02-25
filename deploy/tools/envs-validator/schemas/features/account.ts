import { AuthProvider } from 'types/client/account';
import * as yup from 'yup';

export const accountSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: yup.boolean(),
    NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: yup
      .string<AuthProvider>()
      .when('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
        is: (value: boolean) => value === true,
        then: (schema) => schema.oneOf([ 'auth0', 'dynamic' ]),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER cannot not be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is not defined'),
      }),
    NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID: yup
      .string()
      .when('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER', {
        is: (value: AuthProvider) => value === 'dynamic',
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID can only be used if NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER is set to \'dynamic\' '),
      }),
  });