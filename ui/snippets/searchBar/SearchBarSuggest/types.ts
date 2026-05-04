import type { ClusterChainConfig } from 'types/multichain';
import type { AddressFormat } from 'client/slices/address/types/view';

export interface ItemsProps<Data> {
  data: Data;
  searchTerm: string;
  isMobile?: boolean | undefined;
  addressFormat?: AddressFormat;
  chainInfo?: ClusterChainConfig;
}
