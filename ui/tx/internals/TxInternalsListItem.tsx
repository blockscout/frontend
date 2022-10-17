import { Flex, Tag, Icon, Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import eastArrowIcon from 'icons/arrows/east.svg';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction;

const TxInternalsListItem = ({ type, from, to, value, success, error }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;

  return (
    <AccountListItemMobile rowGap={ 3 }>
      <Flex>
        <Tag colorScheme="cyan" mr={ 2 }>{ typeTitle }</Tag>
        <TxStatus status={ success ? 'ok' : 'error' } errorText={ error }/>
      </Flex>
      <Box w="100%" display="flex" columnGap={ 3 }>
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon hash={ from.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash }/>
        </Address>
        <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon hash={ to.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ to.hash }/>
        </Address>
      </Box>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Value { appConfig.network.currency }</Text>
        <Text fontSize="sm" variant="secondary">{ value }</Text>
      </HStack>
      { /* no gas limit in api yet */ }
      { /* <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Gas limit</Text>
        <Text fontSize="sm" variant="secondary">{ gasLimit.toLocaleString('en') }</Text>
      </HStack> */ }
    </AccountListItemMobile>
  );
};

export default TxInternalsListItem;
