// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'client/slices/internal-tx/types/api';

import TxInternalsListItem from './TxInternalsListItem';

const TxInternalsList = ({ data, isLoading }: { data: Array<InternalTransaction>; isLoading?: boolean }) => {
  return (
    <Box>
      { data.map((item, index) => <TxInternalsListItem key={ item.index.toString() + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>) }
    </Box>
  );
};

export default TxInternalsList;
