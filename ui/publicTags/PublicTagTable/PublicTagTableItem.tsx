import {
  Tr,
  Td,
  VStack,
  Box,
  Skeleton,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { PublicTag } from 'types/api/account';

import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: PublicTag;
  isLoading?: boolean;
  onEditClick: (data: PublicTag) => void;
  onDeleteClick: (data: PublicTag) => void;
}

const PublicTagTableItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {
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
          { item.addresses_with_info.map((address) => (
            <AddressEntity
              key={ address.hash }
              address={ address }
              isLoading={ isLoading }
              fontWeight="600"
              py="2px"
            />
          )) }
        </VStack>
      </Td>
      <Td>
        <VStack spacing={ 2 } alignItems="baseline">
          { item.tags.split(';').map((tag) => <Tag key={ tag } isLoading={ isLoading } isTruncated>{ tag }</Tag>) }
        </VStack>
      </Td>
      <Td>
        <Skeleton fontSize="sm" fontWeight="500" py="2px" isLoaded={ !isLoading } display="inline-block">
          Submitted
        </Skeleton>
      </Td>
      <Td>
        <Box py="2px">
          <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
        </Box>
      </Td>
    </Tr>
  );
};

export default React.memo(PublicTagTableItem);
