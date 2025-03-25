import { Tr, Td } from '@chakra-ui/react';
import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import AddressFromToIcon from 'ui/shared/address/AddressFromToIcon';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityInterop from 'ui/shared/entities/address/AddressEntityInterop';
import InteropMessageStatus from 'ui/shared/statusTag/InteropMessageStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import InteropMessageAdditionalInfo from './InteropMessageAdditionalInfo';
import InteropMessageDestinationTx from './InteropMessageDestinationTx';
import InteropMessageSourceTx from './InteropMessageSourceTx';

interface Props {
  item: InteropMessage;
  isLoading?: boolean;
}

const InteropMessagesTableItem = ({ item, isLoading }: Props) => {
  return (
    <Tr>
      <Td>
        <InteropMessageAdditionalInfo payload={ item.payload } isLoading={ isLoading }/>
      </Td>
      <Td>
        <Skeleton isLoaded={ !isLoading } fontWeight="700">
          { item.nonce }
        </Skeleton>
      </Td>
      <Td>
        <TimeAgoWithTooltip timestamp={ item.timestamp } isLoading={ isLoading } color="text_secondary"/>
      </Td>
      <Td>
        <InteropMessageStatus status={ item.status } isLoading={ isLoading }/>
      </Td>
      <Td>
        <InteropMessageSourceTx { ...item } isLoading={ isLoading }/>
      </Td>
      <Td>
        <InteropMessageDestinationTx { ...item } isLoading={ isLoading }/>
      </Td>
      <Td>
        { item.init_chain !== undefined ?
          <AddressEntityInterop address={{ hash: item.target }} isLoading={ isLoading } truncation="constant" chain={ item.init_chain }/> :
          <AddressEntity address={{ hash: item.target }} isLoading={ isLoading } truncation="constant"/>
        }
      </Td>
      <Td>
        <AddressFromToIcon
          isLoading={ isLoading }
          type={ item.init_chain !== undefined ? 'in' : 'out' }
        />
      </Td>
      <Td>
        { item.relay_chain !== undefined ?
          <AddressEntityInterop address={{ hash: item.target }} isLoading={ isLoading } truncation="constant" chain={ item.relay_chain }/> :
          <AddressEntity address={{ hash: item.target }} isLoading={ isLoading } truncation="constant"/>
        }
      </Td>
    </Tr>
  );
};

export default React.memo(InteropMessagesTableItem);
