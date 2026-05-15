// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack, Text, Grid } from '@chakra-ui/react';
import React from 'react';

import type { InteropMessage } from 'client/features/op-interop/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import AddressFromToIcon from 'client/slices/address/components/from-to/AddressFromToIcon';

import AddressEntityInterop from 'client/features/op-interop/components/AddressEntityInterop';
import InteropMessageDestinationTx from 'client/features/op-interop/components/InteropMessageDestinationTx';
import InteropMessageSourceTx from 'client/features/op-interop/components/InteropMessageSourceTx';
import InteropMessageStatus from 'client/features/op-interop/components/InteropMessageStatus';

import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import InteropMessageAdditionalInfo from './InteropMessageAdditionalInfo';

interface Props {
  item: InteropMessage;
  isLoading?: boolean;
}

const InteropMessagesListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <InteropMessageStatus status={ item.status } isLoading={ isLoading }/>
        <InteropMessageAdditionalInfo payload={ item.payload } isLoading={ isLoading }/>
      </Flex>
      <Flex alignItems="flex-start" flexDirection="column" gap={ 2 } w="100%">
        <HStack w="100%">
          <Text fontWeight={ 500 } flexGrow={ 1 }>#{ item.nonce }</Text>
          <TimeWithTooltip timestamp={ item.timestamp } isLoading={ isLoading } color="text.secondary"/>
        </HStack>
        <Grid templateColumns="120px 1fr" rowGap={ 2 }>
          <Text as="span" color="text.secondary">Source tx</Text>
          <InteropMessageSourceTx { ...item } isLoading={ isLoading }/>
          <Text as="span" color="text.secondary">Destination tx</Text>
          <InteropMessageDestinationTx { ...item } isLoading={ isLoading }/>
        </Grid>
        <Flex gap={ 2 } justifyContent="space-between" mt={ 2 }>
          { item.init_chain !== undefined ? (
            <AddressEntityInterop
              chain={ item.init_chain }
              address={{ hash: item.sender_address_hash }}
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : (
            <AddressEntity address={{ hash: item.sender_address_hash }} isLoading={ isLoading } truncation="constant"/>
          ) }
          <AddressFromToIcon
            isLoading={ isLoading }
            type={ item.init_chain !== undefined ? 'in' : 'out' }
          />
          { item.relay_chain !== undefined ? (
            <AddressEntityInterop
              chain={ item.relay_chain }
              address={{ hash: item.target_address_hash }}
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : (
            <AddressEntity address={{ hash: item.target_address_hash }} isLoading={ isLoading } truncation="constant"/>
          ) }
        </Flex>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(InteropMessagesListItem);
