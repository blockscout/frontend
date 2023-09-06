import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer as TTokenTransfer, Erc20TotalPayload, Erc721TotalPayload, Erc1155TotalPayload } from 'types/api/tokenTransfer';

import rightArrowIcon from 'icons/arrows/east.svg';
import { space } from 'lib/html-entities';
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
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
            <TokenEntity
              token={ data.token }
              noCopy
              w="auto"
              flexGrow="1"
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
      alignItems="flex-start"
      flexWrap={{ base: 'wrap', lg: 'nowrap' }}
      columnGap={ 3 }
      rowGap={ 3 }
      flexDir="row"
      w="100%"
    >
      <Flex alignItems="center" fontWeight="500">
        <AddressEntity address={ data.from } truncation="constant" noIcon maxW="150px"/>
        <Icon as={ rightArrowIcon } boxSize={ 5 } mx={ 2 } color="gray.500"/>
        <AddressEntity address={ data.to } truncation="constant" noIcon maxW="150px"/>
      </Flex>
      <Flex flexDir="column" rowGap={ 5 } w="100%" overflow="hidden">
        { content }
      </Flex>
    </Flex>
  );
};

export default React.memo(TxDetailsTokenTransfer);
