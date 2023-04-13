import { Icon, IconButton, Link, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication, VerifiedAddress } from 'types/api/account';

import editIcon from 'icons/edit.svg';
import dayjs from 'lib/date/dayjs';
import AddressSnippet from 'ui/shared/AddressSnippet';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import VerifiedAddressesStatus from './VerifiedAddressesStatus';
import VerifiedAddressesTokenSnippet from './VerifiedAddressesTokenSnippet';

interface Props {
  item: VerifiedAddress;
  application: TokenInfoApplication | undefined;
  onAdd: (address: string) => void;
  onEdit: (address: string) => void;
}

const VerifiedAddressesListItem = ({ item, application, onAdd, onEdit }: Props) => {
  const handleAddClick = React.useCallback(() => {
    onAdd(item.contractAddress);
  }, [ item, onAdd ]);

  const handleEditClick = React.useCallback(() => {
    onEdit(item.contractAddress);
  }, [ item, onEdit ]);

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <AddressSnippet address={{ hash: item.contractAddress, is_contract: true, implementation_name: null }}/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label>Token Info</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py={ application ? '3px' : '5px' } display="flex" alignItems="center">
        { application ? (
          <>
            <VerifiedAddressesTokenSnippet application={ application }/>
            <Tooltip label="Edit">
              <IconButton
                aria-label="edit"
                variant="simple"
                boxSize={ 5 }
                borderRadius="none"
                flexShrink={ 0 }
                onClick={ handleEditClick }
                icon={ <Icon as={ editIcon }/> }
              />
            </Tooltip>
          </>
        ) : (
          <Link onClick={ handleAddClick }>Add details</Link>
        ) }
      </ListItemMobileGrid.Value>

      { application && (
        <>
          <ListItemMobileGrid.Label>Status</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <VerifiedAddressesStatus status={ application.status }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { application && (
        <>
          <ListItemMobileGrid.Label>Date</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            { dayjs(application.updatedAt).format('MMM DD, YYYY') }
          </ListItemMobileGrid.Value>
        </>
      ) }
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(VerifiedAddressesListItem);
