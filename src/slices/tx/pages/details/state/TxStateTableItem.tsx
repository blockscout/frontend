// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import { getStateElements } from './utils';

interface Props {
  data: schemas['StateChange'];
  chainData?: ClusterChainConfig;
  isLoading?: boolean;
}

const TxStateTableItem = ({ data, chainData, isLoading }: Props) => {
  const { before, after, change, tag, tokenId } = getStateElements(data, isLoading, chainData?.app_config);

  return (
    <TableRow>
      <TableCell>
        <Box py="3px">
          { tag }
        </Box>
      </TableCell>
      <TableCell>
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
          my="7px"
        />
      </TableCell>
      <TableCell isNumeric><Box py="7px">{ before }</Box></TableCell>
      <TableCell isNumeric><Box py="7px">{ after }</Box></TableCell>
      <TableCell isNumeric><Box py="7px">{ change }</Box></TableCell>
      <TableCell>{ tokenId }</TableCell>
    </TableRow>
  );
};

export default React.memo(TxStateTableItem);
