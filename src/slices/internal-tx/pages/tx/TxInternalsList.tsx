// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxInternalsListItem from './TxInternalsListItem';

const TxInternalsList = ({ data, isLoading }: { data: Array<schemas['InternalTransaction']>; isLoading?: boolean }) => {
  return (
    <Box>
      { data.map((item, index) => <TxInternalsListItem key={ item.index.toString() + (isLoading ? index : '') } data={ item } isLoading={ isLoading }/>) }
    </Box>
  );
};

export default TxInternalsList;
