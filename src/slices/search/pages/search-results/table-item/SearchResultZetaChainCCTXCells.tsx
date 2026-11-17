// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SearchResultCellsProps } from './types';

import * as TxEntity from 'src/slices/tx/components/entity/TxEntity';

import Time from 'src/shared/date-and-time/Time';
import { route } from 'src/shared/router/routes';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { TableCell } from 'src/toolkit/chakra/table';
import { SECOND } from 'src/toolkit/utils/consts';

const SearchResultZetaChainCCTXCells = ({ data, searchTerm, isLoading, onLinkClick }: SearchResultCellsProps<'zetaChainCCTX'>) => {
  return (
    <>
      <TableCell colSpan={ 2 } fontSize="sm">
        <TxEntity.Container>
          <SpriteIcon name="interop" boxSize={ 5 } marginRight={ 1 } color="text.secondary"/>
          <TxEntity.Link
            isLoading={ isLoading }
            hash={ data.cctx.index }
            href={ route({ pathname: '/cc/tx/[hash]', query: { hash: data.cctx.index } }) }
            onClick={ onLinkClick }
          >
            <TxEntity.Content
              asProp={ data.cctx.index === searchTerm ? 'mark' : 'span' }
              hash={ data.cctx.index }
              textStyle="sm"
              fontWeight={ 700 }
            />
          </TxEntity.Link>
        </TxEntity.Container>
      </TableCell>
      <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
        <Time timestamp={ Number(data.cctx.last_update_timestamp) * SECOND } color="text.secondary" format="lll_s"/>
      </TableCell>
    </>
  );
};

export default React.memo(SearchResultZetaChainCCTXCells);
