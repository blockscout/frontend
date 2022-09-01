import { HStack, Text, Box } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { ApiKey } from 'types/api/account';

import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: ApiKey;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
}

const ApiKeyListItem = ({ item, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <AccountListItemMobile>
      <Box>
        <HStack alignItems="flex-start">
          <Text fontSize="md" fontWeight={ 600 }>{ item.api_key }</Text>
          <CopyToClipboard text={ item.api_key }/>
        </HStack>
        <Text fontSize="sm" marginTop={ 0.5 } variant="secondary">{ item.name }</Text>
      </Box>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
    </AccountListItemMobile>
  );
};

export default ApiKeyListItem;
