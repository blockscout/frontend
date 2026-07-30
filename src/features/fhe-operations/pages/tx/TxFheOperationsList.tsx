// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import TxFHEOperationsListItem from './TxFheOperationsListItem';

interface Props {
  data: Array<schemas['FheOperation']>;
  isLoading?: boolean;
  resetKey?: string;
}

const TxFHEOperationsList = ({ data, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box hideFrom="lg">
      { data.slice(0, renderedItemsNum).map((item) => (
        <TxFHEOperationsListItem
          key={ item.log_index }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(TxFHEOperationsList);
