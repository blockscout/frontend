import { chakra, Text, Flex, useColorModeValue, Icon, Box } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultItem } from 'types/api/search';

import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import highlightText from 'lib/highlightText';
import link from 'lib/link/link';
import AddressIcon from 'ui/shared/address/AddressIcon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultItem;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestItem = ({ data, isMobile, searchTerm }: Props) => {

  const url = (() => {
    switch (data.type) {
      case 'token': {
        return link('token_index', { hash: data.address });
      }
      case 'contract':
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

  const firstRow = (() => {
    switch (data.type) {
      case 'token': {
        const name = data.name + (data.symbol ? ` (${ data.symbol })` : '');

        return (
          <>
            <TokenLogo boxSize={ 6 } hash={ data.address } name={ data.name } flexShrink={ 0 }/>
            <Text fontWeight={ 700 } ml={ 2 } w="200px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" flexShrink={ 0 }>
              <span dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}/>
            </Text>
            { !isMobile && (
              <Text overflow="hidden" whiteSpace="nowrap" ml={ 2 } variant="secondary">
                <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
              </Text>
            ) }
          </>
        );
      }
      case 'contract':
      case 'address': {
        const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();
        return (
          <>
            <AddressIcon address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }} mr={ 2 } flexShrink={ 0 }/>
            <Box as={ shouldHighlightHash ? 'mark' : 'span' } display="block" overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
              <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
            </Box>
            { !isMobile && data.name && (
              <Text variant="secondary" ml={ 2 }>
                <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? data.name : highlightText(data.name, searchTerm) }}/>
              </Text>
            ) }
          </>
        );
      }
      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        return (
          <>
            <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
            <Box fontWeight={ 700 } as={ shouldHighlightHash ? 'span' : 'mark' }>{ data.block_number }</Box>
            { !isMobile && (
              <Text variant="secondary" overflow="hidden" whiteSpace="nowrap" ml={ 2 } as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
                <HashStringShortenDynamic hash={ data.block_hash } isTooltipDisabled/>
              </Text>
            ) }
          </>
        );
      }
      case 'transaction': {
        return (
          < >
            <Icon as={ txIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
            <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
              <HashStringShortenDynamic hash={ data.tx_hash } isTooltipDisabled/>
            </chakra.mark>
          </>
        );
      }
    }
  })();

  const secondRow = (() => {
    if (!isMobile) {
      return null;
    }

    switch (data.type) {
      case 'token': {
        return (
          <Text variant="secondary" whiteSpace="nowrap" overflow="hidden">
            <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
          </Text>
        );
      }
      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        return (
          <Text variant="secondary" whiteSpace="nowrap" overflow="hidden" as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
            <HashStringShortenDynamic hash={ data.block_hash } isTooltipDisabled/>
          </Text>
        );
      }
      case 'contract':
      case 'address': {
        if (!data.name) {
          return null;
        }

        const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();
        return (
          <Text variant="secondary" whiteSpace="nowrap" overflow="hidden">
            <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? data.name : highlightText(data.name, searchTerm) }}/>
          </Text>
        );
      }

      default: {
        return null;
      }
    }
  })();

  return (
    <chakra.a
      py={ 3 }
      px={ 1 }
      display="flex"
      flexDir="column"
      rowGap={ 2 }
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
      _first={{
        mt: 2,
      }}
    >
      <Flex display="flex" alignItems="center">
        { firstRow }
      </Flex>
      { secondRow }
    </chakra.a>
  );
};

export default React.memo(SearchBarSuggestItem);
