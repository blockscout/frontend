// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { getTokenHoldersStub } from 'src/slices/token/stubs';

import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';

interface Params {
  token: schemas['Token'] | undefined;
  tokenId: string | undefined;
  enabled: boolean;
}

export const useTokenHoldersQuery = ({ token, tokenId, enabled }: Params) => {
  return useApiPaginatedQuery({
    resourceName: tokenId ? 'core:token_instance_holders' : 'core:token_holders',
    pathParams: { hash: token?.address_hash, id: tokenId },
    options: {
      enabled: Boolean(token?.address_hash) && enabled,
      placeholderData: getTokenHoldersStub(token?.type, null),
    },
  });
};

export type TokenHoldersQuery = ReturnType<typeof useTokenHoldersQuery>;
