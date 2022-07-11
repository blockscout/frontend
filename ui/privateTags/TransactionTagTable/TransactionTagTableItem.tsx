import React, { useCallback } from 'react';

import {
  Tag,
  Tr,
  Td,
  Icon,
  IconButton,
  HStack,
  Tooltip,
} from '@chakra-ui/react'

import EditIcon from '../../../icons/edit.svg';
import DeleteIcon from '../../../icons/delete.svg';

import AddressLinkWithTooltip from '../../shared/AddressLinkWithTooltip';

import type { TPrivateTagsTransactionItem } from '../../../data/privateTagsTransaction';

interface Props {
  item: TPrivateTagsTransactionItem;
  onEditClick: (data: TPrivateTagsTransactionItem) => void;
  onDeleteClick: (data: TPrivateTagsTransactionItem) => void;
}

const AddressTagTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.transaction }>
      <Td>
        <HStack spacing={ 4 }>
          <AddressLinkWithTooltip address={ item.transaction }/>
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
          <Tooltip label="Edit">
            <IconButton
              aria-label="edit"
              variant="iconBlue"
              w="30px"
              h="30px"
              onClick={ onItemEditClick }
              icon={ <Icon as={ EditIcon } w="20px" h="20px"/> }
            />
          </Tooltip>
          <Tooltip label="Delete">
            <IconButton
              aria-label="delete"
              variant="iconBlue"
              w="30px"
              h="30px"
              onClick={ onItemDeleteClick }
              icon={ <Icon as={ DeleteIcon } w="20px" h="20px"/> }
            />
          </Tooltip>
        </HStack>
      </Td>
    </Tr>
  )
};

export default AddressTagTableItem;
