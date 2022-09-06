import { Tag, Box, Switch, Text, HStack, Flex } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { TWatchlistItem } from 'types/client/account';

import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: TWatchlistItem;
  onEditClick: (data: TWatchlistItem) => void;
  onDeleteClick: (data: TWatchlistItem) => void;
}

const WatchListItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const [ notificationEnabled, setNotificationEnabled ] = useState(item.notification_methods.email);
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  const { mutate } = useMutation(() => {
    const data = { ...item, notification_methods: { email: !notificationEnabled } };
    return fetch(`/api/account/watchlist/${ item.id }`, { method: 'PUT', body: JSON.stringify(data) });
  }, {
    onError: () => {
      // eslint-disable-next-line no-console
      console.log('error');
    },
    onSuccess: () => {
      setNotificationEnabled(prevState => !prevState);
    },
  });

  const onSwitch = useCallback(() => {
    return mutate();
  }, [ mutate ]);

  return (
    <AccountListItemMobile>
      <Box maxW="100%">
        <WatchListAddressItem item={ item }/>
        <HStack spacing={ 3 } mt={ 6 }>
          <Text fontSize="sm" fontWeight={ 500 }>Private tag</Text>
          <Tag variant="gray" lineHeight="24px">
            { item.name }
          </Tag>
        </HStack>
      </Box>
      <Flex alignItems="center" justifyContent="space-between" mt={ 6 } w="100%">
        <HStack spacing={ 3 }>
          <Text fontSize="sm" fontWeight={ 500 }>Email notification</Text>
          <Switch colorScheme="blue" size="md" isChecked={ notificationEnabled } onChange={ onSwitch } aria-label="Email notification"/>
        </HStack>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
      </Flex>
    </AccountListItemMobile>
  );
};

export default WatchListItem;
