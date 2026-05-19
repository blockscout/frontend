// SPDX-License-Identifier: LicenseRef-Blockscout

import React, { useCallback } from 'react';

import type { AddressTag } from 'client/features/account/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import TableItemActionButtons from 'client/features/account/components/TableItemActionButtons';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tag } from 'toolkit/chakra/tag';

interface Props {
  item: AddressTag;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
  isLoading: boolean;
}

const AddressTagTableItem = ({ item, onEditClick, onDeleteClick, isLoading }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <TableRow alignItems="top" key={ item.id }>
      <TableCell>
        <AddressEntity
          address={ item.address }
          isLoading={ isLoading }
          fontWeight="600"
          py="2px"
        />
      </TableCell>
      <TableCell whiteSpace="nowrap">
        <Tag loading={ isLoading } truncated>{ item.name }</Tag>
      </TableCell>
      <TableCell>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default AddressTagTableItem;
