// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressFormat } from 'client/slices/address/types/config';
import type { ClusterChainConfig } from 'types/multichain';

export interface ItemsProps<Data> {
  data: Data;
  searchTerm: string;
  isMobile?: boolean | undefined;
  addressFormat?: AddressFormat;
  chainInfo?: ClusterChainConfig;
}
