import { VStack, useColorModeValue } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { CustomAbi } from 'types/api/account';

import AddressSnippet from 'ui/shared/AddressSnippet';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: CustomAbi;
  onEditClick: (item: CustomAbi) => void;
  onDeleteClick: (item: CustomAbi) => void;
}

const CustomAbiListItem = ({ item, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <VStack
      gap={ 4 }
      alignItems="flex-start"
      paddingY={ 6 }
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderTopWidth="1px"
      _last={{
        borderBottomWidth: '1px',
      }}
    >
      <AddressSnippet address={ item.contract_address_hash } subtitle={ item.name }/>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
    </VStack>
  );
};

export default React.memo(CustomAbiListItem);
