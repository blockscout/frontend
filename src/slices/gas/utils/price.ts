// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export default function discriminateDetailedPrices(prices?: schemas['StatsResponse']['gas_prices']): schemas['StatsGasPricesDetailed'] | undefined {
  if (prices && typeof prices.average !== 'number') {
    return prices as schemas['StatsGasPricesDetailed'];
  }
}
