// SPDX-License-Identifier: LicenseRef-Blockscout

import useApiQuery from 'src/api/hooks/useApiQuery';

import { useAppContext } from 'src/shell/app/context';

import { TOKEN_INFO_ERC_20 } from 'src/slices/token/stubs';

export default function useTokenQuery(hash: string) {
  const { apiData } = useAppContext<'/token/[hash]'>();

  return useApiQuery('core:token', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: TOKEN_INFO_ERC_20,
      initialData: apiData || undefined,
    },
  });
}
