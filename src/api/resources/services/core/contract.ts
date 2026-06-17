// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { merged } from '@blockscout/api-types';
import type {
  SmartContract,
  SmartContractVerificationConfigRaw,
  VerifiedContractsFilters,
  VerifiedContractsSorting,
} from 'src/slices/contract/types/api';

export const CORE_API_CONTRACT_RESOURCES = {
  contract: {
    path: '/api/v2/smart-contracts/:hash',
    pathParams: [ 'hash' as const ],
  },
  contract_verification_config: {
    path: '/api/v2/smart-contracts/verification/config',
  },
  contract_verification_via: {
    path: '/api/v2/smart-contracts/:hash/verification/via/:method',
    pathParams: [ 'hash' as const, 'method' as const ],
  },
  contract_solidity_scan_report: {
    path: '/api/v2/proxy/3rdparty/solidityscan/smart-contracts/:hash/report',
    pathParams: [ 'hash' as const ],
  },
  contract_security_audits: {
    path: '/api/v2/smart-contracts/:hash/audit-reports',
    pathParams: [ 'hash' as const ],
  },
  verified_contracts: {
    path: '/api/v2/smart-contracts',
    filterFields: [ 'q' as const, 'filter' as const ],
    paginated: true,
  },
  verified_contracts_counters: {
    path: '/api/v2/smart-contracts/counters',
  },
} satisfies Record<string, ApiResource>;

export type CoreApiContractResourceName = `core:${ keyof typeof CORE_API_CONTRACT_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiContractResourcePayload<R extends CoreApiContractResourceName> =
R extends 'core:contract' ? SmartContract :
R extends 'core:contract_solidity_scan_report' ? unknown :
R extends 'core:verified_contracts' ? merged.paths['/v2/smart-contracts/']['get']['responses']['200']['content']['application/json'] :
R extends 'core:verified_contracts_counters' ? merged.paths['/v2/smart-contracts/counters']['get']['responses']['200']['content']['application/json'] :
R extends 'core:contract_verification_config' ? SmartContractVerificationConfigRaw :
R extends 'core:contract_security_audits' ?
  merged.paths['/v2/smart-contracts/{address_hash_param}/audit-reports']['get']['responses']['200']['content']['application/json'] :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiContractPaginationFilters<R extends CoreApiContractResourceName> =
R extends 'core:verified_contracts' ? VerifiedContractsFilters :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type CoreApiContractPaginationSorting<R extends CoreApiContractResourceName> =
R extends 'core:verified_contracts' ? VerifiedContractsSorting :
never;
/* eslint-enable @stylistic/indent */
