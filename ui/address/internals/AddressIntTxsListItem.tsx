import { Flex, Tag, Icon, Box, HStack, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import eastArrowIcon from 'icons/arrows/east.svg';
import dayjs from 'lib/date/dayjs';
import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { currentAddress: string };

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
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  const isOut = Boolean(currentAddress && currentAddress === from.hash);
  const isIn = Boolean(currentAddress && currentAddress === to?.hash);

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex>
        { typeTitle && <Tag colorScheme="cyan" mr={ 2 }>{ typeTitle }</Tag> }
        <TxStatus status={ success ? 'ok' : 'error' } errorText={ error }/>
      </Flex>
      <Flex justifyContent="space-between" width="100%">
        <AddressLink fontWeight="700" hash={ txnHash } truncation="constant" type="transaction"/>
        <Text variant="secondary" fontWeight="400" fontSize="sm">{ dayjs(timestamp).fromNow() }</Text>
      </Flex>
      <HStack spacing={ 1 }>
        <Text fontSize="sm" fontWeight={ 500 }>Block</Text>
        <LinkInternal href={ link('block', { id: block.toString() }) }>{ block }</LinkInternal>
      </HStack>
      <Box w="100%" display="flex" columnGap={ 3 }>
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon address={ from }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash } isDisabled={ isOut }/>
        </Address>
        { (isIn || isOut) ?
          <InOutTag isIn={ isIn } isOut={ isOut }/> :
          <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
        }
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon address={ toData }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ toData.hash } isDisabled={ isIn }/>
        </Address>
      </Box>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Value { appConfig.network.currency.symbol }</Text>
        <Text fontSize="sm" variant="secondary">
          { BigNumber(value).div(BigNumber(10 ** appConfig.network.currency.decimals)).toFormat() }
        </Text>
      </HStack>
    </ListItemMobile>
  );
};

export default TxInternalsListItem;
