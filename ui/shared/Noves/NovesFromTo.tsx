import { Box, Skeleton, Tag, TagLabel } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import type { NovesResponseData } from 'types/api/noves';

import type { NovesFlowViewItem } from 'ui/tx/assetFlows/utils/generateFlowViewData';

import AddressEntity from '../entities/address/AddressEntity';
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
    <Skeleton borderRadius="sm" isLoaded={ isLoaded }>
      <Box display="flex">
        <Tag
          colorScheme={ isSent ? 'yellow' : 'green' }
          px={ 0 }
          pos="relative"
          minW="max-content"
        >
          <TagLabel
            position="absolute"
            w="full"
            textAlign="center"
          >
            { data.text }
          </TagLabel>
          <TagLabel visibility="hidden" whiteSpace="nowrap" px={ 2 } >Received from</TagLabel>
        </Tag>

        <AddressEntity
          address={ address }
          fontWeight="500"
          noCopy={ !data.address }
          noLink={ !data.address }
          ml={ 2 }
          truncation="dynamic"
        />
      </Box>
    </Skeleton>
  );
};

export default NovesFromTo;
