import { Flex } from '@chakra-ui/react';
import React from 'react';

import type {
  TokenTransfer,
  Erc20TotalPayload,
  Erc721TotalPayload,
  Erc1155TotalPayload,
  Erc404TotalPayload,
} from 'types/api/tokenTransfer';

import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressFromTo from 'ui/shared/address/AddressFromTo';

import TokenTransferSnippetFiat from './TokenTransferSnippetFiat';
import TokenTransferSnippetNft from './TokenTransferSnippetNft';

interface Props {
  data: TokenTransfer;
  noAddressIcons?: boolean;
  isLoading?: boolean;
}

const TokenTransferSnippet = ({ data, isLoading, noAddressIcons = true }: Props) => {

  const content = (() => {

    if (isLoading) {
      return <Skeleton loading w="250px" h={ 6 }/>;
    }

    switch (data.token?.type) {
      case 'ERC-20': {
        const total = data.total as Erc20TotalPayload | null;
        if (total === null || total.value === null) {
          return null;
        }
        return <TokenTransferSnippetFiat token={ data.token } value={ total.value } decimals={ total.decimals }/>;
      }

      case 'ERC-721': {
        const total = data.total as Erc721TotalPayload;
        return (
          <TokenTransferSnippetNft
            token={ data.token }
            tokenId={ total.token_id }
            instance={ total.token_instance }
            value="1"
          />
        );
      }

      case 'ERC-1155': {
        const total = data.total as Erc1155TotalPayload;
        return (
          <TokenTransferSnippetNft
            key={ total.token_id }
            token={ data.token }
            tokenId={ total.token_id }
            instance={ total.token_instance }
            value={ total.value }
          />
        );
      }

      case 'ERC-404': {
        const total = data.total as Erc404TotalPayload | null;
        if (total === null) {
          return null;
        }

        if (total.token_id !== null) {
          return (
            <TokenTransferSnippetNft
              token={ data.token }
              tokenId={ total.token_id }
              value="1"
            />
          );
        } else {
          if (total.value === null) {
            return null;
          }

          return <TokenTransferSnippetFiat token={ data.token } value={ total.value } decimals={ total.decimals }/>;
        }
      }
      default: {
        return null;
      }
    }
  })();

  return (
    <Flex
      alignItems="flex-start"
      flexWrap="wrap"
      columnGap={ 2 }
      rowGap={ 3 }
      flexDir="row"
      w="100%"
      fontWeight={ 500 }
    >
      <AddressFromTo
        from={ data.from }
        to={ data.to }
        truncation="constant"
        noIcon={ noAddressIcons }
        fontWeight="500"
        isLoading={ isLoading }
      />
      { content }
    </Flex>
  );
};

export default React.memo(TokenTransferSnippet);
