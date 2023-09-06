import { Tr, Td, Flex, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntityWithAddressFilter from 'ui/shared/entities/token/TokenEntityWithAddressFilter';

type Props = AddressTokenBalance & { isLoading: boolean};

const ERC721TokensTableItem = ({
  token,
  value,
  isLoading,
}: Props) => {
  const router = useRouter();

  const hash = router.query.hash?.toString() || '';

  return (
    <Tr>
      <Td verticalAlign="middle">
        <TokenEntityWithAddressFilter
          token={ token }
          addressHash={ hash }
          isLoading={ isLoading }
          noCopy
          jointSymbol
          fontWeight="700"
        />
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          <AddressEntity
            address={{ hash: token.address }}
            isLoading={ isLoading }
            noIcon
          />
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
