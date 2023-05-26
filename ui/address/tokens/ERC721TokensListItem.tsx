import { Flex, HStack, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = AddressTokenBalance & { isLoading: boolean};

const ERC721TokensListItem = ({ token, value, isLoading }: Props) => {
  const router = useRouter();

  const hash = router.query.hash?.toString() || '';

  const tokenString = [ token.name, token.symbol && `(${ token.symbol })` ].filter(Boolean).join(' ');

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" width="100%">
        <TokenLogo data={ token } boxSize={ 6 } mr={ 2 } isLoading={ isLoading }/>
        <AddressLink fontWeight="700" hash={ hash } tokenHash={ token.address } type="address_token" alias={ tokenString } isLoading={ isLoading }/>
      </Flex>
      <Flex alignItems="center" pl={ 8 }>
        <AddressLink hash={ token.address } type="address" truncation="constant" isLoading={ isLoading }/>
        <CopyToClipboard text={ token.address } isLoading={ isLoading }/>
        <AddressAddToWallet token={ token } ml={ 2 } isLoading={ isLoading }/>
      </Flex>
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Quantity</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
          <span>{ value }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default ERC721TokensListItem;
