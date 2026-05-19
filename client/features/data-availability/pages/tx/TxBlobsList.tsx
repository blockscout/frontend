// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TxBlob } from 'client/features/data-availability/types/api';

import TxBlobListItem from './TxBlobListItem';

const TxBlobsList = ({ data, isLoading }: { data: Array<TxBlob>; isLoading?: boolean }) => {
  return (
    <Box>
      { data.map((item, index) => (
        <TxBlobListItem
          key={ item.hash + (isLoading ? index : '') }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default TxBlobsList;
