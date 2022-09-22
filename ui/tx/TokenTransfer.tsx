import { Center, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import { space } from 'lib/html-entities';
import AddressLink from 'ui/shared/address/AddressLink';
import Token from 'ui/shared/Token';

interface Props {
  from: string;
  to: string;
  token: string;
  amount: number;
  usd: number;
}

const TokenTransfer = ({ from, to, amount, usd, token }: Props) => {
  return (
    <Center>
      <AddressLink fontWeight="500" hash={ from } truncation="constant"/>
      <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
      <AddressLink fontWeight="500" hash={ to } truncation="constant"/>
      <Text fontWeight={ 500 } as="span" ml={ 4 }>For:{ space }
        <Text fontWeight={ 600 } as="span">{ amount }</Text>{ space }
        <Text fontWeight={ 400 } variant="secondary" as="span">(${ usd.toFixed(2) })</Text>
      </Text>
      <Token symbol={ token } ml={ 3 }/>
    </Center>
  );
};

export default TokenTransfer;
