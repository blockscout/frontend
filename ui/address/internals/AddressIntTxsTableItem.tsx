import { Tr, Td, Tag, Icon, Box, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
import LinkInternal from 'ui/shared/LinkInternal';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { currentAddress: string }

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
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  const isOut = Boolean(currentAddress && currentAddress === from.hash);
  const isIn = Boolean(currentAddress && currentAddress === to?.hash);

  const timeAgo = useTimeAgoIncrement(timestamp, true);

  return (
    <Tr alignItems="top">
      <Td verticalAlign="middle">
        <Flex rowGap={ 3 } flexWrap="wrap">
          <AddressLink fontWeight="700" hash={ txnHash } type="transaction"/>
          { timestamp && <Text variant="secondary" fontWeight="400" fontSize="sm">{ timeAgo }</Text> }
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex rowGap={ 2 } flexWrap="wrap">
          { typeTitle && (
            <Box w="126px" display="inline-block">
              <Tag colorScheme="cyan" mr={ 5 }>{ typeTitle }</Tag>
            </Box>
          ) }
          <TxStatus status={ success ? 'ok' : 'error' } errorText={ error }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal href={ route({ pathname: '/block/[height]', query: { height: block.toString() } }) }>{ block }</LinkInternal>
      </Td>
      <Td verticalAlign="middle">
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ from }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 } isDisabled={ isOut }/>
        </Address>
      </Td>
      <Td px={ 0 } verticalAlign="middle">
        { (isIn || isOut) ?
          <InOutTag isIn={ isIn } isOut={ isOut }/> :
          <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500"/>
        }
      </Td>
      <Td verticalAlign="middle">
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ toData }/>
          <AddressLink type="address" hash={ toData.hash } alias={ toData.name } fontWeight="500" ml={ 2 } isDisabled={ isIn }/>
        </Address>
      </Td>
      <Td isNumeric verticalAlign="middle">
        { BigNumber(value).div(BigNumber(10 ** appConfig.network.currency.decimals)).toFormat() }
      </Td>
    </Tr>
  );
};

export default React.memo(AddressIntTxsTableItem);
