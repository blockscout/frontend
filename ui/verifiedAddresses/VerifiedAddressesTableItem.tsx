import { Td, Tr, Link, Tooltip, IconButton, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication, VerifiedAddress } from 'types/api/account';

import editIcon from 'icons/edit.svg';
import dayjs from 'lib/date/dayjs';
import AddressSnippet from 'ui/shared/AddressSnippet';
import Icon from 'ui/shared/chakra/Icon';

import VerifiedAddressesStatus from './VerifiedAddressesStatus';
import VerifiedAddressesTokenSnippet from './VerifiedAddressesTokenSnippet';

interface Props {
  item: VerifiedAddress;
  application: TokenInfoApplication | undefined;
  onAdd: (address: string) => void;
  onEdit: (address: string) => void;
  isLoading: boolean;
}

const VerifiedAddressesTableItem = ({ item, application, onAdd, onEdit, isLoading }: Props) => {

  const handleAddClick = React.useCallback(() => {
    if (isLoading) {
      return;
    }
    onAdd(item.contractAddress);
  }, [ isLoading, item.contractAddress, onAdd ]);

  const handleEditClick = React.useCallback(() => {
    if (isLoading) {
      return;
    }
    onEdit(item.contractAddress);
  }, [ isLoading, item.contractAddress, onEdit ]);

  const tokenInfo = (() => {
    if (isLoading) {
      return <Skeleton height={ 6 } width="140px"/>;
    }

    if (!item.metadata.tokenName) {
      return <span>Not a token</span>;
    }

    if (!application) {
      return <Link onClick={ handleAddClick }>Add details</Link>;
    }

    return <VerifiedAddressesTokenSnippet application={ application } name={ item.metadata.tokenName }/>;
  })();

  return (
    <Tr>
      <Td>
        <AddressSnippet address={{ hash: item.contractAddress, is_contract: true, implementation_name: null }} isLoading={ isLoading }/>
      </Td>
      <Td fontSize="sm" verticalAlign="middle" pr={ 1 }>
        { tokenInfo }
      </Td>
      <Td pl="0">
        { item.metadata.tokenName && application && !isLoading ? (
          <Tooltip label={ isLoading ? undefined : 'Edit' }>
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
        ) : null }
      </Td>
      <Td fontSize="sm">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          <VerifiedAddressesStatus status={ item.metadata.tokenName ? application?.status : undefined }/>
        </Skeleton>
      </Td>
      <Td fontSize="sm" color="text_secondary">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { item.metadata.tokenName && application ? dayjs(application.updatedAt).format('MMM DD, YYYY') : null }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(VerifiedAddressesTableItem);
