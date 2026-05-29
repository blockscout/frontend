// SPDX-License-Identifier: LicenseRef-Blockscout

import { pickBy } from 'es-toolkit';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { AddressFromToFilter } from 'src/slices/address/types/api';
import type { TokenType } from 'src/slices/token/types/api';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import useIsInitialLoading from 'src/shared/hooks/useIsInitialLoading';

import { getAdvancedFilterTypes } from '../utils/lib';
import AdvancedFilterLink from './AdvancedFilterLink';

interface Props {
  isLoading?: boolean;
  address: string;
  typeFilter: Array<TokenType>;
  directionFilter: AddressFromToFilter;
  chainData?: ClusterChainConfig;
}

const AddressAdvancedFilterLink = ({ isLoading, address, typeFilter, directionFilter, chainData }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);
  const multichainContext = useMultichainContext();

  const chainConfig = chainData?.app_config || multichainContext?.chain.app_config || config;

  if (!chainConfig?.features?.advancedFilter.isEnabled) {
    return null;
  }

  const advancedFilterTypes = getAdvancedFilterTypes(chainConfig);

  const queryParams = pickBy({
    to_address_hashes_to_include: !directionFilter || directionFilter === 'to' ? [ address ] : undefined,
    from_address_hashes_to_include: !directionFilter || directionFilter === 'from' ? [ address ] : undefined,
    transaction_types: typeFilter.length > 0 ?
      typeFilter :
      advancedFilterTypes.filter((type) => type.id !== 'coin_transfer').map((type) => type.id),
  }, (value) => value !== undefined);

  const routeParams = (chainData ? { chain: chainData } : undefined) ?? multichainContext;

  return (
    <AdvancedFilterLink
      query={ queryParams }
      routeParams={ routeParams || undefined }
      loading={ isInitialLoading }
    />
  );
};

export default React.memo(AddressAdvancedFilterLink);
