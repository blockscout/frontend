import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer as TTokenTransfer } from 'types/api/tokenTransfer';

import rightArrowIcon from 'icons/arrows/east.svg';
import { space } from 'lib/html-entities';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TokenSnippet from 'ui/shared/TokenSnippet';

type Props = TTokenTransfer

const TokenTransfer = ({ from, to, total, exchange_rate: exchangeRate, ...token }: Props) => {
  return (
    <Flex alignItems="center" flexWrap="wrap" columnGap={ 3 } rowGap={ 3 }>
      <Flex alignItems="center">
        <AddressLink fontWeight="500" hash={ from.hash } truncation="constant"/>
        <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
        <AddressLink fontWeight="500" hash={ to.hash } truncation="constant"/>
      </Flex>
      <Text fontWeight={ 500 } as="span">For:{ space }
        <CurrencyValue value={ total.value } unit="ether" exchangeRate={ exchangeRate } fontWeight={ 600 }/>
      </Text>
      <TokenSnippet symbol={ token.token_symbol } hash={ token.token_address } name="Foo"/>
    </Flex>
  );
};

export default TokenTransfer;
