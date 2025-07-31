import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { FlashblockItem } from 'types/client/flashblocks';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props {
  data: FlashblockItem;
}

const FlashblocksListItem = ({ data }: Props) => {
  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" w="100%">
        { data.block_number ? (
          <Link
            href={ route({
              pathname: '/block/[height_or_hash]',
              query: { height_or_hash: String(data.block_number) },
            }) }
          >
            { data.block_number } #{ data.index }
          </Link>
        ) : <Text color="text.secondary">N/A</Text> }
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Txn</Text>
        { data.transactions_count > 0 ? (
          <Link href={ route({
            pathname: '/block/[height_or_hash]/flashblock/[id]',
            query: { height_or_hash: String(data.block_number), id: String(data.index), tab: 'txs' },
          }) }>
            { data.transactions_count }
          </Link>
        ) :
          <Text color="text.secondary">{ data.transactions_count }</Text>
        }
      </Flex>
    </ListItemMobile>
  );
};

export default FlashblocksListItem;
