import { Tr, Td, Text, Link, Flex, Icon, Box } from '@chakra-ui/react';
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
                <Link ml={ 2 } href={ link('token_index', { hash: data.address }) } fontWeight={ 700 }>
                  <span>
                    { data.name }{ data.symbol ? ` (${ data.symbol })` : '' }
                  </span>
                </Link>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Box whiteSpace="nowrap" overflow="hidden">
                <HashStringShortenDynamic hash={ data.address }/>
              </Box>
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
                  <AddressLink fontWeight={ 700 } ml={ 2 } hash={ data.address }/>
                </Address>
              </Td>
              <Td fontSize="sm" verticalAlign="middle">
                { data.name }
              </Td>
            </>
          );
        }

        return (
          <Td colSpan={ 2 } fontSize="sm">
            <Address>
              <AddressIcon hash={ data.address }/>
              <AddressLink hash={ data.address } ml={ 2 } type="address" fontWeight={ 700 }/>
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
                <Link fontWeight={ 700 } href={ link('block', { id: String(data.block_number) }) }>
                  { data.block_number }
                </Link>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Box overflow="hidden" whiteSpace="nowrap">
                <HashStringShortenDynamic hash={ data.block_hash }/>
              </Box>
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
                <AddressLink hash={ data.tx_hash } type="transaction" fontWeight={ 700 }/>
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
      <Td fontSize="sm" textTransform="capitalize" verticalAlign="middle">
        <Text variant="secondary">
          { data.type }
        </Text>
      </Td>
    </Tr>
  );
};

export default React.memo(SearchResultTableItem);
