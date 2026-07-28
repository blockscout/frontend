// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ValidatorBlackfort } from 'src/features/chain-variants/blackfort/types/api';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ValidatorsListItem from './ValidatorsListItem';

interface Props {
  data: Array<ValidatorBlackfort>;
  isLoading: boolean;
  resetKey?: string;
}

const ValidatorsList = ({ data, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <ValidatorsListItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(ValidatorsList);
