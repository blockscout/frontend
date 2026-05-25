// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'client/features/dex-pools/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import PoolEntity from 'client/features/dex-pools/components/entity/PoolEntity';
import getPoolLinks from 'client/features/dex-pools/utils/get-pool-links';

import getItemIndex from 'client/shared/lists/get-item-index';
import CopyToClipboard from 'client/shared/texts/CopyToClipboard';
import HashStringShorten from 'client/shared/texts/HashStringShorten';

import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tooltip } from 'toolkit/chakra/tooltip';

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
    <TableRow>
      <TableCell>
        <Flex gap={ 2 } alignItems="start">
          <Skeleton loading={ isLoading }>
            <Text px={ 2 }>{ getItemIndex(index, page) }</Text>
          </Skeleton>
          <Box overflow="hidden">
            <PoolEntity pool={ item } fontWeight={ 700 } mb={ 2 } isLoading={ isLoading }/>
            { item.is_contract ? (
              <AddressEntity
                address={{ hash: item.pool_id }}
                noIcon
                isLoading={ isLoading }
                truncation="constant_long"
                link={{ variant: 'secondary' }}
              />
            ) : (
              <Flex color="text.secondary" alignItems="center">
                <HashStringShorten hash={ item.pool_id } type="long"/>
                <CopyToClipboard text={ item.pool_id }/>
              </Flex>
            ) }
          </Box>
        </Flex>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>{ item.dex.name }</Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading }>
          ${ Number(item.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="flex" gap={ 2 } justifyContent="center">
          { externalLinks.map((link) => (
            <Tooltip content={ link.title } key={ link.url }>
              <Box display="inline-block">
                <Link external noIcon href={ link.url } display="inline-flex">
                  <Image src={ link.image } alt={ link.title } boxSize={ 5 }/>
                </Link>
              </Box>
            </Tooltip>
          )) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default PoolsTableItem;
