// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultCellsProps } from './types';
import { isFungibleTokenType } from 'src/slices/token/utils/token-types';

import ContractCertifiedLabel from 'src/slices/contract/components/ContractCertifiedLabel';
import * as TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import { route } from 'src/shared/router/routes';
import highlightText from 'src/shared/texts/highlight-text';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell } from 'src/toolkit/chakra/table';

import { getDisplayedAddressHash } from './displayed-address-hash';
import SearchResultHashCell from './SearchResultHashCell';

const SearchResultTokenCells = ({ data, searchTerm, isLoading, addressFormat, onLinkClick }: SearchResultCellsProps<'token'>) => {
  const name = data.name + (data.symbol ? ` (${ data.symbol })` : '');
  const hash = getDisplayedAddressHash({ hash: data.address_hash, filecoinRobustAddress: data.filecoin_robust_address, addressFormat });
  const isFungible = isFungibleTokenType(data.token_type);

  return (
    <>
      <TableCell>
        <Flex alignItems="center">
          <TokenEntity.Icon token={{ ...data, type: data.token_type }} isLoading={ isLoading }/>
          <Link
            href={ route({ pathname: '/token/[hash]', query: { hash: data.address_hash } }) }
            fontWeight={ 700 }
            wordBreak="break-all"
            overflow="hidden"
            loading={ isLoading }
            onClick={ onLinkClick }
          >
            <Skeleton
              loading={ isLoading }
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}
            />
          </Link>
          { data.certified && <ContractCertifiedLabel iconSize={ 4 } boxSize={ 4 } ml={ 1 }/> }
          { data.is_verified_via_admin_panel && !data.certified && <SpriteIcon name="certified" boxSize={ 4 } ml={ 1 } color="green.500"/> }
          { data.reputation && <TokenEntity.Reputation value={ data.reputation }/> }
        </Flex>
      </TableCell>
      <SearchResultHashCell hash={ hash } isVerified={ data.is_smart_contract_verified } isLoading={ isLoading } verticalAlign="middle"/>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } whiteSpace="nowrap" overflow="hidden">
          <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" fontWeight={ 700 }>
            { isFungible && data.exchange_rate && `$${ Number(data.exchange_rate).toLocaleString() }` }
            { !isFungible && data.total_supply && `Items ${ Number(data.total_supply).toLocaleString() }` }
          </Text>
        </Skeleton>
      </TableCell>
    </>
  );
};

export default React.memo(SearchResultTokenCells);
