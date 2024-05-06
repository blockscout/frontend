import { Flex } from '@chakra-ui/react';
import React from 'react';

import type {
  TokenTransfer as TTokenTransfer,
  Erc20TotalPayload,
  Erc721TotalPayload,
  Erc1155TotalPayload,
  Erc404TotalPayload,
} from 'types/api/tokenTransfer';

import AddressFromTo from 'ui/shared/address/AddressFromTo';
import NftTokenTransferSnippet from 'ui/tx/NftTokenTransferSnippet';

import FtTokenTransferSnippet from '../FtTokenTransferSnippet';

interface Props {
  data: TTokenTransfer;
}

const TxDetailsTokenTransfer = ({ data }: Props) => {

  const content = (() => {
    switch (data.token.type) {
      case 'ERC-20': {
        const total = data.total as Erc20TotalPayload;
        return <FtTokenTransferSnippet token={ data.token } value={ total.value } decimals={ total.decimals }/>;
      }

      case 'ERC-721': {
        const total = data.total as Erc721TotalPayload;
        return (
          <NftTokenTransferSnippet
            token={ data.token }
            tokenId={ total.token_id }
            value="1"
          />
        );
      }

      case 'ERC-1155': {
        const total = data.total as Erc1155TotalPayload;
        return (
          <NftTokenTransferSnippet
            key={ total.token_id }
            token={ data.token }
            tokenId={ total.token_id }
            value={ total.value }
          />
        );
      }

      case 'ERC-404': {
        const total = data.total as Erc404TotalPayload;

        if (total.token_id !== null) {
          return (
            <NftTokenTransferSnippet
              token={ data.token }
              tokenId={ total.token_id }
              value="1"
            />
          );
        } else {
          if (total.value === null) {
            return null;
          }

          return <FtTokenTransferSnippet token={ data.token } value={ total.value } decimals={ total.decimals }/>;
        }
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
        noIcon
        fontWeight="500"
      />
      { content }
    </Flex>
  );
};

export default React.memo(TxDetailsTokenTransfer);
