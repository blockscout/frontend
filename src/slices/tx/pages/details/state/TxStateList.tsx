// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxStateListItem from './TxStateListItem';

interface Props {
  data: Array<schemas['StateChange']>;
  isLoading?: boolean;
}

const TxStateList = ({ data, isLoading }: Props) => {
  return (
    <Box>
      { data.map((item, index) => <TxStateListItem key={ index } data={ item } isLoading={ isLoading }/>) }
    </Box>
  );
};

export default TxStateList;
