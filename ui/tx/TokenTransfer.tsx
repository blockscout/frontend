import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer as TTokenTransfer } from 'types/api/tokenTransfer';

import rightArrowIcon from 'icons/arrows/east.svg';
import { space } from 'lib/html-entities';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TokenSnippet from 'ui/shared/TokenSnippet';
import NftTokenTransferSnippet from 'ui/tx/NftTokenTransferSnippet';

type Props = TTokenTransfer;

const TokenTransfer = (props: Props) => {

  const isColumnLayout = props.token_type === 'ERC-1155' && Array.isArray(props.total);
  const tokenSnippet = <TokenSnippet symbol={ props.token_symbol } hash={ props.token_address } name="Foo" ml={ 3 }/>;

  const content = (() => {
    switch (props.token_type) {
      case 'ERC-20':
        return (
          <Flex>
            <Text fontWeight={ 500 } as="span">For:{ space }
              <CurrencyValue value={ props.total.value } unit="ether" exchangeRate={ props.exchange_rate } fontWeight={ 600 }/>
            </Text>
            { tokenSnippet }
          </Flex>
        );

      case 'ERC-721': {
        return (
          <NftTokenTransferSnippet
            tokenId={ props.total.token_id }
            value="1"
            hash={ props.token_address }
            symbol={ props.token_symbol }
          />
        );
      }

      case 'ERC-1155': {
        const items = Array.isArray(props.total) ? props.total : [ props.total ];
        return items.map((item) => (
          <NftTokenTransferSnippet
            key={ item.token_id }
            tokenId={ item.token_id }
            value={ item.value }
            hash={ props.token_address }
            symbol={ props.token_symbol }
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
        <AddressLink fontWeight="500" hash={ props.from.hash } truncation="constant"/>
        <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
        <AddressLink fontWeight="500" hash={ props.to.hash } truncation="constant"/>
      </Flex>
      <Flex flexDir="column" rowGap={ 5 }>
        { content }
      </Flex>
    </Flex>
  );
};

export default React.memo(TokenTransfer);
