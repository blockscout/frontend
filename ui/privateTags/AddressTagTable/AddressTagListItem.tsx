import { Tag, Flex, HStack, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { AddressTag } from 'types/api/account';

import AddressSnippet from 'ui/shared/AddressSnippet';
import ListItemMobile from 'ui/shared/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: AddressTag;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
}

const AddressTagListItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <Flex alignItems="flex-start" flexDirection="column" maxW="100%">
        <AddressSnippet address={ item.address }/>
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

export default React.memo(AddressTagListItem);
