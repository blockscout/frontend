import { Tr, Td, Flex } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = AddressTokenBalance;

const ERC721TokensTableItem = ({
  token,
  value,
}: Props) => {

  const tokenString = [ token.name, token.symbol && `(${ token.symbol })` ].filter(Boolean).join(' ');

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Flex alignItems="center">
          <TokenLogo data={ token } boxSize={ 6 } mr={ 2 }/>
          <AddressLink fontWeight="700" hash={ token.address } type="token" alias={ tokenString }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          <Flex alignItems="center">
            <AddressLink hash={ token.address } type="address" truncation="dynamic"/>
            <CopyToClipboard text={ token.address } ml={ 1 }/>
          </Flex>
          <AddressAddToWallet token={ token } ml={ 4 }/>
        </Flex>
      </Td>
      <Td isNumeric verticalAlign="middle">
        { value }
      </Td>
    </Tr>
  );
};

export default React.memo(ERC721TokensTableItem);
