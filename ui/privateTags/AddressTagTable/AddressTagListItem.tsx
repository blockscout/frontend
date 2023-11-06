import { Tag, Flex, HStack, Text, Skeleton } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { AddressTag } from 'types/api/account';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: AddressTag;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
  isLoading?: boolean;
}

const AddressTagListItem = ({ item, onEditClick, onDeleteClick, isLoading }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <Flex alignItems="flex-start" flexDirection="column" maxW="100%">
        <AddressEntity
          address={ item.address }
          isLoading={ isLoading }
          fontWeight="600"
          w="100%"
        />
        <HStack spacing={ 3 } mt={ 4 }>
          <Text fontSize="sm" fontWeight={ 500 }>Private tag</Text>
          <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="sm">
            <Tag>
              { item.name }
            </Tag>
          </Skeleton>
        </HStack>
      </Flex>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
    </ListItemMobile>
  );
};

export default React.memo(AddressTagListItem);
