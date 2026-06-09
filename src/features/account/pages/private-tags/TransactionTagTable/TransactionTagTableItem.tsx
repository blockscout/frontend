// SPDX-License-Identifier: LicenseRef-Blockscout

import React, { useCallback } from 'react';

import type { TransactionTag } from 'src/features/account/types/api';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TableItemActionButtons from 'src/features/account/components/TableItemActionButtons';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props {
  item: TransactionTag;
  isLoading?: boolean;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
}

const TransactionTagTableItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <TableRow alignItems="top" key={ item.id }>
      <TableCell>
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          fontWeight={ 600 }
        />
      </TableCell>
      <TableCell>
        <Tag loading={ isLoading } truncated>{ item.name }</Tag>
      </TableCell>
      <TableCell>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default TransactionTagTableItem;
