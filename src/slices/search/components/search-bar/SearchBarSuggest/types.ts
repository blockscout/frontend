// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { AddressFormat } from 'src/slices/address/types/config';

export interface ItemsProps<Data> {
  data: Data;
  searchTerm: string;
  isMobile?: boolean | undefined;
  addressFormat?: AddressFormat;
  chainInfo?: ClusterChainConfig;
}
