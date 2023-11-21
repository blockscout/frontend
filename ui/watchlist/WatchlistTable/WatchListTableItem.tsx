import {
  Tr,
  Td,
  Switch,
  Skeleton,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { WatchlistAddress } from 'types/api/account';

import useApiFetch from 'lib/api/useApiFetch';
import useToast from 'lib/hooks/useToast';
import Tag from 'ui/shared/chakra/Tag';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: WatchlistAddress;
  isLoading?: boolean;
  onEditClick: (data: WatchlistAddress) => void;
  onDeleteClick: (data: WatchlistAddress) => void;
}

const WatchlistTableItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {
  const [ notificationEnabled, setNotificationEnabled ] = useState(item.notification_methods.email);
  const [ switchDisabled, setSwitchDisabled ] = useState(false);
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  const errorToast = useToast();
  const apiFetch = useApiFetch();

  const showErrorToast = useCallback(() => {
    errorToast({
      position: 'top-right',
      description: 'There has been an error processing your request',
      colorScheme: 'red',
      status: 'error',
      variant: 'subtle',
      isClosable: true,
      icon: null,
    });
  }, [ errorToast ]);

  const notificationToast = useToast();
  const showNotificationToast = useCallback((isOn: boolean) => {
    notificationToast({
      position: 'top-right',
      description: isOn ? 'Email notification is ON' : 'Email notification is OFF',
      colorScheme: 'green',
      status: 'success',
      variant: 'subtle',
      title: 'Success',
      isClosable: true,
      icon: null,
    });
  }, [ notificationToast ]);

  const { mutate } = useMutation({
    mutationFn: () => {
      setSwitchDisabled(true);
      const body = { ...item, notification_methods: { email: !notificationEnabled } };
      setNotificationEnabled(prevState => !prevState);
      return apiFetch('watchlist', {
        pathParams: { id: item.id },
        fetchParams: { method: 'PUT', body },
      });
    },
    onError: () => {
      showErrorToast();
      setNotificationEnabled(prevState => !prevState);
      setSwitchDisabled(false);
    },
    onSuccess: () => {
      setSwitchDisabled(false);
      showNotificationToast(!notificationEnabled);
    },
  });

  const onSwitch = useCallback(() => {
    return mutate();
  }, [ mutate ]);

  return (
    <Tr alignItems="top" key={ item.address_hash }>
      <Td><WatchListAddressItem item={ item } isLoading={ isLoading }/></Td>
      <Td>
        <Tag isLoading={ isLoading } isTruncated>{ item.name }</Tag>
      </Td>
      <Td>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          <Switch
            colorScheme="blue"
            size="md"
            isChecked={ notificationEnabled }
            onChange={ onSwitch }
            isDisabled={ switchDisabled }
            aria-label="Email notification"
          />
        </Skeleton>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default WatchlistTableItem;
