// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import type { NovesResponseData } from 'types/api/noves';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import type { NovesFlowViewItem } from 'client/features/tx-interpretation/noves/utils/generateFlowViewData';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';

import { getActionFromTo, getFromTo } from './utils';

interface Props {
  isLoaded: boolean;
  txData?: NovesResponseData;
  currentAddress?: string;
  item?: NovesFlowViewItem;
}

const NovesFromTo: FC<Props> = ({ isLoaded, txData, currentAddress = '', item }) => {
  const data = React.useMemo(() => {
    if (txData) {
      return getFromTo(txData, currentAddress);
    }
    if (item) {
      return getActionFromTo(item);
    }

    return { text: 'Sent to', address: '' };
  }, [ currentAddress, item, txData ]);

  const isSent = data.text.startsWith('Sent');

  const address = { hash: data.address || '', name: data.name || '' };

  return (
    <Skeleton borderRadius="sm" loading={ !isLoaded }>
      <Box display="flex">
        <Badge
          colorPalette={ isSent ? 'yellow' : 'green' }
          px={ 0 }
          w="113px"
          flexShrink={ 0 }
          justifyContent="center"
        >
          { data.text }
        </Badge>

        <AddressEntity
          address={ address }
          fontWeight="500"
          noCopy={ !data.address }
          noLink={ !data.address }
          noIcon={ address.name === 'Validators' }
          ml={ 2 }
          truncation="dynamic"
        />
      </Box>
    </Skeleton>
  );
};

export default NovesFromTo;
