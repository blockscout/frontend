import React from 'react';

import {
  Tag,
  Tr,
  Td,
  Switch,
  Icon,
  HStack,
  useDisclosure,
} from '@chakra-ui/react'

import { FaEdit, FaTrash } from 'react-icons/fa';

import type { TWatchlistItem } from '../../data/watchlist';

import AddressModal from '../AddressModal/AddressModal';
import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: TWatchlistItem;
}

const WatchlistTableItem = ({ item }: Props) => {
  const modalProps = useDisclosure();
  return (
    <>
      <Tr alignItems="top" key={ item.address }>
        <Td><WatchListAddressItem item={ item }/></Td>
        <Td><Tag>{ item.tag }</Tag></Td>
        <Td><Switch colorScheme="green" size="md" isChecked={ item.notification }/></Td>
        <Td>
          <HStack spacing="30px">
            <Icon as={ FaEdit } w="20px" h="20px" cursor="pointer" color="blue.500" onClick={ modalProps.onOpen }/>
            <Icon as={ FaTrash } w="20px" h="20px" cursor="pointer" color="red.200"/>
          </HStack>
        </Td>
      </Tr>
      <AddressModal { ...modalProps } data={ item }/>
    </>
  )
};

export default WatchlistTableItem;
