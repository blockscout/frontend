// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as contractsInfo from '@blockscout/contracts-info-types';

export const getPoolTitle = (pool: contractsInfo.Pool) => {
  return `${ pool.base_token_symbol } / ${ pool.quote_token_symbol } ${ pool.fee ? `(${ pool.fee }%)` : '' }`;
};
