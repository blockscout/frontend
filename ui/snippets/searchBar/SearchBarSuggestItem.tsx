import { chakra, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultItem } from 'types/api/search';

import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import HashStringShorten from 'ui/shared/HashStringShorten';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultItem;
  isMobile: boolean | undefined;
}

const SearchBarSuggestItem = ({ data, isMobile }: Props) => {

  const url = (() => {
    switch (data.type) {
      case 'token': {
        return link('token_index', { hash: data.address });
      }
      case 'address': {
        return link('address_index', { id: data.address });
      }
      case 'transaction': {
        return link('tx', { id: data.tx_hash });
      }
      case 'block': {
        return link('block', { id: String(data.block_number) });
      }
    }
  })();

  const content = (() => {
    switch (data.type) {
      case 'token': {
        return (
          <>
            <Flex>
              <TokenLogo boxSize={ 6 } hash={ data.address } name={ data.name }/>
              <Text fontWeight={ 700 } ml={ 2 }>
                <span>{ data.name }</span>
                { data.symbol && <span> ({ data.symbol })</span> }
              </Text>
            </Flex>
            <Text variant="secondary" mt={ 2 } overflow="hidden" whiteSpace="nowrap">
              { isMobile ? <HashStringShorten hash={ data.address } isTooltipDisabled/> : data.address }
            </Text>
          </>
        );
      }
      case 'address': {
        return (
          <Address>
            <AddressIcon hash={ data.address }/>
            <Text fontWeight={ 700 } ml={ 2 }>{ data.name || data.address }</Text>
          </Address>
        );
      }
      case 'block': {
        return (
          <Text>
            { data.block_number }
          </Text>
        );
      }
      case 'transaction': {
        return (
          <Text>
            { data.tx_hash }
          </Text>
        );
      }
    }
  })();

  return (
    <chakra.a
      py={ 3 }
      px={ 1 }
      display="block"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderBottomWidth="1px"
      _last={{
        borderBottomWidth: '0',
      }}
      _hover={{
        bgColor: useColorModeValue('blue.50', 'gray.800'),
      }}
      fontSize="sm"
      href={ url }
    >
      { content }
    </chakra.a>
  );
};

export default React.memo(SearchBarSuggestItem);
