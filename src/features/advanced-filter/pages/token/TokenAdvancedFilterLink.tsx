// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenInfo } from 'src/slices/token/types/api';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import useIsInitialLoading from 'src/shared/hooks/useIsInitialLoading';

import type { LinkProps } from 'src/toolkit/chakra/link';

import AdvancedFilterLink from '../../components/AdvancedFilterLink';

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
    <AdvancedFilterLink
      query={ queryParams }
      routeParams={{ chain: multichainContext?.chain }}
      loading={ isInitialLoading }
      { ...rest }
    />
  );
};

export default React.memo(TokenAdvancedFilterLink);
