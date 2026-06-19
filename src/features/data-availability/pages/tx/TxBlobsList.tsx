// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxBlobListItem from './TxBlobListItem';

const TxBlobsList = ({ data, isLoading }: { data: Array<schemas['BlobResponse']>; isLoading?: boolean }) => {
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
