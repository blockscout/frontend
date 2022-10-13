import { Flex, Icon, Text, Link } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer as TTokenTransfer } from 'types/api/tokenTransfer';

import rightArrowIcon from 'icons/arrows/east.svg';
import { space } from 'lib/html-entities';
import link from 'lib/link/link';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TokenSnippet from 'ui/shared/TokenSnippet';

type Props = TTokenTransfer

const TokenTransfer = (props: Props) => {
  const content = (() => {
    switch (props.token_type) {
      case 'ERC-20':
        return (
          <Text fontWeight={ 500 } as="span">For:{ space }
            <CurrencyValue value={ props.total.value } unit="ether" exchangeRate={ props.exchange_rate } fontWeight={ 600 }/>
          </Text>
        );

      case 'ERC-721': {
        const url = link('token_instance_item', { hash: props.token_address, id: props.total.token_id });
        return (
          <Text fontWeight={ 500 } as="span">For token ID:{ space }
            <Link href={ url } fontWeight={ 600 }>{ props.total.token_id }</Link>
          </Text>
        );
      }

      default:
        return null;
    }
  })();

  return (
    <Flex alignItems="center" flexWrap="wrap" columnGap={ 3 } rowGap={ 3 }>
      <Flex alignItems="center">
        <AddressLink fontWeight="500" hash={ props.from.hash } truncation="constant"/>
        <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
        <AddressLink fontWeight="500" hash={ props.to.hash } truncation="constant"/>
      </Flex>
      { content }
      <TokenSnippet symbol={ props.token_symbol } hash={ props.token_address } name="Foo"/>
    </Flex>
  );
};

export default TokenTransfer;
