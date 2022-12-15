import { Tr, Td, Tag, Icon, Box, Flex, Text, Link } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import dayjs from 'lib/date/dayjs';
import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
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

  return (
    <Tr alignItems="top">
      <Td verticalAlign="middle">
        <Flex rowGap={ 3 } flexWrap="wrap">
          <AddressLink fontWeight="700" hash={ txnHash } type="transaction"/>
          <Text variant="secondary" fontWeight="400" fontSize="sm">{ dayjs(timestamp).fromNow() }</Text>
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
        <Link href={ link('block', { id: block.toString() }) }>{ block }</Link>
      </Td>
      <Td verticalAlign="middle">
        <Address display="inline-flex" maxW="100%">
          <AddressIcon hash={ from.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 }/>
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
          <AddressIcon hash={ toData.hash }/>
          <AddressLink hash={ toData.hash } alias={ toData.name } fontWeight="500" ml={ 2 }/>
        </Address>
      </Td>
      <Td isNumeric verticalAlign="middle">
        { BigNumber(value).div(BigNumber(10 ** appConfig.network.currency.decimals)).toFormat() }
      </Td>
    </Tr>
  );
};

export default React.memo(AddressIntTxsTableItem);
