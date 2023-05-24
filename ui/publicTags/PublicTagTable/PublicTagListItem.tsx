import { VStack, Text, HStack, Skeleton } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { PublicTag } from 'types/api/account';

import AddressSnippet from 'ui/shared/AddressSnippet';
import Tag from 'ui/shared/chakra/Tag';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: PublicTag;
  isLoading?: boolean;
  onEditClick: (data: PublicTag) => void;
  onDeleteClick: (data: PublicTag) => void;
}

const PublicTagListItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <VStack spacing={ 3 } alignItems="flex-start" maxW="100%">
        <VStack spacing={ 4 } alignItems="unset" maxW="100%">
          { item.addresses_with_info.map((address) => <AddressSnippet key={ address.hash } address={ address } isLoading={ isLoading }/>) }
        </VStack>
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Public tags</Text>
          <HStack spacing={ 2 } alignItems="baseline">
            { item.tags.split(';').map((tag) => <Tag key={ tag } isLoading={ isLoading } isTruncated>{ tag }</Tag>) }
          </HStack>
        </HStack>
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Status</Text>
          <Skeleton fontSize="sm" color="text_secondary" isLoaded={ !isLoading } display="inline-block">
            <span>Submitted</span>
          </Skeleton>
        </HStack>
      </VStack>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
    </ListItemMobile>
  );
};

export default React.memo(PublicTagListItem);
