import {
  Tag,
  Tr,
  Td,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { AddressTag } from 'types/api/account';

import AddressSnippet from 'ui/shared/AddressSnippet';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

interface Props {
  item: AddressTag;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
}

const AddressTagTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <AddressSnippet address={ item.address_hash }/>
      </Td>
      <Td whiteSpace="nowrap">
        <TruncatedTextTooltip label={ item.name }>
          <Tag>
            { item.name }
          </Tag>
        </TruncatedTextTooltip>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
      </Td>
    </Tr>
  );
};

export default AddressTagTableItem;
