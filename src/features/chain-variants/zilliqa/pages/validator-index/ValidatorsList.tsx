// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ValidatorsListItem from './ValidatorsListItem';

interface Props {
  data: Array<schemas['ZilliqaStaker']>;
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
            key={ item.bls_public_key + (isLoading ? index : '') }
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
