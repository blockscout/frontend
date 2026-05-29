// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressTokenBalance } from 'src/slices/address/types/api';

export type AddressTokensErc20Item = Pick<AddressTokenBalance, 'token' | 'value'> & {
  chain_values?: Record<string, string | null>;
};
