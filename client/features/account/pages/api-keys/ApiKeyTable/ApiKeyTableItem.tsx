// SPDX-License-Identifier: LicenseRef-Blockscout

import React, { useCallback } from 'react';

import type { ApiKey } from 'client/features/account/types/api';

import TableItemActionButtons from 'client/features/account/components/TableItemActionButtons';
import ApiKeySnippet from 'client/features/account/pages/api-keys/ApiKeySnippet';

import { TableCell, TableRow } from 'toolkit/chakra/table';

interface Props {
  item: ApiKey;
  isLoading?: boolean;
  onEditClick: (item: ApiKey) => void;
  onDeleteClick: (item: ApiKey) => void;
}

const ApiKeyTableItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <TableRow alignItems="top" key={ item.api_key }>
      <TableCell>
        <ApiKeySnippet apiKey={ item.api_key } name={ item.name } isLoading={ isLoading }/>
      </TableCell>
      <TableCell>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default ApiKeyTableItem;
