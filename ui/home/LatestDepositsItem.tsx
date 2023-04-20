import {
  Box,
  Flex,
  Grid,
  Icon,
  Text,
} from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { DepositsItem } from 'types/api/deposits';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = {
  item: DepositsItem;
}

const LatestTxsItem = ({ item }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();
  const isMobile = useIsMobile();

  const l1BlockLink = (
    <LinkExternal
      href={ appConfig.L2.L1BaseUrl + route({ pathname: '/block/[height]', query: { height: item.l1_block_number.toString() } }) }
      fontWeight={ 700 }
      display="inline-flex"
      mr={ 2 }
    >
      <Icon as={ blockIcon } boxSize="30px" mr={ 1 }/>
      { item.l1_block_number }
    </LinkExternal>
  );

  const l1TxLink = (
    <LinkExternal
      href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
      maxW="100%"
      display="inline-flex"
      alignItems="center"
      overflow="hidden"
    >
      <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
      <Box overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l1_tx_hash }/></Box>
    </LinkExternal>
  );

  const l2TxLink = (
    <LinkInternal
      href={ route({ pathname: '/tx/[hash]', query: { hash: item.l2_tx_hash } }) }
      display="flex"
      alignItems="center"
      overflow="hidden"
      w="100%"
    >
      <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
      <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShortenDynamic hash={ item.l2_tx_hash }/></Box>
    </LinkInternal>
  );

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={ 1 }>
            { l1BlockLink }
            <Text variant="secondary">{ timeAgo }</Text>
          </Flex>
          <Grid gridTemplateColumns="56px auto">
            <Text lineHeight="30px">L1 txn</Text>
            { l1TxLink }
            <Text lineHeight="30px">L2 txn</Text>
            { l2TxLink }
          </Grid>
        </>
      );
    }
    return (
      <Grid width="100%" columnGap={ 4 } rowGap={ 2 } templateColumns="max-content max-content auto" w="100%">
        { l1BlockLink }
        <Text lineHeight="30px">L1 txn</Text>
        { l1TxLink }
        <Text variant="secondary">{ timeAgo }</Text>
        <Text lineHeight="30px">L2 txn</Text>
        { l2TxLink }
      </Grid>
    );
  })();
  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor="divider"
      py={ 4 }
      px={{ base: 0, lg: 4 }}
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      fontSize="sm"
    >
      { content }
    </Box>
  );
};

export default React.memo(LatestTxsItem);
