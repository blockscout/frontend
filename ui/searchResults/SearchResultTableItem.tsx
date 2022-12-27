import { Tr, Td, Text, Link, Flex, Icon } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultItem } from 'types/api/search';

import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultItem;
}

const SearchResultTableItem = ({ data }: Props) => {

  const content = (() => {
    switch (data.type) {
      case 'token': {
        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <TokenLogo boxSize={ 6 } hash={ data.address } name={ data.name }/>
                <Text fontWeight={ 700 } ml={ 2 }>
                  <span>{ data.name }</span>
                  { data.symbol && <span> ({ data.symbol })</span> }
                </Text>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Address>
                <AddressLink hash={ data.address } type="token"/>
              </Address>
            </Td>
          </>
        );
      }

      case 'contract':
      case 'address': {
        if (data.name) {
          return (
            <>
              <Td fontSize="sm">
                <Address>
                  <AddressIcon hash={ data.address }/>
                  <Text fontWeight={ 700 } ml={ 2 }>{ data.name }</Text>
                </Address>
              </Td>
              <Td fontSize="sm" verticalAlign="middle">
                <Address>
                  <AddressLink hash={ data.address } type="address"/>
                </Address>
              </Td>
            </>
          );
        }

        return (
          <Td colSpan={ 2 } fontSize="sm">
            <Address>
              <AddressIcon hash={ data.address }/>
              <AddressLink hash={ data.address } ml={ 2 } type="address"/>
            </Address>
          </Td>
        );
      }

      case 'block': {
        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
                <Text fontWeight={ 700 }>
                  { data.block_number }
                </Text>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Link overflow="hidden" whiteSpace="nowrap" display="block" href={ link('block', { id: String(data.block_number) }) }>
                <HashStringShortenDynamic hash={ data.block_hash }/>
              </Link>
            </Td>
          </>
        );
      }

      case 'transaction': {
        return (
          <Td colSpan={ 2 } fontSize="sm">
            <Flex alignItems="center">
              <Icon as={ txIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
              <Address>
                <AddressLink hash={ data.tx_hash } type="transaction"/>
              </Address>
            </Flex>
          </Td>
        );
      }
    }
  })();

  return (
    <Tr>
      { content }
      <Td fontSize="sm" textTransform="capitalize" verticalAlign="middle">{ data.type }</Td>
    </Tr>
  );
};

export default React.memo(SearchResultTableItem);
