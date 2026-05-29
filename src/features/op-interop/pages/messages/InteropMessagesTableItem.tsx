// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InteropMessage } from 'src/features/op-interop/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import AddressFromToIcon from 'src/slices/address/components/from-to/AddressFromToIcon';

import AddressEntityInterop from 'src/features/op-interop/components/AddressEntityInterop';
import InteropMessageDestinationTx from 'src/features/op-interop/components/InteropMessageDestinationTx';
import InteropMessageSourceTx from 'src/features/op-interop/components/InteropMessageSourceTx';
import InteropMessageStatus from 'src/features/op-interop/components/InteropMessageStatus';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import InteropMessageAdditionalInfo from './InteropMessageAdditionalInfo';

interface Props {
  item: InteropMessage;
  isLoading?: boolean;
}

const InteropMessagesTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell>
        <InteropMessageAdditionalInfo payload={ item.payload } isLoading={ isLoading }/>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } fontWeight="700">
          { item.nonce }
        </Skeleton>
      </TableCell>
      <TableCell>
        <TimeWithTooltip timestamp={ item.timestamp } isLoading={ isLoading } color="text.secondary"/>
      </TableCell>
      <TableCell>
        <InteropMessageStatus status={ item.status } isLoading={ isLoading }/>
      </TableCell>
      <TableCell>
        <InteropMessageSourceTx { ...item } isLoading={ isLoading }/>
      </TableCell>
      <TableCell>
        <InteropMessageDestinationTx { ...item } isLoading={ isLoading }/>
      </TableCell>
      <TableCell>
        { item.init_chain !== undefined ? (
          <AddressEntityInterop
            address={{ hash: item.target_address_hash }}
            isLoading={ isLoading } truncation="constant"
            chain={ item.init_chain }
            w="min-content"
          />
        ) :
          <AddressEntity address={{ hash: item.target_address_hash }} isLoading={ isLoading } truncation="constant"/>
        }
      </TableCell>
      <TableCell>
        <AddressFromToIcon
          isLoading={ isLoading }
          type={ item.init_chain !== undefined ? 'in' : 'out' }
        />
      </TableCell>
      <TableCell>
        { item.relay_chain !== undefined ? (
          <AddressEntityInterop
            address={{ hash: item.target_address_hash }}
            isLoading={ isLoading }
            truncation="constant"
            chain={ item.relay_chain }
            w="min-content"
          />
        ) :
          <AddressEntity address={{ hash: item.target_address_hash }} isLoading={ isLoading } truncation="constant"/>
        }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(InteropMessagesTableItem);
