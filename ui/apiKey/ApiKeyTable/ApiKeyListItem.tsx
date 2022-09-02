import React, { useCallback } from 'react';

import type { ApiKey } from 'types/api/account';

import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import ApiKeySnippet from 'ui/shared/ApiKeySnippet';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: ApiKey;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
}

const ApiKeyListItem = ({ item, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <AccountListItemMobile>
      <ApiKeySnippet apiKey={ item.api_key } name={ item.name }/>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
    </AccountListItemMobile>
  );
};

export default ApiKeyListItem;
