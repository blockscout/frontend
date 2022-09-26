import { Flex, Tag, Icon, Box, HStack, Text } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import React from 'react';

import type ArrayElement from 'types/utils/ArrayElement';

import type { data } from 'data/txInternal';
import eastArrowIcon from 'icons/arrows/east.svg';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/tx/TxStatus';

type Props = ArrayElement<typeof data>;

const TxInternalsListItem = ({ type, status, from, to, value, gasLimit }: Props) => {
  return (
    <AccountListItemMobile rowGap={ 3 }>
      <Flex>
        <Tag colorScheme="cyan" mr={ 2 }>{ capitalize(type) }</Tag>
        <TxStatus status={ status }/>
      </Flex>
      <Box w="100%" display="flex" columnGap={ 3 }>
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon hash={ from }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from }/>
        </Address>
        <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
        <Address width="calc((100% - 48px) / 2)">
          <AddressIcon hash={ to }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ to }/>
        </Address>
      </Box>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Value xDAI</Text>
        <Text fontSize="sm" variant="secondary">{ value }</Text>
      </HStack>
      <HStack spacing={ 3 }>
        <Text fontSize="sm" fontWeight={ 500 }>Gas limit</Text>
        <Text fontSize="sm" variant="secondary">{ gasLimit.toLocaleString('en') }</Text>
      </HStack>
    </AccountListItemMobile>
  );
};

export default TxInternalsListItem;
