import { Link } from '@chakra-ui/react';
import React from 'react';

import type { VerifiedAddress } from 'types/api/account';

import AddressSnippet from 'ui/shared/AddressSnippet';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

interface Props {
  item: VerifiedAddress;
  onAdd: (address: string) => void;
  onEdit: (item: VerifiedAddress) => void;
}

const VerifiedAddressesListItem = ({ item, onAdd }: Props) => {
  const handleAddClick = React.useCallback(() => {
    onAdd(item.contractAddress);
  }, [ item, onAdd ]);

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <AddressSnippet address={{ hash: item.contractAddress, is_contract: true, implementation_name: null }}/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label>Token Info</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Link onClick={ handleAddClick }>Add details</Link>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(VerifiedAddressesListItem);
