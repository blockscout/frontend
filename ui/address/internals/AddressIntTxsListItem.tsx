import { Flex, Box, HStack, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import eastArrowIcon from 'icons/arrows/east.svg';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import InOutTag from 'ui/shared/InOutTag';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/statusTag/TxStatus';
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

  const isOut = Boolean(currentAddress && currentAddress === from.hash);
  const isIn = Boolean(currentAddress && currentAddress === toData?.hash);

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
          truncation="constant"
        />
        <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm">
          <span>{ dayjs(timestamp).fromNow() }</span>
        </Skeleton>
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
      <Box w="100%" display="flex" columnGap={ 3 }>
        <AddressEntity
          address={ from }
          isLoading={ isLoading }
          noLink={ isOut }
          noCopy={ isOut }
          width="calc((100% - 48px) / 2)"
        />
        { (isIn || isOut) ?
          <InOutTag isIn={ isIn } isOut={ isOut } isLoading={ isLoading }/> :
          <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
        }
        { toData && (
          <AddressEntity
            address={ toData }
            isLoading={ isLoading }
            noLink={ isIn }
            noCopy={ isIn }
            width="calc((100% - 48px) / 2)"
          />
        ) }
      </Box>
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Value { config.chain.currency.symbol }</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary" minW={ 6 }>
          <span>{ BigNumber(value).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default TxInternalsListItem;
