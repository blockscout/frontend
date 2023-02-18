/* eslint-disable @typescript-eslint/naming-convention */
import { Box, Flex, Td, Tr, Text, Icon } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { WithdrawalsItem } from 'types/api/withdrawals';

import appConfig from 'configs/app/config';
import txIcon from 'icons/transactions.svg';
import txBatchIcon from 'icons/txBatch.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

 type Props = WithdrawalsItem;

const OutputRootsTableItem = ({
  msg_nonce,
  msg_nonce_version,
  l1_tx_hash,
  l2_timestamp,
  l2_tx_hash,
  from,
  status,
  challenge_period_end,
}: Props) => {
  const timeAgo = l2_timestamp ? useTimeAgoIncrement(l2_timestamp, false) : 'N/A';
  return (
    <Tr>
      <Td verticalAlign="middle" fontWeight={ 600 }>
        <Text>{ msg_nonce_version + '-' + msg_nonce }</Text>
      </Td>
      <Td verticalAlign="middle">
        { from ? (
          <Address>
            { /* address info?? */ }
            <AddressIcon address={{ hash: from, is_contract: false, implementation_name: null }}/>
            <AddressLink hash={ from } type="address" truncation="constant" ml={ 2 }/>
          </Address>
        ) : 'N/A' }
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal href={ route({ pathname: '/tx/[hash]', query: { hash: l2_tx_hash } }) } display="flex" alignItems="center">
          <Icon as={ txIcon } boxSize={ 6 } mr={ 1 }/>
          <Box w="calc(100% - 36px)" overflow="hidden" whiteSpace="nowrap"><HashStringShorten hash={ l2_tx_hash }/></Box>
        </LinkInternal>
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Text variant="secondary">{ timeAgo }</Text>
      </Td>
      <Td verticalAlign="middle">
        { status === 'Ready for Relay' ?
          <LinkExternal title={ status } href={ appConfig.l2.withdrawalUrl }/> :
          <Text>{ status }</Text>
        }
      </Td>
      <Td verticalAlign="middle">
        { l1_tx_hash ? 
        //!!!
          <LinkExternal title='aaa' href={ appConfig.l2.withdrawalUrl }/> :
          'N/A'
        }
      </Td>
      <Td verticalAlign="middle">
        { challenge_period_end ? challenge_period_end : '-'}
      </Td>
    </Tr>
  );
};

export default OutputRootsTableItem;
