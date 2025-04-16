import { chakra } from '@chakra-ui/react';
import { pickBy } from 'es-toolkit';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { ADVANCED_FILTER_TYPES } from 'types/api/advancedFilter';
import type { TokenType } from 'types/api/token';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isLoading?: boolean;
  address: string;
  typeFilter: Array<TokenType>;
  directionFilter: AddressFromToFilter;
}

const AddressAdvancedFilterLink = ({ isLoading, address, typeFilter, directionFilter }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  if (!config.features.advancedFilter.isEnabled) {
    return null;
  }

  const queryParams = pickBy({
    to_address_hashes_to_include: !directionFilter || directionFilter === 'to' ? [ address ] : undefined,
    from_address_hashes_to_include: !directionFilter || directionFilter === 'from' ? [ address ] : undefined,
    transaction_types: typeFilter.length > 0 ? typeFilter : ADVANCED_FILTER_TYPES.filter((type) => type !== 'coin_transfer'),
  }, (value) => value !== undefined);

  return (
    <Link
      whiteSpace="nowrap"
      href={ route({ pathname: '/advanced-filter', query: queryParams }) }
      flexShrink={ 0 }
      loading={ isInitialLoading }
      minW={ 8 }
      justifyContent="center"
    >
      <IconSvg name="filter" boxSize={ 6 }/>
      <chakra.span ml={ 1 } hideBelow="lg">Advanced filter</chakra.span>
    </Link>
  );
};

export default React.memo(AddressAdvancedFilterLink);
