import { Flex, Box, HStack, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import eastArrowIcon from 'icons/arrows/east.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { isLoading?: boolean };

const TxInternalsListItem = ({ type, from, to, value, success, error, gas_limit: gasLimit, created_contract: createdContract, isLoading }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Tag colorScheme="cyan" isLoading={ isLoading }>{ typeTitle }</Tag> }
        <TxStatus status={ success ? 'ok' : 'error' } errorText={ error } isLoading={ isLoading }/>
      </Flex>
      <Box w="100%" display="flex" columnGap={ 3 }>
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon address={ from } isLoading={ isLoading }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash } isLoading={ isLoading }/>
          <CopyToClipboard text={ from.hash } isLoading={ isLoading }/>
        </Address>
        <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
        { toData && (
          <Address width="calc((100% - 48px) / 2)">
            <AddressIcon address={ toData } isLoading={ isLoading }/>
            <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ toData.hash } isLoading={ isLoading }/>
            <CopyToClipboard text={ toData.hash } isLoading={ isLoading }/>
          </Address>
        ) }
      </Box>
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Value { appConfig.network.currency.symbol }</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
          { BigNumber(value).div(BigNumber(10 ** appConfig.network.currency.decimals)).toFormat() }
        </Skeleton>
      </HStack>
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Gas limit</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">{ BigNumber(gasLimit).toFormat() }</Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default TxInternalsListItem;
