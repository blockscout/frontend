import { Flex, Box, HStack, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import eastArrowIcon from 'icons/arrows/east.svg';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import InOutTag from 'ui/shared/InOutTag';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/TxStatus';
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
  const isIn = Boolean(currentAddress && currentAddress === to?.hash);

  return (
    <ListItemMobile rowGap={ 3 }>
      <Flex columnGap={ 2 }>
        { typeTitle && <Tag colorScheme="cyan" isLoading={ isLoading }>{ typeTitle }</Tag> }
        <TxStatus status={ success ? 'ok' : 'error' } errorText={ error } isLoading={ isLoading }/>
      </Flex>
      <Flex justifyContent="space-between" width="100%">
        <AddressLink fontWeight="700" hash={ txnHash } truncation="constant" type="transaction" isLoading={ isLoading }/>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm">
          <span>{ dayjs(timestamp).fromNow() }</span>
        </Skeleton>
      </Flex>
      <HStack spacing={ 1 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Block</Skeleton>
        <Skeleton isLoaded={ !isLoading }>
          <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: block.toString() } }) }>{ block }</LinkInternal>
        </Skeleton>
      </HStack>
      <Box w="100%" display="flex" columnGap={ 3 }>
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon address={ from } isLoading={ isLoading }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash } isDisabled={ isOut } isLoading={ isLoading }/>
          { isIn && <CopyToClipboard text={ from.hash } isLoading={ isLoading }/> }
        </Address>
        { (isIn || isOut) ?
          <InOutTag isIn={ isIn } isOut={ isOut } isLoading={ isLoading }/> :
          <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
        }
        { toData && (
          <Address width="calc((100% - 48px) / 2)">
            <AddressIcon address={ toData } isLoading={ isLoading }/>
            <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ toData.hash } isDisabled={ isIn } isLoading={ isLoading }/>
            { isOut && <CopyToClipboard text={ toData.hash } isLoading={ isLoading }/> }
          </Address>
        ) }
      </Box>
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Value { appConfig.network.currency.symbol }</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary" minW={ 6 }>
          <span>{ BigNumber(value).div(BigNumber(10 ** appConfig.network.currency.decimals)).toFormat() }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default TxInternalsListItem;
