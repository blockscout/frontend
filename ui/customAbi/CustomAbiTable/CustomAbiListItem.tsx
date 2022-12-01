import React, { useCallback } from 'react';

import type { CustomAbi } from 'types/api/account';

import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
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
    <AccountListItemMobile>
      <AddressSnippet address={ item.contract_address_hash } subtitle={ item.name } isContract/>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
    </AccountListItemMobile>
  );
};

export default React.memo(CustomAbiListItem);
