import type { ApiResource } from '../types';
import type { ZetaChainCCTXListResponse } from 'types/api/zetaChain';

export const ZETA_CHAIN_API_RESOURCES = {
  transactions: {
    path: '/api/v1/CctxInfo\\:list',
    filterFields: [ 'limit' as const, 'offset' as const, 'status' as const ],
  },
} satisfies Record<string, ApiResource>;

export type ZetaChainApiResourceName = `zetachain:${ keyof typeof ZETA_CHAIN_API_RESOURCES }`;

export type ZetaChainApiResourcePayload<R extends ZetaChainApiResourceName> =
R extends 'zetachain:transactions' ? ZetaChainCCTXListResponse :
  never;
