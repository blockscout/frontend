// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Pool } from 'client/features/dex-pools/types/api';

export const getPoolTitle = (pool: Pool) => {
  return `${ pool.base_token_symbol } / ${ pool.quote_token_symbol } ${ pool.fee ? `(${ pool.fee }%)` : '' }`;
};
