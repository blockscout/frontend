// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import TxStatus from 'src/slices/tx/components/TxStatus';

import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import { TX_INTERNALS_ITEMS } from '../../utils/utils';

interface Props {
  data: schemas['InternalTransaction'];
  isLoading?: boolean;
}

const TxInternalTableItem = ({ data, isLoading }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === data.type)?.title;
  const toData = data.to ? data.to : data.created_contract;

  return (
    <TableRow alignItems="top">
      <TableCell>
        <Flex rowGap={ 2 } flexWrap="wrap">
          { typeTitle && (
            <Box w="126px" display="inline-block">
              <Badge colorPalette="cyan" mr={ 5 } loading={ isLoading }>{ typeTitle }</Badge>
            </Box>
          ) }
          { !data.success && <TxStatus status="error" errorText={ data.error } isLoading={ isLoading }/> }
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle">
        <AddressFromTo
          from={ data.from }
          to={ toData }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <NativeCoinValue
          amount={ data.value }
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <NativeCoinValue
          amount={ data.gas_limit }
          units="wei"
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxInternalTableItem);
