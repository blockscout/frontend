// SPDX-License-Identifier: LicenseRef-Blockscout

import React, { useCallback } from 'react';

import type { ApiKey } from 'src/features/account/types/api';

import TableItemActionButtons from 'src/features/account/components/TableItemActionButtons';
import ApiKeySnippet from 'src/features/account/pages/api-keys/ApiKeySnippet';

import ListItemMobile from 'src/shared/lists/ListItemMobile';

interface Props {
  item: ApiKey;
  isLoading?: boolean;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
}

const ApiKeyListItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <ApiKeySnippet apiKey={ item.api_key } name={ item.name } isLoading={ isLoading }/>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
    </ListItemMobile>
  );
};

export default ApiKeyListItem;
