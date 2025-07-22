import React from 'react';

import type { FlashblockItem } from 'types/client/flashblocks';

import { TableCell, TableRow } from 'toolkit/chakra/table';

interface Props {
  data: FlashblockItem;
}

const FlashblocksTableItem = ({ data }: Props) => {
  return (
    <TableRow>
      <TableCell>
        { data.block_number } #{ data.index }
      </TableCell>
      <TableCell>
        { data.transactions_count }
      </TableCell>
      <TableCell>
        ???
      </TableCell>
    </TableRow>
  );
};

export default React.memo(FlashblocksTableItem);
