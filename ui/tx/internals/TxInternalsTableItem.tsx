import { Tr, Td, Box, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TxStatus from 'ui/shared/TxStatus';
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
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ from } isLoading={ isLoading }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 } isLoading={ isLoading }/>
          <CopyToClipboard text={ from.hash } isLoading={ isLoading }/>
        </Address>
      </Td>
      <Td px={ 0 } verticalAlign="middle">
        <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        { toData && (
          <Address display="inline-flex" maxW="100%">
            <AddressIcon address={ toData } isLoading={ isLoading }/>
            <AddressLink type="address" hash={ toData.hash } alias={ toData.name } fontWeight="500" ml={ 2 } isLoading={ isLoading }/>
            <CopyToClipboard text={ toData.hash } isLoading={ isLoading }/>
          </Address>
        ) }
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(value).div(BigNumber(10 ** appConfig.network.currency.decimals)).toFormat() }
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
