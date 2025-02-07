import { Flex, Box, Td, Tr, Text, Image, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import getItemIndex from 'lib/getItemIndex';
import getPoolLinks from 'lib/pools/getPoolLinks';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import LinkExternal from 'ui/shared/links/LinkExternal';

type Props = {
  item: Pool;
  index: number;
  page: number;
  isLoading?: boolean;
};

const PoolsTableItem = ({
  item,
  page,
  index,
  isLoading,
}: Props) => {
  const externalLinks = getPoolLinks(item);

  return (
    <Tr>
      <Td>
        <Flex gap={ 2 } alignItems="start">
          <Skeleton isLoaded={ !isLoading }>
            <Text px={ 2 }>{ getItemIndex(index, page) }</Text>
          </Skeleton>
          <Box overflow="hidden">
            <PoolEntity pool={ item } fontWeight={ 700 } mb={ 2 } isLoading={ isLoading }/>
            <AddressEntity
              address={{ hash: item.contract_address }}
              noIcon
              isLoading={ isLoading }
              truncation="constant_long"
            />
          </Box>
        </Flex>
      </Td>
      <Td>
        <Skeleton isLoaded={ !isLoading }>{ item.dex.name }</Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading }>
          ${ Number(item.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } display="flex" gap={ 2 } justifyContent="center">
          { externalLinks.map((link) => (
            <Tooltip label={ link.title } key={ link.url }>
              <Box display="inline-block">
                <LinkExternal href={ link.url } display="inline-flex">
                  <Image src={ link.image } alt={ link.title } boxSize={ 5 }/>
                </LinkExternal>
              </Box>
            </Tooltip>
          )) }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default PoolsTableItem;
