import { pickBy } from 'es-toolkit';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { ADVANCED_FILTER_TYPES } from 'types/api/advancedFilter';
import type { TokenType } from 'types/api/token';
import type { ChainConfig } from 'types/multichain';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import AdvancedFilterLink from 'ui/shared/links/AdvancedFilterLink';

interface Props {
  isLoading?: boolean;
  address: string;
  typeFilter: Array<TokenType>;
  directionFilter: AddressFromToFilter;
  chainData?: ChainConfig;
}

const AddressAdvancedFilterLink = ({ isLoading, address, typeFilter, directionFilter, chainData }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);
  const multichainContext = useMultichainContext();

  const chainConfig = chainData?.config || multichainContext?.chain.config || config;

  if (!chainConfig.features.advancedFilter.isEnabled) {
    return null;
  }

  const queryParams = pickBy({
    to_address_hashes_to_include: !directionFilter || directionFilter === 'to' ? [ address ] : undefined,
    from_address_hashes_to_include: !directionFilter || directionFilter === 'from' ? [ address ] : undefined,
    transaction_types: typeFilter.length > 0 ? typeFilter : ADVANCED_FILTER_TYPES.filter((type) => type !== 'coin_transfer'),
  }, (value) => value !== undefined);

  const linkContext = (chainData ? { chain: chainData } : undefined) ?? multichainContext;

  return (
    <AdvancedFilterLink
      query={ queryParams }
      linkContext={ linkContext }
      loading={ isInitialLoading }
    />
  );
};

export default React.memo(AddressAdvancedFilterLink);
