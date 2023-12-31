import { Box, Tag, TagLabel } from '@chakra-ui/react';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import type { NovesResponseData } from 'types/novesApi';

import type { NovesFlowViewItem } from 'ui/tx/Noves/utils/NovesGenerateFlowViewData';

import AddressEntity from '../entities/address/AddressEntity';
import type { FromToData } from './utils';
import { NovesGetActionFromTo, NovesGetFromTo } from './utils';

interface Props {
  txData?: NovesResponseData;
  currentAddress?: string;
  item?: NovesFlowViewItem;
}

const NovesFromToComponent: FC<Props> = ({ txData, currentAddress = '', item }) => {
  const [ data, setData ] = useState<FromToData>({ text: 'Sent to', address: '' });

  useEffect(() => {
    let fromTo;

    if (txData) {
      fromTo = NovesGetFromTo(txData, currentAddress);
      setData(fromTo);
    } else if (item) {
      fromTo = NovesGetActionFromTo(item);
      setData(fromTo);
    }
  }, [ currentAddress, item, txData ]);

  const isSent = data.text.startsWith('Sent');

  const addressObj = { hash: data.address || '', name: data.name || '' };

  return (
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

      <Box ml="2" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
        <AddressEntity
          address={ addressObj }
          fontWeight="500"
          noCopy={ !data.address }
          noLink={ !data.address }
        />
      </Box>
    </Box>
  );
};

export default NovesFromToComponent;
