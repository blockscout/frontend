import { Tr, Td, Box, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import rightArrowIcon from 'icons/arrows/east.svg';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & {
  isLoading?: boolean;
}

const TxInternalTableItem = ({ type, from, to, value, success, error, gas_limit: gasLimit, created_contract: createdContract, isLoading }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <Tr alignItems="top">
      <Td>
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
        <AddressEntity
          address={ from }
          isLoading={ isLoading }
        />
      </Td>
      <Td px={ 0 } verticalAlign="middle">
        <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        { toData && (
          <AddressEntity
            address={ toData }
            isLoading={ isLoading }
          />
        ) }
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(value).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(gasLimit).toFormat() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(TxInternalTableItem);
