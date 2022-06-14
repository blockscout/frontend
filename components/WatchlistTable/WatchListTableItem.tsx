import React from 'react';

import {
  Tag,
  Tr,
  Td,
  Switch,
  Icon,
  HStack,
} from '@chakra-ui/react'

import { FaEdit, FaTrash } from 'react-icons/fa';

import type { TWatchlistItem } from '../../data/watchlist';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: TWatchlistItem;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const WatchlistTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  return (
    <Tr alignItems="top" key={ item.address }>
      <Td><WatchListAddressItem item={ item }/></Td>
      <Td><Tag>{ item.tag }</Tag></Td>
      <Td><Switch colorScheme="green" size="md" isChecked={ item.notification }/></Td>
      <Td>
        <HStack spacing="30px">
          <Icon as={ FaEdit } w="20px" h="20px" cursor="pointer" color="blue.500" onClick={ onEditClick }/>
          <Icon as={ FaTrash } w="20px" h="20px" cursor="pointer" color="red.200" onClick={ onDeleteClick }/>
        </HStack>
      </Td>
    </Tr>
  )
};

export default WatchlistTableItem;
