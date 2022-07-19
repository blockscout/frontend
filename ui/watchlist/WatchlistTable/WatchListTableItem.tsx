import React, { useCallback } from 'react';

import {
  Tag,
  Tr,
  Td,
  Switch,
  HStack,
} from '@chakra-ui/react'

import EditButton from 'ui/shared/EditButton';
import DeleteButton from 'ui/shared/DeleteButton';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import type { TWatchlistItem } from 'data/watchlist';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: TWatchlistItem;
  onEditClick: (data: TWatchlistItem) => void;
  onDeleteClick: (data: TWatchlistItem) => void;
}

const WatchlistTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.address }>
      <Td><WatchListAddressItem item={ item }/></Td>
      <Td>
        <TruncatedTextTooltip label={ item.tag }>
          <Tag variant="gray" lineHeight="24px">
            { item.tag }
          </Tag>
        </TruncatedTextTooltip>
      </Td>
      <Td><Switch colorScheme="blue" size="md" isChecked={ item.notification }/></Td>
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
