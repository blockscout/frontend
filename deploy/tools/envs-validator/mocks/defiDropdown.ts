// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DeFiDropdownButtonText, DeFiDropdownItem } from 'src/features/defi-dropdown/types/client';

export const deFiDropdownItems: Array<DeFiDropdownItem> = [
  { text: 'Swap', icon: 'swap', dappId: 'uniswap' },
  { text: 'Payment link', icon: 'payment_link', url: 'https://example.com' },
];

export const deFiDropdownButtonText: DeFiDropdownButtonText = { desktop: 'Blockscout DeFi', mobile: 'DeFi' };
