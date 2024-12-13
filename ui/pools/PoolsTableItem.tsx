import { Flex, Box, Td, Tr, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';

type Props = {
  item: Pool;
  index: number;
  page: number;
  isLoading?: boolean;
};

const PAGE_SIZE = 50;

const PoolsTableItem = ({
  item,
  page,
  index,
  isLoading,
}: Props) => {
  return (
    <Tr>
      <Td>
        <Flex gap={ 2 } alignItems="start">
          <Skeleton isLoaded={ !isLoading }>
            <Text px={ 2 }>{ index + 1 + (page - 1) * PAGE_SIZE }</Text>
          </Skeleton>
          <Box>
            <PoolEntity pool={ item } fontWeight={ 700 } mb={ 2 } isLoading={ isLoading }/>
            <AddressEntity address={{ hash: item.contract_address }} noIcon isLoading={ isLoading }/>
          </Box>
        </Flex>
      </Td>
      <Td>
        <Skeleton isLoaded={ !isLoading }>{ item.dex.name }</Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading }>
          ${ Number(item.fully_diluted_valuation_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </Td>
      <Td isNumeric maxWidth="300px" width="300px">
        <Skeleton isLoaded={ !isLoading }>
          ${ Number(item.market_cap_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading }>
          ${ Number(item.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default PoolsTableItem;
