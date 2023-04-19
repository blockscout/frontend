import type { ArrayElement } from 'types/utils';

import type { SUPPORTED_WALLETS } from 'lib/web3/wallets';

export type WalletType = ArrayElement<typeof SUPPORTED_WALLETS>;
