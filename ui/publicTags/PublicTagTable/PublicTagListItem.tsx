import { Tag, VStack, Text, HStack } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { PublicTag } from 'types/api/account';

import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import AddressSnippet from 'ui/shared/AddressSnippet';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

interface Props {
  item: PublicTag;
  onEditClick: (data: PublicTag) => void;
  onDeleteClick: (data: PublicTag) => void;
}

const PublicTagListItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <AccountListItemMobile>
      <VStack spacing={ 3 } alignItems="flex-start" maxW="100%">
        <VStack spacing={ 4 } alignItems="unset" maxW="100%">
          { item.addresses.map((address) => <AddressSnippet key={ address } address={ address }/>) }
        </VStack>
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Public tags</Text>
          <HStack spacing={ 2 } alignItems="baseline">
            { item.tags.split(';').map((tag) => {
              return (
                <TruncatedTextTooltip label={ tag } key={ tag }>
                  <Tag>
                    { tag }
                  </Tag>
                </TruncatedTextTooltip>
              );
            }) }
          </HStack>
        </HStack>
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Status</Text>
          <Text fontSize="sm" variant="secondary">Submitted</Text>
        </HStack>
      </VStack>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
    </AccountListItemMobile>
  );
};

export default React.memo(PublicTagListItem);
