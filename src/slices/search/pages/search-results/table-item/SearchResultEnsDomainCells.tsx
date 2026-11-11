// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultCellsProps } from './types';

import * as EnsEntity from 'src/features/name-services/domains/components/EnsEntity';

import dayjs from 'src/shared/date-and-time/dayjs';
import { route } from 'src/shared/router/routes';
import highlightText from 'src/shared/texts/highlight-text';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell } from 'src/toolkit/chakra/table';

import { getDisplayedAddressHash } from './displayed-address-hash';
import { getEnsNamesCountLabel } from './ens-names-count';
import SearchResultHashCell from './SearchResultHashCell';

const SearchResultEnsDomainCells = ({ data, searchTerm, isLoading, addressFormat, onLinkClick }: SearchResultCellsProps<'ens_domain'>) => {
  const expiresText = data.ens_info?.expiry_date ? ` expires ${ dayjs(data.ens_info.expiry_date).fromNow() }` : '';
  const hash = getDisplayedAddressHash({ hash: data.address_hash, filecoinRobustAddress: data.filecoin_robust_address, addressFormat });
  const href = data.address_hash ?
    route({ pathname: '/address/[hash]', query: { hash: data.address_hash } }) :
    route({ pathname: '/name-services/domains/[name]', query: { name: data.ens_info.name } });
  const namesCountLabel = getEnsNamesCountLabel(data.ens_info.names_count);

  return (
    <>
      <TableCell fontSize="sm">
        <EnsEntity.Container>
          <EnsEntity.Icon
            protocol={ data.ens_info.protocol }
            protocolDapp={{
              url: data.ens_info.protocol_dapp_url,
              logo: data.ens_info.protocol_dapp_logo,
            }}/>
          <Link
            href={ href }
            fontWeight={ 700 }
            wordBreak="break-all"
            loading={ isLoading }
            onClick={ onLinkClick }
            overflow="hidden"
          >
            <Skeleton
              loading={ isLoading }
              dangerouslySetInnerHTML={{ __html: highlightText(data.ens_info.name, searchTerm) }}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            />
          </Link>
        </EnsEntity.Container>
      </TableCell>
      <SearchResultHashCell hash={ hash } isVerified={ data.is_smart_contract_verified }/>
      <TableCell>
        { namesCountLabel ?
          <chakra.span color="text.secondary"> ({ namesCountLabel })</chakra.span> :
          <chakra.span color="text.secondary">{ expiresText }</chakra.span> }
      </TableCell>
    </>
  );
};

export default React.memo(SearchResultEnsDomainCells);
