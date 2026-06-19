// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';

import type { CoreApiAccountResourceName, CoreApiAccountResourcePayload } from './account';
import { CORE_API_ACCOUNT_RESOURCES } from './account';
import type {
  CoreApiAddressPaginationFilters,
  CoreApiAddressPaginationSorting,
  CoreApiAddressResourceName,
  CoreApiAddressResourcePayload,
} from './address';
import { CORE_API_ADDRESS_RESOURCES } from './address';
import type {
  CoreApiBlockPaginationFilters,
  CoreApiBlockResourceName, CoreApiBlockResourcePayload } from './block';
import { CORE_API_BLOCK_RESOURCES } from './block';
import { CORE_API_CONTRACT_RESOURCES } from './contract';
import type {
  CoreApiContractPaginationFilters,
  CoreApiContractPaginationSorting,
  CoreApiContractResourceName,
  CoreApiContractResourcePayload,
} from './contract';
import type {
  CoreApiMiscPaginationFilters,
  CoreApiMiscPaginationSorting,
  CoreApiMiscResourceName,
  CoreApiMiscResourcePayload,
} from './misc';
import { CORE_API_MISC_RESOURCES } from './misc';
import type {
  CoreApiRollupPaginationFilters,
  CoreApiRollupPaginationSorting,
  CoreApiRollupResourceName,
  CoreApiRollupResourcePayload,
} from './rollup';
import { CORE_API_ROLLUP_RESOURCES } from './rollup';
import type {
  CoreApiTokenPaginationFilters,
  CoreApiTokenPaginationSorting,
  CoreApiTokenResourceName,
  CoreApiTokenResourcePayload,
} from './token';
import { CORE_API_TOKEN_RESOURCES } from './token';
import type { CoreApiTxResourceName, CoreApiTxResourcePayload, CoreApiTxPaginationFilters } from './tx';
import { CORE_API_TX_RESOURCES } from './tx';
import type { CoreApiV1ResourceName, CoreApiV1ResourcePayload } from './v1';
import { CORE_API_V1_RESOURCES } from './v1';

export const CORE_API_RESOURCES = {
  ...CORE_API_ACCOUNT_RESOURCES,
  ...CORE_API_ADDRESS_RESOURCES,
  ...CORE_API_BLOCK_RESOURCES,
  ...CORE_API_CONTRACT_RESOURCES,
  ...CORE_API_MISC_RESOURCES,
  ...CORE_API_ROLLUP_RESOURCES,
  ...CORE_API_TOKEN_RESOURCES,
  ...CORE_API_TX_RESOURCES,
  ...CORE_API_V1_RESOURCES,
} satisfies Record<string, ApiResource>;

export type CoreApiResourceName = `core:${ keyof typeof CORE_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiResourcePayload<R extends CoreApiResourceName> =
R extends CoreApiAccountResourceName ? CoreApiAccountResourcePayload<R> :
R extends CoreApiAddressResourceName ? CoreApiAddressResourcePayload<R> :
R extends CoreApiBlockResourceName ? CoreApiBlockResourcePayload<R> :
R extends CoreApiContractResourceName ? CoreApiContractResourcePayload<R> :
R extends CoreApiMiscResourceName ? CoreApiMiscResourcePayload<R> :
R extends CoreApiRollupResourceName ? CoreApiRollupResourcePayload<R> :
R extends CoreApiTokenResourceName ? CoreApiTokenResourcePayload<R> :
R extends CoreApiTxResourceName ? CoreApiTxResourcePayload<R> :
R extends CoreApiV1ResourceName ? CoreApiV1ResourcePayload<R> :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiPaginationFilters<R extends CoreApiResourceName> =
R extends CoreApiAddressResourceName ? CoreApiAddressPaginationFilters<R> :
R extends CoreApiBlockResourceName ? CoreApiBlockPaginationFilters<R> :
R extends CoreApiContractResourceName ? CoreApiContractPaginationFilters<R> :
R extends CoreApiMiscResourceName ? CoreApiMiscPaginationFilters<R> :
R extends CoreApiRollupResourceName ? CoreApiRollupPaginationFilters :
R extends CoreApiTokenResourceName ? CoreApiTokenPaginationFilters<R> :
R extends CoreApiTxResourceName ? CoreApiTxPaginationFilters<R> :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiPaginationSorting<R extends CoreApiResourceName> =
R extends CoreApiAddressResourceName ? CoreApiAddressPaginationSorting<R> :
R extends CoreApiContractResourceName ? CoreApiContractPaginationSorting<R> :
R extends CoreApiMiscResourceName ? CoreApiMiscPaginationSorting<R> :
R extends CoreApiRollupResourceName ? CoreApiRollupPaginationSorting :
R extends CoreApiTokenResourceName ? CoreApiTokenPaginationSorting<R> :
never;
/* eslint-enable @stylistic/indent */
