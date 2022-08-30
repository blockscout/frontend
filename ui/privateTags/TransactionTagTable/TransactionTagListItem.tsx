import { Tag, HStack, Text, Flex } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { TransactionTag } from 'types/api/account';

import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: TransactionTag;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
}

const TransactionTagListItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <AccountListItemMobile>
      <Flex alignItems="flex-start" flexDirection="column" maxW="100%">
        <AddressLinkWithTooltip address={ item.transaction_hash }/>
        <HStack spacing={ 3 } mt={ 4 }>
          <Text fontSize="sm" fontWeight={ 500 }>Private tag</Text>
          <Tag variant="gray" lineHeight="24px">
            { item.name }
          </Tag>
        </HStack>
      </Flex>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
    </AccountListItemMobile>
  );
};

export default React.memo(TransactionTagListItem);
