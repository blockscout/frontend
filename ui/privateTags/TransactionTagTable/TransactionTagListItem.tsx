import { Tag, HStack, Text, Flex } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { TransactionTag } from 'types/api/account';

import ListItemMobile from 'ui/shared/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';
import TransactionSnippet from 'ui/shared/TransactionSnippet';

interface Props {
  item: TransactionTag;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
}

const TransactionTagListItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <Flex alignItems="flex-start" flexDirection="column" maxW="100%">
        <TransactionSnippet hash={ item.transaction_hash }/>
        <HStack spacing={ 3 } mt={ 4 }>
          <Text fontSize="sm" fontWeight={ 500 }>Private tag</Text>
          <Tag>
            { item.name }
          </Tag>
        </HStack>
      </Flex>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
    </ListItemMobile>
  );
};

export default React.memo(TransactionTagListItem);
