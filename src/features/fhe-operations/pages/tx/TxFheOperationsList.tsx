// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxFHEOperationsListItem from './TxFheOperationsListItem';

interface Props {
  data: Array<schemas['FheOperation']>;
  isLoading?: boolean;
}

const TxFHEOperationsList = ({ data, isLoading }: Props) => {
  return (
    <Box hideFrom="lg">
      { data.map((item) => (
        <TxFHEOperationsListItem
          key={ item.log_index }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default React.memo(TxFHEOperationsList);
