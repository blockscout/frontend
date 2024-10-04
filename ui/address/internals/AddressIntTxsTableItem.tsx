import { Tr, Td, Box, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import Tag from 'ui/shared/chakra/Tag';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { currentAddress: string; isLoading?: boolean }

const AddressIntTxsTableItem = ({
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
    <Tr alignItems="top">
      <Td verticalAlign="middle">
        <Flex rowGap={ 3 } flexWrap="wrap">
          <TxEntity
            hash={ txnHash }
            isLoading={ isLoading }
            fontWeight={ 700 }
            noIcon
            truncation="constant_long"
          />
          <TimeAgoWithTooltip
            timestamp={ timestamp }
            enableIncrement
            isLoading={ isLoading }
            color="text_secondary"
            fontWeight="400"
            fontSize="sm"
          />
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex rowGap={ 2 } flexWrap="wrap">
          { typeTitle && (
            <Box w="126px" display="inline-block">
              <Tag colorScheme="cyan" mr={ 5 } isLoading={ isLoading }>{ typeTitle }</Tag>
            </Box>
          ) }
          <TxStatus status={ success ? 'ok' : 'error' } errorText={ error } isLoading={ isLoading }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntity
          isLoading={ isLoading }
          number={ block }
          noIcon
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 500 }
        />
      </Td>
      <Td verticalAlign="middle">
        <AddressFromTo
          from={ from }
          to={ toData }
          current={ currentAddress }
          isLoading={ isLoading }
        />
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block" minW={ 6 }>
          { BigNumber(value).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressIntTxsTableItem);
