import { Td, Tr, Link, Tooltip, IconButton, Icon } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication, VerifiedAddress } from 'types/api/account';

import editIcon from 'icons/edit.svg';
import dayjs from 'lib/date/dayjs';
import AddressSnippet from 'ui/shared/AddressSnippet';

import VerifiedAddressesStatus from './VerifiedAddressesStatus';
import VerifiedAddressesTokenSnippet from './VerifiedAddressesTokenSnippet';

interface Props {
  item: VerifiedAddress;
  application: TokenInfoApplication | undefined;
  onAdd: (address: string) => void;
  onEdit: (address: string) => void;
}

const VerifiedAddressesTableItem = ({ item, application, onAdd, onEdit }: Props) => {

  const handleAddClick = React.useCallback(() => {
    onAdd(item.contractAddress);
  }, [ item, onAdd ]);

  const handleEditClick = React.useCallback(() => {
    onEdit(item.contractAddress);
  }, [ item, onEdit ]);

  return (
    <Tr>
      <Td>
        <AddressSnippet address={{ hash: item.contractAddress, is_contract: true, implementation_name: null }}/>
      </Td>
      <Td fontSize="sm" verticalAlign="middle">
        { application ? (
          <VerifiedAddressesTokenSnippet application={ application }/>
        ) : (
          <Link onClick={ handleAddClick }>Add details</Link>
        ) }
      </Td>
      <Td>{ application ? (
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
      ) : null }</Td>
      <Td fontSize="sm"><VerifiedAddressesStatus status={ application?.status }/></Td>
      <Td fontSize="sm" color="text_secondary">{ dayjs(application?.updatedAt).format('MMM DD, YYYY') }</Td>
    </Tr>
  );
};

export default React.memo(VerifiedAddressesTableItem);
