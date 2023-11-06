import { Flex, HStack, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntityWithAddressFilter from 'ui/shared/entities/token/TokenEntityWithAddressFilter';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = AddressTokenBalance & { isLoading: boolean};

const ERC721TokensListItem = ({ token, value, isLoading }: Props) => {
  const router = useRouter();

  const hash = router.query.hash?.toString() || '';

  return (
    <ListItemMobile rowGap={ 2 }>
      <TokenEntityWithAddressFilter
        token={ token }
        isLoading={ isLoading }
        addressHash={ hash }
        noCopy
        jointSymbol
        fontWeight={ 700 }
      />
      <Flex alignItems="center" pl={ 8 }>
        <AddressEntity
          address={{ hash: token.address }}
          isLoading={ isLoading }
          truncation="constant"
          noIcon
        />
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
