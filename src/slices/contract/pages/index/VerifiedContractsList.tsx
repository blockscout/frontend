// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import VerifiedContractsListItem from './VerifiedContractsListItem';

interface Props {
  data: Array<schemas['SmartContractListItem']>;
  isLoading: boolean;
  resetKey?: string;
}

const VerifiedContractsList = ({ data, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => (
        <VerifiedContractsListItem
          key={ `${ item.address?.hash ?? '' }${ isLoading ? index : '' }` }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(VerifiedContractsList);
