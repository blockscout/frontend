// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SearchResultCellsProps } from './types';

import * as UserOpEntity from 'src/features/user-ops/components/entity/UserOpEntity';

import Time from 'src/shared/date-and-time/Time';

import { TableCell } from 'src/toolkit/chakra/table';

const SearchResultUserOpCells = ({ data, isLoading, onLinkClick }: SearchResultCellsProps<'user_operation'>) => {
  return (
    <>
      <TableCell colSpan={ 2 } fontSize="sm">
        <UserOpEntity.Container>
          <UserOpEntity.Icon/>
          <UserOpEntity.Link
            isLoading={ isLoading }
            hash={ data.user_operation_hash }
            onClick={ onLinkClick }
          >
            <UserOpEntity.Content
              asProp="mark"
              hash={ data.user_operation_hash }
              textStyle="sm"
              fontWeight={ 700 }
            />
          </UserOpEntity.Link>
        </UserOpEntity.Container>
      </TableCell>
      <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
        { data.timestamp && <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/> }
      </TableCell>
    </>
  );
};

export default React.memo(SearchResultUserOpCells);
