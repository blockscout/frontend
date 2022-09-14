import {
  Tag,
  Tr,
  Td,
  Switch,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { TWatchlistItem } from 'types/client/account';

import useFetch from 'lib/hooks/useFetch';
import useToast from 'lib/hooks/useToast';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: TWatchlistItem;
  onEditClick: (data: TWatchlistItem) => void;
  onDeleteClick: (data: TWatchlistItem) => void;
}

const WatchlistTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const [ notificationEnabled, setNotificationEnabled ] = useState(item.notification_methods.email);
  const [ switchDisabled, setSwitchDisabled ] = useState(false);
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  const toast = useToast();
  const fetch = useFetch();

  const showToast = useCallback(() => {
    toast({
      position: 'top-right',
      description: 'There has been an error processing your request',
      colorScheme: 'red',
      status: 'error',
      variant: 'subtle',
      isClosable: true,
      icon: null,
    });
  }, [ toast ]);

  const { mutate } = useMutation(() => {
    setSwitchDisabled(true);
    const body = { ...item, notification_methods: { email: !notificationEnabled } };
    setNotificationEnabled(prevState => !prevState);
    return fetch(`/api/account1/watchlist/${ item.id }`, { method: 'PUT', body });
  }, {
    onError: () => {
      showToast();
      setNotificationEnabled(prevState => !prevState);
      setSwitchDisabled(false);
    },
    onSuccess: () => {
      setSwitchDisabled(false);
    },
  });

  const onSwitch = useCallback(() => {
    return mutate();
  }, [ mutate ]);

  return (
    <Tr alignItems="top" key={ item.address_hash }>
      <Td><WatchListAddressItem item={ item }/></Td>
      <Td>
        <TruncatedTextTooltip label={ item.name }>
          <Tag>
            { item.name }
          </Tag>
        </TruncatedTextTooltip>
      </Td>
      <Td>
        <Switch
          colorScheme="blue"
          size="md"
          isChecked={ notificationEnabled }
          onChange={ onSwitch }
          isDisabled={ switchDisabled }
          aria-label="Email notification"
        />
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
      </Td>
    </Tr>
  );
};

export default WatchlistTableItem;
