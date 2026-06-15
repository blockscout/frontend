// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import VerifiedContractsListItem from './VerifiedContractsListItem';

const VerifiedContractsList = ({ data, isLoading }: { data: Array<schemas['ListItem']>; isLoading: boolean }) => {
  return (
    <Box>
      { data.map((item, index) => (
        <VerifiedContractsListItem
          key={ `${ item.address?.hash ?? '' }${ isLoading ? index : '' }` }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default React.memo(VerifiedContractsList);
