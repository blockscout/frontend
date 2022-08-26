import {
  Box,
  Tag,
  Tr,
  Td,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { PublicTag } from 'types/api/account';

import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
import DeleteButton from 'ui/shared/DeleteButton';
import EditButton from 'ui/shared/EditButton';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

interface Props {
  item: PublicTag;
  onEditClick: (data: PublicTag) => void;
  onDeleteClick: (data: PublicTag) => void;
}

const PublicTagTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <VStack spacing={ 4 } alignItems="unset">
          { item.addresses.map((address) => {
            return (
              <HStack spacing={ 4 } key={ address } overflow="hidden" alignItems="start">
                <AddressIcon address={ address }/>
                <Box overflow="hidden">
                  <AddressLinkWithTooltip address={ address }/>
                  { /* will be added later */ }
                  { /* <Text fontSize="sm" variant="secondary" mt={ 0.5 }>Address Name</Text> */ }
                </Box>
              </HStack>
            );
          }) }
        </VStack>
      </Td>
      <Td>
        <VStack spacing={ 2 } alignItems="baseline">
          { item.tags.split(';').map((tag) => {
            return (
              <TruncatedTextTooltip label={ tag } key={ tag }>
                <Tag variant="gray" lineHeight="24px">
                  { tag }
                </Tag>
              </TruncatedTextTooltip>
            );
          }) }
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="flex-start">
          <Text fontSize="sm" fontWeight="500">Submitted</Text>
        </VStack>
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

export default React.memo(PublicTagTableItem);
