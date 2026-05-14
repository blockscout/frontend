// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TxStateChange } from 'client/slices/tx/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import { TableCell, TableRow } from 'toolkit/chakra/table';

import { getStateElements } from './utils';

interface Props {
  data: TxStateChange;
  isLoading?: boolean;
}

const TxStateTableItem = ({ data, isLoading }: Props) => {
  const { before, after, change, tag, tokenId } = getStateElements(data, isLoading);

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
