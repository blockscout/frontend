import React, { useCallback } from 'react';

import type { ApiKey } from 'types/api/account';

import ApiKeySnippet from 'ui/shared/ApiKeySnippet';
import ListItemMobile from 'ui/shared/ListItemMobile';
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
    <ListItemMobile>
      <ApiKeySnippet apiKey={ item.api_key } name={ item.name }/>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
    </ListItemMobile>
  );
};

export default ApiKeyListItem;
