// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as adminRs from '@blockscout/admin-rs-types';
import type * as contractsInfo from '@blockscout/contracts-info-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import dayjs from 'src/shared/date-and-time/dayjs';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import VerifiedAddressesStatus from './VerifiedAddressesStatus';

interface Props {
  item: contractsInfo.VerifiedAddress;
  application: adminRs.TokenInfoSubmission | undefined;
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
      return <Skeleton loading height={ 6 } width="140px"/>;
    }

    if (!item.metadata?.tokenName) {
      return <span>Not a token</span>;
    }

    if (!application) {
      return <Link onClick={ handleAddClick }>Add details</Link>;
    }

    const token = {
      type: 'ERC-20' as const,
      icon_url: application.iconUrl,
      address_hash: application.tokenAddress,
      name: item.metadata?.tokenName,
      symbol: '',
      reputation: null,
    };

    return (
      <TokenEntity
        token={ token }
        noLink={ application.status === 'IN_PROCESS' }
        noCopy
        noSymbol
      />
    );
  })();

  return (
    <TableRow>
      <TableCell>
        <AddressEntity
          address={{ hash: item.contractAddress, is_contract: true }}
          isLoading={ isLoading }
          fontWeight="600"
        />
      </TableCell>
      <TableCell fontSize="sm" verticalAlign="middle" pr={ 1 }>
        { tokenInfo }
      </TableCell>
      <TableCell pl="0">
        { item.metadata?.tokenName && application && !isLoading ? (
          <Tooltip content="Edit" disabled={ isLoading } disableOnMobile>
            <IconButton
              aria-label="edit"
              variant="link"
              size="2xs"
              borderRadius="none"
              onClick={ handleEditClick }
            >
              <SpriteIcon name="edit"/>
            </IconButton>
          </Tooltip>
        ) : null }
      </TableCell>
      <TableCell fontSize="sm">
        <Skeleton loading={ isLoading } display="inline-block">
          <VerifiedAddressesStatus status={ item.metadata?.tokenName ? application?.status : undefined }/>
        </Skeleton>
      </TableCell>
      <TableCell fontSize="sm" color="text.secondary">
        <Skeleton loading={ isLoading } display="inline-block">
          { item.metadata?.tokenName && application ? dayjs(application.updatedAt).format('MMM DD, YYYY') : null }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(VerifiedAddressesTableItem);
