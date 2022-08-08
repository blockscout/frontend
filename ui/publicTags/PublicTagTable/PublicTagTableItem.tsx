import React, { useCallback } from 'react';

import {
  Box,
  Tag,
  Text,
  Tr,
  Td,
  HStack,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import type { TPublicTagItem, TPublicTagAddress, TPublicTag } from 'data/publicTags';
import EditButton from 'ui/shared/EditButton';
import DeleteButton from 'ui/shared/DeleteButton';

interface Props {
  item: TPublicTagItem;
  onEditClick: (data: TPublicTagItem) => void;
  onDeleteClick: (data: TPublicTagItem) => void;
}

const PublicTagTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  const secondaryColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <VStack spacing={ 4 } alignItems="unset">
          { item.addresses.map((adr: TPublicTagAddress) => {
            return (
              <HStack spacing={ 4 } key={ adr.address } overflow="hidden" alignItems="start">
                <AddressIcon address={ adr.address }/>
                <Box overflow="hidden">
                  <AddressLinkWithTooltip address={ adr.address }/>
                  { adr.addressName && <Text fontSize="sm" color={ secondaryColor } mt={ 0.5 }>{ adr.addressName }</Text> }
                </Box>
              </HStack>
            );
          }) }
        </VStack>
      </Td>
      <Td>
        <VStack spacing={ 2 } alignItems="baseline">
          { item.tags.map((tag: TPublicTag) => {
            return (
              <TruncatedTextTooltip label={ tag.name } key={ tag.name }>
                <Tag color={ tag.colorHex || 'gray.600' } background={ tag.backgroundHex || 'gray.200' } lineHeight="24px">
                  { tag.name }
                </Tag>
              </TruncatedTextTooltip>
            );
          }) }
        </VStack>
      </Td>
      <Td>
        <Text fontSize="sm" color={ secondaryColor }>{ item.date }</Text>
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

export default PublicTagTableItem;
