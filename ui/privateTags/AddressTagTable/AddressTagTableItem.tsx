import {
  Tag,
  Tr,
  Td,
  Skeleton,
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
        <AddressSnippet address={ item.address } isLoading={ isLoading }/>
      </Td>
      <Td whiteSpace="nowrap">
        <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="sm" maxW="100%">
          <TruncatedTextTooltip label={ item.name }>
            <Tag>{ item.name }</Tag>
          </TruncatedTextTooltip>
        </Skeleton>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default AddressTagTableItem;
