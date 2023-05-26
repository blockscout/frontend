import { Tr, Td, Flex, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = AddressTokenBalance & { isLoading: boolean};

const ERC721TokensTableItem = ({
  token,
  value,
  isLoading,
}: Props) => {
  const router = useRouter();

  const hash = router.query.hash?.toString() || '';
  const tokenString = [ token.name, token.symbol && `(${ token.symbol })` ].filter(Boolean).join(' ');

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Flex alignItems="center">
          <TokenLogo data={ token } boxSize={ 6 } mr={ 2 } isLoading={ isLoading }/>
          <AddressLink fontWeight="700" hash={ hash } tokenHash={ token.address } type="address_token" alias={ tokenString } isLoading={ isLoading }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          <Flex alignItems="center">
            <AddressLink hash={ token.address } type="address" truncation="dynamic" isLoading={ isLoading }/>
            <CopyToClipboard text={ token.address } isLoading={ isLoading }/>
          </Flex>
          <AddressAddToWallet token={ token } ml={ 4 } isLoading={ isLoading }/>
        </Flex>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { value }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(ERC721TokensTableItem);
