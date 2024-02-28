import useApiQuery from 'lib/api/useApiQuery';

import { isValidVerificationMethod, sortVerificationMethods } from './utils';

export default function useFormConfigQuery(enabled: boolean) {
  return useApiQuery('contract_verification_config', {
    queryOptions: {
      select: (data) => {
        return {
          ...data,
          verification_options: data.verification_options.filter(isValidVerificationMethod).sort(sortVerificationMethods),
        };
      },
      enabled,
    },
  });
}
