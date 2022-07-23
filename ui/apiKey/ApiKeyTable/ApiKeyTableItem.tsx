import React, { useCallback } from 'react';

import {
  Tr,
  Td,
  HStack,
  Text,
} from '@chakra-ui/react'

import EditButton from 'ui/shared/EditButton';
import DeleteButton from 'ui/shared/DeleteButton';

import type { TApiKeyItem } from 'data/apiKey';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  item: TApiKeyItem;
  onEditClick: (data: TApiKeyItem) => void;
  onDeleteClick: (data: TApiKeyItem) => void;
}

const WatchlistTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.token }>
      <Td>
        <HStack>
          <Text fontSize="md" fontWeight={ 600 }>{ item.token }</Text>
          <CopyToClipboard text={ item.token }/>
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
  )
};

export default WatchlistTableItem;
