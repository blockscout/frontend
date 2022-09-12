import { Center, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import { space } from 'lib/html-entities';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
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
      <AddressLinkWithTooltip address={ from } fontWeight="500" truncated withCopy={ false }/>
      <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
      <AddressLinkWithTooltip address={ to } fontWeight="500" truncated withCopy={ false }/>
      <Text fontWeight={ 500 } as="span" ml={ 4 }>For:{ space }
        <Text fontWeight={ 600 } as="span">{ amount }</Text>{ space }
        <Text fontWeight={ 400 } variant="secondary" as="span">(${ usd.toFixed(2) })</Text>
      </Text>
      <Token symbol={ token } ml={ 3 }/>
    </Center>
  );
};

export default TokenTransfer;
