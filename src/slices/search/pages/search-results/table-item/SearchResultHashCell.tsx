// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import type { TableCellProps } from 'src/toolkit/chakra/table';
import { TableCell } from 'src/toolkit/chakra/table';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

interface Props extends TableCellProps {
  hash: string | null | undefined;
  isVerified: boolean | null | undefined;
  isLoading?: boolean;
}

const SearchResultHashCell = ({ hash, isVerified, isLoading, ...rest }: Props) => {
  return (
    <TableCell { ...rest }>
      <Skeleton loading={ isLoading } display="flex" alignItems="center" overflow="hidden" whiteSpace="nowrap">
        { hash && (
          <Box overflow="hidden" whiteSpace="nowrap" w={ isVerified ? 'calc(100%-28px)' : 'unset' }>
            <Truncate value={ hash }/>
          </Box>
        ) }
        { isVerified && <SpriteIcon name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
      </Skeleton>
    </TableCell>
  );
};

export default React.memo(SearchResultHashCell);
