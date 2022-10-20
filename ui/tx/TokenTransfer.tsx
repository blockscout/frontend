import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer as TTokenTransfer, Erc20TotalPayload, Erc721TotalPayload, Erc1155TotalPayload } from 'types/api/tokenTransfer';

import rightArrowIcon from 'icons/arrows/east.svg';
import { space } from 'lib/html-entities';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TokenSnippet from 'ui/shared/TokenSnippet';
import NftTokenTransferSnippet from 'ui/tx/NftTokenTransferSnippet';

type Props = TTokenTransfer;

const TokenTransfer = ({ token, total, to, from }: Props) => {

  const isColumnLayout = token.type === 'ERC-1155' && Array.isArray(total);
  const tokenSnippet = <TokenSnippet symbol={ token.symbol } hash={ token.address } name={ token.name } ml={ 3 }/>;

  const content = (() => {
    switch (token.type) {
      case 'ERC-20': {
        const payload = total as Erc20TotalPayload;
        return (
          <Flex>
            <Text fontWeight={ 500 } as="span">For:{ space }
              <CurrencyValue value={ payload.value } exchangeRate={ token.exchange_rate } fontWeight={ 600 }/>
            </Text>
            { tokenSnippet }
          </Flex>
        );
      }

      case 'ERC-721': {
        const payload = total as Erc721TotalPayload;
        return (
          <NftTokenTransferSnippet
            tokenId={ payload.token_id }
            value="1"
            hash={ token.address }
            symbol={ token.symbol }
          />
        );
      }

      case 'ERC-1155': {
        const payload = total as Erc1155TotalPayload | Array<Erc1155TotalPayload>;
        const items = Array.isArray(payload) ? payload : [ payload ];
        return items.map((item) => (
          <NftTokenTransferSnippet
            key={ item.token_id }
            tokenId={ item.token_id }
            value={ item.value }
            hash={ token.address }
            symbol={ token.symbol }
          />
        ));
      }
    }
  })();

  return (
    <Flex
      alignItems={ isColumnLayout ? 'flex-start' : 'center' }
      flexWrap="wrap"
      columnGap={ 3 }
      rowGap={ 3 }
      flexDir={ isColumnLayout ? 'column' : 'row' }
    >
      <Flex alignItems="center">
        <AddressLink fontWeight="500" hash={ from.hash } truncation="constant"/>
        <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
        <AddressLink fontWeight="500" hash={ to.hash } truncation="constant"/>
      </Flex>
      <Flex flexDir="column" rowGap={ 5 }>
        { content }
      </Flex>
    </Flex>
  );
};

export default React.memo(TokenTransfer);
