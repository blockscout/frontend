// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import xss from 'xss';

import type { SearchResultCellsProps, SearchResultRowItemOfType } from './types';

import * as AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { toAddressModel } from 'src/slices/address/utils/model';
import ContractCertifiedLabel from 'src/slices/contract/components/ContractCertifiedLabel';

import dayjs from 'src/shared/date-and-time/dayjs';
import highlightText from 'src/shared/texts/highlight-text';

import { TableCell } from 'src/toolkit/chakra/table';
import { ADDRESS_REGEXP } from 'src/toolkit/utils/regexp';

import SearchResultMetadataTag from '../SearchResultMetadataTag';
import { getDisplayedAddressHash } from './displayed-address-hash';
import { getEnsNamesCountLabel } from './ens-names-count';

type AddressItem = SearchResultRowItemOfType<'address' | 'contract' | 'metadata_tag'>;

interface NameCellProps {
  data: AddressItem;
  name: string;
  searchTerm: string;
  shouldHighlightHash: boolean;
}

const SearchResultAddressNameCell = ({ data, name, searchTerm, shouldHighlightHash }: NameCellProps) => {
  const namesCountLabel = getEnsNamesCountLabel(data.ens_info?.names_count ?? 0);
  const expiresText = data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';

  return (
    <TableCell colSpan={ data.type === 'metadata_tag' ? 1 : 2 } verticalAlign="middle">
      <Flex alignItems="center">
        <Text
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? xss(name) : highlightText(name, searchTerm) }}/>
          { data.ens_info && <chakra.span color="text.secondary">{ namesCountLabel ?? expiresText }</chakra.span> }
        </Text>
        { data.certified && <ContractCertifiedLabel iconSize={ 4 } boxSize={ 4 } mx={ 1 }/> }
      </Flex>
    </TableCell>
  );
};

const SearchResultAddressCells = ({ data, searchTerm, addressFormat, onLinkClick }: SearchResultCellsProps<'address' | 'contract' | 'metadata_tag'>) => {
  const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
  const addressName = data.name || data.ens_info?.name;
  const isMetadataTag = data.type === 'metadata_tag';
  const address = toAddressModel({
    hash: data.address_hash,
    filecoin: {
      robust: data.filecoin_robust_address ?? null,
      actor_type: null,
      id: null,
    },
    is_contract: data.type === 'contract' || data.is_smart_contract_address,
    is_verified: data.is_smart_contract_verified,
  });
  const hash = getDisplayedAddressHash({ hash: data.address_hash, filecoinRobustAddress: undefined, addressFormat });

  return (
    <>
      <TableCell colSpan={ (addressName || isMetadataTag) ? 1 : 3 } verticalAlign="middle">
        <AddressEntity.Container address={ address }>
          <AddressEntity.Icon/>
          <AddressEntity.Link onClick={ onLinkClick }>
            <AddressEntity.Content
              asProp={ shouldHighlightHash ? 'mark' : 'span' }
              textStyle="sm"
              fontWeight={ 700 }
            />
          </AddressEntity.Link>
          <AddressEntity.Copy/>
        </AddressEntity.Container>
      </TableCell>
      { addressName && (
        <SearchResultAddressNameCell data={ data } name={ addressName } searchTerm={ searchTerm } shouldHighlightHash={ shouldHighlightHash }/>
      ) }
      { data.type === 'metadata_tag' && (
        <TableCell colSpan={ addressName ? 1 : 2 } verticalAlign="middle" textAlign="right">
          <SearchResultMetadataTag metadata={ data.metadata } addressHash={ hash } searchTerm={ searchTerm }/>
        </TableCell>
      ) }
    </>
  );
};

export default React.memo(SearchResultAddressCells);
