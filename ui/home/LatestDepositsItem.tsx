import {
  Box,
  Flex,
  Grid,
  Skeleton,
} from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { L2DepositsItem } from 'types/api/l2Deposits';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import Icon from 'ui/shared/chakra/Icon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = {
  item: L2DepositsItem;
  isLoading?: boolean;
}

const LatestTxsItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();
  const isMobile = useIsMobile();

  const l1BlockLink = (
    <LinkExternal
      href={ appConfig.L2.L1BaseUrl +
        route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: item.l1_block_number.toString() } })
      }
      fontWeight={ 700 }
      display="inline-flex"
      mr={ 2 }
      isLoading={ isLoading }
    >
      <Icon as={ blockIcon } boxSize="30px" isLoading={ isLoading } borderRadius="base"/>
      <Skeleton isLoaded={ !isLoading } ml={ 1 }>{ item.l1_block_number }</Skeleton>
    </LinkExternal>
  );

  const l1TxLink = (
    <LinkExternal
      href={ appConfig.L2.L1BaseUrl + route({ pathname: '/tx/[hash]', query: { hash: item.l1_tx_hash } }) }
      maxW="100%"
      display="inline-flex"
      alignItems="center"
      overflow="hidden"
      isLoading={ isLoading }
      my="3px"
    >
      <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
      <Skeleton isLoaded={ !isLoading } overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
        <HashStringShortenDynamic hash={ item.l1_tx_hash }/>
      </Skeleton>
    </LinkExternal>
  );

  const l2TxLink = (
    <LinkInternal
      href={ route({ pathname: '/tx/[hash]', query: { hash: item.l2_tx_hash } }) }
      display="flex"
      alignItems="center"
      overflow="hidden"
      w="100%"
      isLoading={ isLoading }
    >
      <Icon as={ txIcon } boxSize={ 6 } isLoading={ isLoading }/>
      <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap" ml={ 1 }>
        <HashStringShortenDynamic hash={ item.l2_tx_hash }/>
      </Skeleton>
    </LinkInternal>
  );

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={ 1 }>
            { l1BlockLink }
            <Skeleton isLoaded={ !isLoading } color="text_secondary">
              <span>{ timeAgo }</span>
            </Skeleton>
          </Flex>
          <Grid gridTemplateColumns="56px auto">
            <Skeleton isLoaded={ !isLoading } my="5px" w="fit-content">
              L1 txn
            </Skeleton>
            { l1TxLink }
            <Skeleton isLoaded={ !isLoading } my="3px" w="fit-content">
              L2 txn
            </Skeleton>
            { l2TxLink }
          </Grid>
        </>
      );
    }

    return (
      <Grid width="100%" columnGap={ 4 } rowGap={ 2 } templateColumns="max-content max-content auto" w="100%">
        { l1BlockLink }
        <Skeleton isLoaded={ !isLoading } w="fit-content" h="fit-content" my="5px">
          L1 txn
        </Skeleton>
        { l1TxLink }
        <Skeleton isLoaded={ !isLoading } color="text_secondary" w="fit-content" h="fit-content" my="2px">
          <span>{ timeAgo }</span>
        </Skeleton>
        <Skeleton isLoaded={ !isLoading } w="fit-content" h="fit-content" my="2px">
          L2 txn
        </Skeleton>
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
      lineHeight={ 5 }
    >
      { content }
    </Box>
  );
};

export default React.memo(LatestTxsItem);
