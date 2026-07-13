// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import TxInternalsListItem from './TxInternalsListItem';

const TxInternalsList = ({ data, isLoading, resetKey }: { data: Array<schemas['InternalTransaction']>; isLoading?: boolean; resetKey?: string }) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => (
        <TxInternalsListItem key={ item.index.toString() + (isLoading ? index : '') } data={ item } isLoading={ isLoading }/>
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default TxInternalsList;
