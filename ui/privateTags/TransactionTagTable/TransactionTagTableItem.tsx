import {
  Tr,
  Td,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { TransactionTag } from 'types/api/account';

import Tag from 'ui/shared/chakra/Tag';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';
import TransactionSnippet from 'ui/shared/TransactionSnippet';

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
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <TransactionSnippet hash={ item.transaction_hash } isLoading={ isLoading }/>
      </Td>
      <Td>
        <Tag isLoading={ isLoading } isTruncated>{ item.name }</Tag>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default TransactionTagTableItem;
