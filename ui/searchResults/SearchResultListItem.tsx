import { Text, Flex, Icon, Box, chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { SearchResultItem } from 'types/api/search';

import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import highlightText from 'lib/highlightText';
import link from 'lib/link/link';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultItem;
  searchTerm: string;
}

const SearchResultListItem = ({ data, searchTerm }: Props) => {

  const firstRow = (() => {
    switch (data.type) {
      case 'token': {
        const name = data.name + (data.symbol ? ` (${ trimTokenSymbol(data.symbol) })` : '');

        return (
          <Flex alignItems="flex-start">
            <TokenLogo boxSize={ 6 } hash={ data.address } name={ data.name } flexShrink={ 0 }/>
            <LinkInternal ml={ 2 } href={ link('token_index', { hash: data.address }) } fontWeight={ 700 } wordBreak="break-all">
              <chakra.span dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}/>
            </LinkInternal>
          </Flex>
        );
      }

      case 'contract':
      case 'address': {
        const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();
        return (
          <Address>
            <AddressIcon address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }} mr={ 2 } flexShrink={ 0 }/>
            <Box as={ shouldHighlightHash ? 'mark' : 'span' } display="block" whiteSpace="nowrap" overflow="hidden">
              <AddressLink type="address" hash={ data.address } fontWeight={ 700 } display="block" w="100%"/>
            </Box>
          </Address>
        );
      }

      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        return (
          <Flex alignItems="center">
            <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
            <LinkInternal fontWeight={ 700 } href={ route({ pathname: '/block/[height]', query: { height: String(data.block_number) } }) }>
              <Box as={ shouldHighlightHash ? 'span' : 'mark' }>{ data.block_number }</Box>
            </LinkInternal>
          </Flex>
        );
      }

      case 'transaction': {
        return (
          <Flex alignItems="center" overflow="hidden">
            <Icon as={ txIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
            <chakra.mark display="block" overflow="hidden">
              <AddressLink hash={ data.tx_hash } type="transaction" fontWeight={ 700 } display="block"/>
            </chakra.mark>
          </Flex>
        );
      }
    }
  })();

  const secondRow = (() => {
    switch (data.type) {
      case 'token': {
        return (
          <HashStringShortenDynamic hash={ data.address }/>
        );
      }
      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        return (
          <Box as={ shouldHighlightHash ? 'mark' : 'span' } display="block" w="100%" whiteSpace="nowrap" overflow="hidden">
            <HashStringShortenDynamic hash={ data.block_hash }/>
          </Box>
        );
      }
      case 'contract':
      case 'address': {
        const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();
        return data.name ? <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? data.name : highlightText(data.name, searchTerm) }}/> : null;
      }

      default:
        return null;
    }
  })();

  return (
    <ListItemMobile py={ 3 } fontSize="sm" rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%" overflow="hidden" lineHeight={ 6 }>
        { firstRow }
        <Text variant="secondary" ml={ 8 } textTransform="capitalize">{ data.type }</Text>
      </Flex>
      { secondRow }
    </ListItemMobile>
  );
};

export default SearchResultListItem;
