import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer as TTokenTransfer, Erc20TotalPayload, Erc721TotalPayload, Erc1155TotalPayload } from 'types/api/tokenTransfer';

import rightArrowIcon from 'icons/arrows/east.svg';
import { space } from 'lib/html-entities';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';
import NftTokenTransferSnippet from 'ui/tx/NftTokenTransferSnippet';

interface Props {
  data: TTokenTransfer;
}

const TxDetailsTokenTransfer = ({ data }: Props) => {

  const content = (() => {
    switch (data.token.type) {
      case 'ERC-20': {
        const total = data.total as Erc20TotalPayload;
        return (
          <Flex flexWrap="wrap" columnGap={ 3 } rowGap={ 2 }>
            <Text fontWeight={ 500 } as="span">For:{ space }
              <CurrencyValue value={ total.value } exchangeRate={ data.token.exchange_rate } fontWeight={ 600 } decimals={ total.decimals }/>
            </Text>
            <TokenSnippet
              data={ data.token }
              w="auto"
              flexGrow="1"
              columnGap={ 1 }
              logoSize={ 5 }
            />
          </Flex>
        );
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
    }
  })();

  return (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      columnGap={ 3 }
      rowGap={ 3 }
      flexDir="row"
    >
      <Flex alignItems="center">
        <AddressLink type="address" fontWeight="500" hash={ data.from.hash } truncation="constant"/>
        <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
        <AddressLink type="address" fontWeight="500" hash={ data.to.hash } truncation="constant"/>
      </Flex>
      <Flex flexDir="column" rowGap={ 5 }>
        { content }
      </Flex>
    </Flex>
  );
};

export default React.memo(TxDetailsTokenTransfer);
