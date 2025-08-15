import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends LinkProps {
  isLoading?: boolean;
  token?: TokenInfo;
}

const TokenAdvancedFilterLink = ({ isLoading, token, ...rest }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);
  const multichainContext = useMultichainContext();

  if (!token || !config.features.advancedFilter.isEnabled) {
    return null;
  }

  const queryParams = {
    token_contract_address_hashes_to_include: [ token.address_hash ],
  };

  return (
    <Link
      whiteSpace="nowrap"
      href={ route({ pathname: '/advanced-filter', query: queryParams }, multichainContext) }
      flexShrink={ 0 }
      loading={ isInitialLoading }
      minW={ 8 }
      justifyContent="center"
      { ...rest }
    >
      <IconSvg name="filter" boxSize={ 6 }/>
      <chakra.span ml={ 1 } hideBelow="lg">Advanced filter</chakra.span>
    </Link>
  );
};

export default React.memo(TokenAdvancedFilterLink);
