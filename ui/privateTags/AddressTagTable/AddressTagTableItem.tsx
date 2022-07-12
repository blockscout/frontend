import React, { useCallback } from 'react';

import {
  Tag,
  Tr,
  Td,
  HStack,
  Tooltip,
} from '@chakra-ui/react'

import AddressIcon from '../../shared/AddressIcon';
import AddressLinkWithTooltip from '../../shared/AddressLinkWithTooltip';

import type { TPrivateTagsAddressItem } from '../../../data/privateTagsAddress';
import EditButton from '../../shared/EditButton';
import DeleteButton from '../../shared/DeleteButton';

interface Props {
  item: TPrivateTagsAddressItem;
  onEditClick: (data: TPrivateTagsAddressItem) => void;
  onDeleteClick: (data: TPrivateTagsAddressItem) => void;
}

const AddressTagTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.address }>
      <Td>
        <HStack spacing={ 4 }>
          <AddressIcon address={ item.address }/>
          <AddressLinkWithTooltip address={ item.address }/>
        </HStack>
      </Td>
      <Td>
        <Tooltip label={ item.tag }>
          <Tag variant="gray" lineHeight="24px">
            { item.tag }
          </Tag>
        </Tooltip>
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

export default AddressTagTableItem;
