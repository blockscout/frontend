import React from 'react';

import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import PublicTagApplicationStatusBadge from './PublicTagApplicationStatusBadge';

interface Props {
  items: Array<PublicTagApplicationRow>;
  top: number;
  isLoading?: boolean;
  onEdit?: (item: PublicTagApplicationRow) => void;
}

const PublicTagApplicationsTable = ({ items, top, isLoading, onEdit }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="800px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Address</TableColumnHeader>
          <TableColumnHeader>Tag name</TableColumnHeader>
          <TableColumnHeader>Type</TableColumnHeader>
          <TableColumnHeader>Status</TableColumnHeader>
          <TableColumnHeader>Submitted</TableColumnHeader>
          { onEdit && <TableColumnHeader/> }
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <PublicTagApplicationsTableItem
            key={ String(item.id) + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
            onEdit={ onEdit }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

interface ItemProps {
  item: PublicTagApplicationRow;
  isLoading?: boolean;
  onEdit?: (item: PublicTagApplicationRow) => void;
}

const PublicTagApplicationsTableItem = ({ item, isLoading, onEdit }: ItemProps) => {
  const handleEdit = React.useCallback(() => {
    onEdit?.(item);
  }, [ item, onEdit ]);

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={{ hash: item.address_hash }}
          truncation="constant"
          isLoading={ isLoading }
          fontWeight={ 600 }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <span>{ item.tag_name }</span>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <span>{ item.tag_type }</span>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <PublicTagApplicationStatusBadge status={ item.status } reason={ item.reject_reason }/>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.inserted_at }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      { onEdit && (
        <TableCell verticalAlign="middle">
          { item.status === 'pending' && (
            <Skeleton loading={ isLoading }>
              <button onClick={ handleEdit } style={{ cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
            </Skeleton>
          ) }
        </TableCell>
      ) }
    </TableRow>
  );
};

export default PublicTagApplicationsTable;
