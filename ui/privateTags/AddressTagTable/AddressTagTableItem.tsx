import {
  Tr,
  Td,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { AddressTag } from 'types/api/account';

import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

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
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <AddressEntity
          address={ item.address }
          isLoading={ isLoading }
          fontWeight="600"
          py="2px"
        />
      </Td>
      <Td whiteSpace="nowrap">
        <Tag isLoading={ isLoading } isTruncated>{ item.name }</Tag>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default AddressTagTableItem;
