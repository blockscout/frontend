// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import type { NovesResponseData } from 'src/features/tx-interpretation/noves/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import { getActionFromTo, getFromTo } from 'src/features/tx-interpretation/noves/utils/from-to';
import type { NovesFlowViewItem } from 'src/features/tx-interpretation/noves/utils/generateFlowViewData';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

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
