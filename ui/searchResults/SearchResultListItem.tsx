import { Text, Link, Flex, Icon } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultItem } from 'types/api/search';

import blockIcon from 'icons/block.svg';
import txIcon from 'icons/transactions.svg';
import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import ListItemMobile from 'ui/shared/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultItem;
}

const SearchResultListItem = ({ data }: Props) => {

  const firstRow = (() => {
    switch (data.type) {
      case 'token': {
        return (
          <Flex alignItems="center">
            <TokenLogo boxSize={ 6 } hash={ data.address } name={ data.name }/>
            <Link ml={ 2 } href={ link('token_index', { hash: data.address }) } fontWeight={ 700 }>
              { data.name }{ data.symbol ? ` (${ data.symbol })` : '' }
            </Link>
          </Flex>
        );
      }

      case 'contract':
      case 'address': {
        return (
          <Address>
            <AddressIcon hash={ data.address }/>
            <AddressLink hash={ data.address } ml={ 2 } fontWeight={ 700 }/>
          </Address>
        );
      }

      case 'block': {
        return (
          <Flex alignItems="center">
            <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
            <Link fontWeight={ 700 } href={ link('block', { id: String(data.block_number) }) }>
              { data.block_number }
            </Link>
          </Flex>
        );
      }

      case 'transaction': {
        return (
          <Flex alignItems="center" overflow="hidden">
            <Icon as={ txIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
            <Address>
              <AddressLink hash={ data.tx_hash } type="transaction" fontWeight={ 700 }/>
            </Address>
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
        return (
          <HashStringShortenDynamic hash={ data.block_hash }/>
        );
      }
      case 'contract':
      case 'address': {
        return data.name ? <Text>{ data.name }</Text> : null;
      }

      default:
        return null;
    }
  })();

  return (
    <ListItemMobile py={ 3 } fontSize="sm" rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%" overflow="hidden">
        { firstRow }
        <Text variant="secondary" ml={ 8 } textTransform="capitalize">{ data.type }</Text>
      </Flex>
      { secondRow }
    </ListItemMobile>
  );
};

export default SearchResultListItem;
