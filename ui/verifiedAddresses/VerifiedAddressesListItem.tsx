import { IconButton, Link, Skeleton, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication, VerifiedAddress } from 'types/api/account';

import editIcon from 'icons/edit.svg';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import VerifiedAddressesStatus from './VerifiedAddressesStatus';

interface Props {
  item: VerifiedAddress;
  application: TokenInfoApplication | undefined;
  onAdd: (address: string) => void;
  onEdit: (address: string) => void;
  isLoading: boolean;
}

const VerifiedAddressesListItem = ({ item, application, onAdd, onEdit, isLoading }: Props) => {
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

    const token = {
      icon_url: application.iconUrl,
      address: application.tokenAddress,
      name: item.metadata.tokenName,
      symbol: '',
    };

    return (
      <>
        <TokenEntity
          token={ token }
          noLink={ application.status === 'IN_PROCESS' }
          noCopy
          noSymbol
        />
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
    );
  })();

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: item.contractAddress, is_contract: true, implementation_name: null }}
          isLoading={ isLoading }
          w="100%"
        />
      </ListItemMobileGrid.Value>

      { item.metadata.tokenName && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Token Info</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value display="flex" alignItems="center">
            { tokenInfo }
          </ListItemMobileGrid.Value>
        </>
      ) }

      { item.metadata.tokenName && application && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton isLoaded={ !isLoading } display="inline-block">
              <VerifiedAddressesStatus status={ application.status }/>
            </Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { item.metadata.tokenName && application && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Date</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton isLoaded={ !isLoading } display="inline-block">
              { dayjs(application.updatedAt).format('MMM DD, YYYY') }
            </Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) }
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(VerifiedAddressesListItem);
