import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

import NovesFromTo from 'ui/shared/Noves/NovesFromTo';

import NovesActionSnippet from './components/NovesActionSnippet';
import type { NovesFlowViewItem } from './utils/generateFlowViewData';

type Props = {
  isPlaceholderData: boolean;
  item: NovesFlowViewItem;
};

const TxAssetFlowsTableItem = (props: Props) => {

  return (
    <Tr >
      <Td px={ 3 } py={ 5 } fontSize="sm" borderColor="gray.200" _dark={{ borderColor: 'whiteAlpha.200' }}>
        <NovesActionSnippet item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </Td>
      <Td px={ 3 } py="18px" fontSize="sm" borderColor="gray.200" _dark={{ borderColor: 'whiteAlpha.200' }}>
        <NovesFromTo item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </Td>
    </Tr>
  );
};

export default React.memo(TxAssetFlowsTableItem);
