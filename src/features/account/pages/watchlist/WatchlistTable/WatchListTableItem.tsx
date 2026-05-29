// SPDX-License-Identifier: LicenseRef-Blockscout

import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { WatchlistAddress } from 'src/features/account/types/api';

import useApiFetch from 'src/api/hooks/useApiFetch';

import TableItemActionButtons from 'src/features/account/components/TableItemActionButtons';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Switch } from 'src/toolkit/chakra/switch';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';
import { toaster } from 'src/toolkit/chakra/toaster';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: WatchlistAddress;
  isLoading?: boolean;
  onEditClick: (data: WatchlistAddress) => void;
  onDeleteClick: (data: WatchlistAddress) => void;
  hasEmail: boolean;
}

const WatchListTableItem = ({ item, isLoading, onEditClick, onDeleteClick, hasEmail }: Props) => {
  const [ notificationEnabled, setNotificationEnabled ] = useState(item.notification_methods.email);
  const [ switchDisabled, setSwitchDisabled ] = useState(false);
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  const apiFetch = useApiFetch();

  const showErrorToast = useCallback(() => {
    toaster.error({
      title: 'Error',
      description: 'There has been an error processing your request',
    });
  }, [ ]);

  const showNotificationToast = useCallback((isOn: boolean) => {
    toaster.success({
      title: 'Success',
      description: isOn ? 'Email notification is ON' : 'Email notification is OFF',
    });
  }, [ ]);

  const { mutate } = useMutation<WatchlistAddress>({
    mutationFn: () => {
      setSwitchDisabled(true);
      const body = { ...item, notification_methods: { email: !notificationEnabled } };
      setNotificationEnabled(prevState => !prevState);
      return apiFetch('general:watchlist', {
        pathParams: { id: String(item.id) },
        fetchParams: { method: 'PUT', body },
      }) as Promise<WatchlistAddress>;
    },
    onError: () => {
      showErrorToast();
      setNotificationEnabled(prevState => !prevState);
      setSwitchDisabled(false);
    },
    onSuccess: (data) => {
      setSwitchDisabled(false);
      showNotificationToast(data.notification_methods.email);
    },
  });

  const onSwitch = useCallback(() => {
    return mutate();
  }, [ mutate ]);

  return (
    <TableRow alignItems="top" key={ item.address_hash }>
      <TableCell><WatchListAddressItem item={ item } isLoading={ isLoading }/></TableCell>
      <TableCell>
        <Tag loading={ isLoading } truncated>{ item.name }</Tag>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block">
          <Switch
            checked={ notificationEnabled }
            onCheckedChange={ onSwitch }
            disabled={ !hasEmail || switchDisabled }
            aria-label="Email notification"
          />
        </Skeleton>
      </TableCell>
      <TableCell>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default WatchListTableItem;
