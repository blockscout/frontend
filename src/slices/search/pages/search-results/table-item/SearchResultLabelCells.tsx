// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultCellsProps } from './types';

import { route } from 'src/shared/router/routes';
import highlightText from 'src/shared/texts/highlight-text';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { TableCell } from 'src/toolkit/chakra/table';

import { getDisplayedAddressHash } from './displayed-address-hash';
import SearchResultHashCell from './SearchResultHashCell';

const SearchResultLabelCells = ({ data, searchTerm, isLoading, addressFormat, onLinkClick }: SearchResultCellsProps<'label'>) => {
  const hash = getDisplayedAddressHash({ hash: data.address_hash, filecoinRobustAddress: data.filecoin_robust_address, addressFormat });

  return (
    <>
      <TableCell>
        <Flex alignItems="center">
          <SpriteIcon name="publictags" boxSize={ 6 } mr={ 2 } color="icon.primary"/>
          <Link
            href={ route({ pathname: '/address/[hash]', query: { hash: data.address_hash } }) }
            fontWeight={ 700 }
            wordBreak="break-all"
            loading={ isLoading }
            onClick={ onLinkClick }
          >
            <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
          </Link>
        </Flex>
      </TableCell>
      <SearchResultHashCell hash={ hash } isVerified={ data.is_smart_contract_verified } verticalAlign="middle"/>
      <TableCell/>
    </>
  );
};

export default React.memo(SearchResultLabelCells);
