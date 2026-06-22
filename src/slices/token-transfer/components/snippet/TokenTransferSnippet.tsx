// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';

import ConfidentialTokenValue from 'src/shared/values/entity/ConfidentialTokenValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TokenTransferSnippetFiat from './TokenTransferSnippetFiat';
import TokenTransferSnippetNft from './TokenTransferSnippetNft';

interface Props {
  data: schemas['TokenTransfer'];
  noAddressIcons?: boolean;
  isLoading?: boolean;
}

const TokenTransferSnippet = ({ data, isLoading, noAddressIcons = true }: Props) => {

  const content = (() => {

    if (isLoading) {
      return <Skeleton loading w="250px" h={ 6 }/>;
    }

    if (data.token && isConfidentialTokenType(data.token.type)) {
      return <ConfidentialTokenValue token={ data.token } loading={ false }/>;
    }

    switch (data.token?.type) {
      case 'ERC-20': {
        const total = data.total as schemas['Total'] | null;
        if (total === null || total.value === null) {
          return null;
        }
        return <TokenTransferSnippetFiat token={ data.token } value={ total.value } decimals={ total.decimals }/>;
      }

      case 'ERC-721': {
        if (data.total && 'token_id' in data.total && 'token_instance' in data.total) {
          return (
            <TokenTransferSnippetNft
              token={ data.token }
              tokenId={ data.total.token_id }
              instance={ data.total.token_instance }
              value="1"
            />
          );
        }
        return null;
      }

      case 'ERC-1155': {
        if (data.total && 'token_id' in data.total && 'token_instance' in data.total && 'value' in data.total) {
          return (
            <TokenTransferSnippetNft
              token={ data.token }
              tokenId={ data.total.token_id }
              instance={ data.total.token_instance }
              value={ data.total.value || '1' }
            />
          );
        }
        return null;
      }

      case 'ERC-404': {
        if (data.total === null) {
          return null;
        }

        if ('token_id' in data.total && data.total.token_id !== null) {
          return (
            <TokenTransferSnippetNft
              token={ data.token }
              tokenId={ data.total.token_id }
              value="1"
            />
          );
        } else {
          if ('value' in data.total && data.total.value) {
            return <TokenTransferSnippetFiat token={ data.token } value={ data.total.value } decimals={ data.total.decimals }/>;
          }
          return null;
        }
      }

      default: {
        return null;
      }
    }
  })();

  return (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      columnGap={ 2 }
      rowGap={ 0 }
      flexDir="row"
      w="100%"
    >
      <AddressFromTo
        from={ data.from }
        to={ data.to }
        truncation="constant"
        noIcon={ noAddressIcons }
        isLoading={ isLoading }
        lineHeight={{ lg: '24px' }}
      />
      { content }
    </Flex>
  );
};

export default React.memo(TokenTransferSnippet);
