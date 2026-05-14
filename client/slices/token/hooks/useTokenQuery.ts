// SPDX-License-Identifier: LicenseRef-Blockscout

import useApiQuery from 'client/api/hooks/useApiQuery';

import { TOKEN_INFO_ERC_20 } from 'client/slices/token/stubs';

import { useAppContext } from 'lib/contexts/app';

export default function useTokenQuery(hash: string) {
  const { apiData } = useAppContext<'/token/[hash]'>();

  return useApiQuery('general:token', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: TOKEN_INFO_ERC_20,
      initialData: apiData || undefined,
    },
  });
}
