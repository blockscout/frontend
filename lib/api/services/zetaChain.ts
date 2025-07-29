import type { ApiResource } from '../types';
import type { ZetaChainCCTXListResponse, ZetaChainCCTXResponse } from 'types/api/zetaChain';

export const ZETA_CHAIN_API_RESOURCES = {
  transactions: {
    path: '/api/v1/CctxInfo\\:list',
    filterFields: [ 'limit' as const, 'offset' as const, 'status' as const ],
    paginated: true,
  },
  transaction: {
    path: '/api/v1/CctxInfo\\:get',
    filterFields: [ 'cctx_id' as const ],
  },
} satisfies Record<string, ApiResource>;

export type ZetaChainApiResourceName = `zetachain:${ keyof typeof ZETA_CHAIN_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type ZetaChainApiResourcePayload<R extends ZetaChainApiResourceName> =
R extends 'zetachain:transactions' ? ZetaChainCCTXListResponse :
R extends 'zetachain:transaction' ? ZetaChainCCTXResponse :
never;
/* eslint-enable @stylistic/indent */
