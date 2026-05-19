import React from 'react';

import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import PublicTagApplicationStatusBadge from './PublicTagApplicationStatusBadge';

interface Props {
  item: PublicTagApplicationRow;
  isLoading?: boolean;
  onEdit?: (item: PublicTagApplicationRow) => void;
}

const PublicTagApplicationsListItem = ({ item, isLoading, onEdit }: Props) => {
  const handleEdit = React.useCallback(() => {
    onEdit?.(item);
  }, [ item, onEdit ]);

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: item.address_hash }}
          truncation="constant"
          isLoading={ isLoading }
          fontWeight={ 600 }
          noIcon
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Tag name</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <span>{ item.tag_name }</span>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Type</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <span>{ item.tag_type }</span>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <PublicTagApplicationStatusBadge status={ item.status } reason={ item.reject_reason }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Submitted</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.inserted_at }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </ListItemMobileGrid.Value>

      { onEdit && item.status === 'pending' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>&nbsp;</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <button onClick={ handleEdit } style={{ cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default React.memo(PublicTagApplicationsListItem);
