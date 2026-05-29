// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { AddressTag } from 'src/features/account/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import TableItemActionButtons from 'src/features/account/components/TableItemActionButtons';

import ListItemMobile from 'src/shared/lists/ListItemMobile';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props {
  item: AddressTag;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
  isLoading?: boolean;
}

const AddressTagListItem = ({ item, onEditClick, onDeleteClick, isLoading }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <Flex alignItems="flex-start" flexDirection="column" maxW="100%">
        <AddressEntity
          address={ item.address }
          isLoading={ isLoading }
          fontWeight="600"
          w="100%"
        />
        <HStack gap={ 3 } mt={ 4 }>
          <Text textStyle="sm" fontWeight="medium">Private tag</Text>
          <Skeleton loading={ isLoading } display="inline-block" borderRadius="sm">
            <Tag>
              { item.name }
            </Tag>
          </Skeleton>
        </HStack>
      </Flex>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
    </ListItemMobile>
  );
};

export default React.memo(AddressTagListItem);
