import {
  Tr,
  Td,
  HStack,
  Text,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { ApiKey } from 'types/api/account';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DeleteButton from 'ui/shared/DeleteButton';
import EditButton from 'ui/shared/EditButton';

interface Props {
  item: ApiKey;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
}

const WatchlistTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.api_key }>
      <Td>
        <HStack>
          <Text fontSize="md" fontWeight={ 600 }>{ item.api_key }</Text>
          <CopyToClipboard text={ item.api_key }/>
        </HStack>
        <Text fontSize="sm" marginTop={ 0.5 } variant="secondary">{ item.name }</Text>
      </Td>
      <Td>
        <HStack spacing={ 6 }>
          <EditButton onClick={ onItemEditClick }/>
          <DeleteButton onClick={ onItemDeleteClick }/>
        </HStack>
      </Td>
    </Tr>
  );
};

export default WatchlistTableItem;
