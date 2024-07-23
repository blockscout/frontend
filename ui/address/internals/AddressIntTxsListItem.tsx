import { Flex, HStack, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import Tag from 'ui/shared/chakra/Tag';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { currentAddress: string; isLoading?: boolean };

const TxInternalsListItem = ({
  type,
  from,
  to,
  value,
  success,
  error,
  created_contract: createdContract,
  transaction_hash: txnHash,
  block,
  timestamp,
  currentAddress,
  isLoading,
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Tag colorScheme="cyan" isLoading={ isLoading }>{ typeTitle }</Tag> }
        <TxStatus status={ success ? 'ok' : 'error' } errorText={ error } isLoading={ isLoading }/>
      </Flex>
      <Flex justifyContent="space-between" width="100%">
        <TxEntity
          hash={ txnHash }
          isLoading={ isLoading }
          fontWeight={ 700 }
          truncation="constant_long"
        />
        <TimeAgoWithTooltip
          timestamp={ timestamp }
          isLoading={ isLoading }
          color="text_secondary"
          fontWeight="400"
          fontSize="sm"
        />
      </Flex>
      <HStack spacing={ 1 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Block</Skeleton>
        <BlockEntity
          isLoading={ isLoading }
          number={ block }
          noIcon
          fontSize="sm"
          lineHeight={ 5 }
        />
      </HStack>
      <AddressFromTo
        from={ from }
        to={ toData }
        current={ currentAddress }
        isLoading={ isLoading }
        w="100%"
      />
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Value { currencyUnits.ether }</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary" minW={ 6 }>
          <span>{ BigNumber(value).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default TxInternalsListItem;
