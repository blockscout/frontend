// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'client/slices/token/types/api';

import type { EntityProps as TokenEntityProps } from 'client/slices/token/components/entity/TokenEntity';
import TokenEntity from 'client/slices/token/components/entity/TokenEntity';

import ConfidentialValue from 'ui/shared/value/ConfidentialValue';

interface Props extends Omit<FlexProps, 'children'> {
  token: TokenInfo;
  tokenEntityProps?: Omit<TokenEntityProps, 'token'>;
  loading?: boolean;
}

const ConfidentialTokenValue = ({ token, tokenEntityProps, loading, ...rest }: Props) => {
  return (
    <Flex
      display="inline-flex"
      alignItems="center"
      { ...rest }
    >
      <ConfidentialValue loading={ loading }/>
      <TokenEntity
        token={ token }
        noCopy
        onlySymbol
        flexShrink={ 0 }
        w="fit-content"
        ml={ 2 }
        icon={{ marginRight: 1 }}
        isLoading={ loading }
        { ...tokenEntityProps }
      />
    </Flex>
  );
};

export default React.memo(ConfidentialTokenValue);
