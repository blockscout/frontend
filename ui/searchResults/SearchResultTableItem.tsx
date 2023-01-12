import { Tr, Td, Text, Link, Flex, Icon, Box } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultItem } from 'types/api/search';

import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import highlightText from 'lib/highlightText';
import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultItem;
  searchTerm: string;
}

const SearchResultTableItem = ({ data, searchTerm }: Props) => {

  const content = (() => {
    switch (data.type) {
      case 'token': {
        const name = data.name + (data.symbol ? ` (${ data.symbol })` : '');
        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <TokenLogo boxSize={ 6 } hash={ data.address } name={ data.name } flexShrink={ 0 }/>
                <Link ml={ 2 } href={ link('token_index', { hash: data.address }) } fontWeight={ 700 } wordBreak="break-all">
                  <span dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}/>
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
          const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();
          return (
            <>
              <Td fontSize="sm">
                <Flex alignItems="center" overflow="hidden">
                  <AddressIcon address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }} mr={ 2 } flexShrink={ 0 }/>
                  <Link href={ link('address_index', { id: data.address }) } fontWeight={ 700 } overflow="hidden" whiteSpace="nowrap">
                    <Box as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
                      <HashStringShortenDynamic hash={ data.address }/>
                    </Box>
                  </Link>
                </Flex>
              </Td>
              <Td fontSize="sm" verticalAlign="middle">
                <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? data.name : highlightText(data.name, searchTerm) }}/>
              </Td>
            </>
          );
        }

        return (
          <Td colSpan={ 2 } fontSize="sm">
            <Address>
              <AddressIcon address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }} mr={ 2 } flexShrink={ 0 }/>
              <mark>
                <AddressLink hash={ data.address } type="address" fontWeight={ 700 }/>
              </mark>
            </Address>
          </Td>
        );
      }

      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();

        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
                <Link fontWeight={ 700 } href={ link('block', { id: String(data.block_number) }) }>
                  <Box as={ shouldHighlightHash ? 'span' : 'mark' }>{ data.block_number }</Box>
                </Link>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Box overflow="hidden" whiteSpace="nowrap" as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
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
              <mark>
                <AddressLink hash={ data.tx_hash } type="transaction" fontWeight={ 700 }/>
              </mark>
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
