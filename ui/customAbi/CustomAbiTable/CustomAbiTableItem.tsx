import {
  Tr,
  Td,
  Box,
  Skeleton,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { CustomAbi } from 'types/api/account';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: CustomAbi;
  isLoading?: boolean;
  onEditClick: (item: CustomAbi) => void;
  onDeleteClick: (item: CustomAbi) => void;
}

const CustomAbiTableItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <Box maxW="100%">
          <AddressEntity
            address={ item.contract_address }
            fontWeight="600"
            isLoading={ isLoading }
          />
          <Skeleton fontSize="sm" color="text_secondary" mt={ 0.5 } ml={ 8 } display="inline-block" isLoaded={ !isLoading }>
            <span>{ item.name }</span>
          </Skeleton>
        </Box>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default React.memo(CustomAbiTableItem);
