// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ValidatorBlackfort } from 'client/features/chain-variants/blackfort/types/api';

import ValidatorsListItem from './ValidatorsListItem';

const ValidatorsList = ({ data, isLoading }: { data: Array<ValidatorBlackfort>; isLoading: boolean }) => {
  return (
    <Box>
      { data.map((item, index) => (
        <ValidatorsListItem
          key={ item.address.hash + (isLoading ? index : '') }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default React.memo(ValidatorsList);
