import { chakra } from '@chakra-ui/react';
import { pickBy } from 'es-toolkit';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { ADVANCED_FILTER_TYPES } from 'types/api/advancedFilter';
import type { TokenType } from 'types/api/token';
import type { ChainConfig } from 'types/multichain';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

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
    <Link
      whiteSpace="nowrap"
      href={ route({ pathname: '/advanced-filter', query: queryParams }, linkContext) }
      flexShrink={ 0 }
      loading={ isInitialLoading }
      minW={ 8 }
      justifyContent="center"
      textStyle="sm"
    >
      <IconSvg name="filter" boxSize={ 6 }/>
      <chakra.span ml={ 1 } hideBelow="lg">Advanced filter</chakra.span>
    </Link>
  );
};

export default React.memo(AddressAdvancedFilterLink);
