// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultCellsProps } from './types';

import * as BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import Time from 'src/shared/date-and-time/Time';
import { route } from 'src/shared/router/routes';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

const SearchResultBlockCells = ({ data, searchTerm, isLoading, onLinkClick }: SearchResultCellsProps<'block'>) => {
  const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
  const isFutureBlock = data.timestamp === undefined && !isLoading;
  const href = isFutureBlock ?
    route({ pathname: '/block/countdown/[height]', query: { height: String(data.block_number) } }) :
    route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: data.block_hash ?? String(data.block_number) } });
  const blockTypeTag = !isLoading && data.block_type !== 'block' ? data.block_type : undefined;

  return (
    <>
      <TableCell>
        <BlockEntity.Container>
          <BlockEntity.Icon isLoading={ isLoading }/>
          <BlockEntity.Link
            href={ href }
            onClick={ onLinkClick }
            isLoading={ isLoading }
          >
            <BlockEntity.Content
              asProp={ shouldHighlightHash ? 'span' : 'mark' }
              number={ Number(data.block_number) }
              textStyle="sm"
              fontWeight={ 700 }
              isLoading={ isLoading }
            />
          </BlockEntity.Link>
        </BlockEntity.Container>
      </TableCell>
      <TableCell fontSize="sm" verticalAlign="middle" colSpan={ isFutureBlock ? 2 : 1 }>
        { isFutureBlock ? (
          <Skeleton loading={ isLoading }>Learn estimated time for this block to be created.</Skeleton>
        ) : (
          <Flex columnGap={ 2 } alignItems="center">
            { blockTypeTag === 'reorg' && <Tag flexShrink={ 0 }>Reorg</Tag> }
            { blockTypeTag === 'uncle' && <Tag flexShrink={ 0 }>Uncle</Tag> }
            <Skeleton loading={ isLoading } overflow="hidden" whiteSpace="nowrap" display="block">
              <Truncate value={ data.block_hash } as={ shouldHighlightHash ? 'mark' : 'span' }/>
            </Skeleton>
          </Flex>
        ) }
      </TableCell>
      { !isFutureBlock && data.timestamp && (
        <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
          <Skeleton loading={ isLoading } color="text.secondary">
            <Time timestamp={ data.timestamp } format="lll_s"/>
          </Skeleton>
        </TableCell>
      ) }
    </>
  );
};

export default React.memo(SearchResultBlockCells);
