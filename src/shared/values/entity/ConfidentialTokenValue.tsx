// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { EntityProps as TokenEntityProps } from 'src/slices/token/components/entity/TokenEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';

interface Props extends Omit<FlexProps, 'children'> {
  token: schemas['Token'];
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
