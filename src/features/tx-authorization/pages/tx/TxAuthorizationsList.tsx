// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import TxAuthorizationsListItem from './TxAuthorizationsListItem';

interface Props {
  data: Array<schemas['SignedAuthorization']>;
  isLoading?: boolean;
  resetKey?: string;
}

const TxAuthorizationsList = ({ data, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => (
        <TxAuthorizationsListItem
          key={ item.nonce.toString() + (isLoading ? index : '') }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default TxAuthorizationsList;
