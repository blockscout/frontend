// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxAuthorizationsListItem from './TxAuthorizationsListItem';

interface Props {
  data: Array<schemas['SignedAuthorization']> | undefined;
  isLoading?: boolean;
}

const TxAuthorizationsList = ({ data, isLoading }: Props) => {
  return (
    <Box>
      { data?.map((item, index) => <TxAuthorizationsListItem key={ item.nonce.toString() + (isLoading ? index : '') } data={ item } isLoading={ isLoading }/>) }
    </Box>
  );
};

export default TxAuthorizationsList;
