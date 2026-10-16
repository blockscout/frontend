// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransferColumnId } from '../../types/client';
import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TOKEN_TRANSFER_COLUMNS } from '../../utils/columns';
import { getTokenTransferKey } from '../../utils/get-token-transfer-key';
import TokenTransferCellByColumn from './TokenTransferCellByColumn';

// Throwaway proof of concept: the token transfers table rendered with CSS grid instead of <table>.
// Rows are `display: contents` wrappers so every cell is a direct grid child and columns size to content.

const COLUMN_MAX_WIDTHS: Partial<Record<TokenTransferColumnId, string>> = {
  from_to: '350px',
  asset: '240px',
};

interface Props {
  readonly columns: ReadonlyArray<TokenTransferColumnId>;
  readonly items: Array<schemas['TokenTransfer']> | undefined;
  readonly isLoading?: boolean;
  readonly resetKey?: string;
  readonly enableTimeIncrement?: boolean;
}

const TokenTransfersGrid = ({ columns, items, isLoading, resetKey, enableTimeIncrement }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  const getBaseKey = React.useCallback((item: schemas['TokenTransfer']) => getTokenTransferKey(item, undefined), []);
  const keys = useUniqueKeys(items, getBaseKey);

  const visibleColumns = React.useMemo(
    () => columns.map((id) => TOKEN_TRANSFER_COLUMNS.find((column) => column.id === id)).filter((column) => column !== undefined),
    [ columns ],
  );

  const gridTemplateColumns = React.useMemo(
    () => visibleColumns.map((column) => {
      const maxWidth = COLUMN_MAX_WIDTHS[column.id];
      return maxWidth ? `fit-content(${ maxWidth })` : 'auto';
    }).join(' '),
    [ visibleColumns ],
  );

  return (
    <AddressHighlightProvider>
      { /* contain: inline-size keeps the max-content grid from widening the page layout; the box overflows instead */ }
      <Box overflow="auto" maxH="70vh" css={{ contain: 'inline-size' }}>
        <Box
          role="table"
          display="grid"
          w="max-content"
          minW="100%"
          gridTemplateColumns={ gridTemplateColumns }
          alignItems="center"
          fontSize="sm"
          fontWeight="medium"
          fontVariant="normal"
          fontVariantLigatures="no-contextual"
        >
          <Box role="row" display="contents">
            { visibleColumns.map((column, columnIndex) => (
              <Box
                key={ column.id }
                role="columnheader"
                whiteSpace="nowrap"
                px="6px"
                py="10px"
                pl={ columnIndex === 0 ? 3 : undefined }
                pr={ columnIndex === visibleColumns.length - 1 ? 3 : undefined }
                borderTopLeftRadius={ columnIndex === 0 ? 'base' : undefined }
                borderTopRightRadius={ columnIndex === visibleColumns.length - 1 ? 'base' : undefined }
                textAlign={ column.isNumeric ? 'right' : undefined }
                position="sticky"
                top={ 0 }
                left={ columnIndex === 0 ? 0 : undefined }
                zIndex={ columnIndex === 0 ? 3 : 2 }
                color="table.header.fg"
                bg="bg.primary"
                bgImage="linear-gradient({colors.table.header.bg}, {colors.table.header.bg})"
              >
                { column.name }
                { column.id === 'timestamp' && <TimeFormatToggle/> }
              </Box>
            )) }
          </Box>
          { items?.slice(0, renderedItemsNum).map((item, index) => (
            <Box key={ keys[index] } role="row" display="contents">
              { visibleColumns.map((column, columnIndex) => (
                <Box
                  key={ column.id }
                  role="cell"
                  textAlign={ column.isNumeric ? 'right' : undefined }
                  justifyItems={ column.isNumeric ? 'end' : undefined }
                  minW={ 0 }
                  px="6px"
                  py={{ base: 2, lg: 3 }}
                  pl={ columnIndex === 0 ? 3 : undefined }
                  pr={ columnIndex === visibleColumns.length - 1 ? 3 : undefined }
                  alignSelf="stretch"
                  display="grid"
                  alignItems="center"
                  borderBottomWidth="1px"
                  borderColor="border.divider"
                  position={ columnIndex === 0 ? 'sticky' : undefined }
                  left={ columnIndex === 0 ? 0 : undefined }
                  zIndex={ columnIndex === 0 ? 1 : undefined }
                  bg={ columnIndex === 0 ? 'bg.primary' : undefined }
                >
                  <TokenTransferCellByColumn
                    column={ column.id }
                    item={ item }
                    isLoading={ isLoading }
                    chainConfig={ undefined }
                    baseAddress={ undefined }
                    tokenId={ undefined }
                    instance={ undefined }
                    enableTimeIncrement={ enableTimeIncrement }
                  />
                </Box>
              )) }
            </Box>
          )) }
        </Box>
        <div ref={ cutRef }/>
      </Box>
    </AddressHighlightProvider>
  );
};

export default React.memo(TokenTransfersGrid);
