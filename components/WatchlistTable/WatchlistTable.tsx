import React from 'react';

import {
  Tag,
  Table,
  Thead,
  Tbody,
  Tr,
  TableContainer,
  Switch,
  Icon,
  HStack,
} from '@chakra-ui/react'
import { FaEdit, FaTrash } from 'react-icons/fa';

import { Th, Td } from '../Table/Table';

import type { TWatchlist } from '../../data/watchlist';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  data: TWatchlist;
}

const WatchlistTable = ({ data }: Props) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Address</Th>
            <Th>Private tag</Th>
            <Th>Notification</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map(item => {
            return (
              <Tr alignItems="top" key={ item.address }>
                <Td><WatchListAddressItem item={ item }/></Td>
                <Td><Tag>{ item.tag }</Tag></Td>
                <Td><Switch colorScheme="green" size="md" isChecked={ item.notification }/></Td>
                <Td>
                  <HStack spacing="30px">
                    <Icon as={ FaEdit } w="20px" h="20px" cursor="pointer" color="blue.500"/>
                    <Icon as={ FaTrash } w="20px" h="20px" cursor="pointer" color="red.500"/>
                  </HStack>
                </Td>
              </Tr>
            )
          }) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default WatchlistTable;
