import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useInitialList from 'lib/hooks/useInitialList';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ZetaChainCCTxsTableItem from './ZetaChainCCTxsTableItem';

type Props = {
  txs: Array<ZetaChainCCTX>;
  top: number;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
};

const TxsTable = ({
  txs,
  top,
  enableTimeIncrement,
  isLoading,
}: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(txs, !isLoading);
  const initialList = useInitialList({
    data: txs ?? [],
    idFn: (item) => item.index,
    enabled: !isLoading,
  });

  return (
    <AddressHighlightProvider>
      <TableRoot minWidth="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader width="300px">
              CCTx hash
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader width="105px">
              Status
            </TableColumnHeader>
            <TableColumnHeader width="200px">Sender</TableColumnHeader>
            <TableColumnHeader width="165px">Receiver</TableColumnHeader>
            <TableColumnHeader width="100%" isNumeric>Value</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { txs.slice(0, renderedItemsNum).map((item, index) => (
            <ZetaChainCCTxsTableItem
              key={ item.index + (isLoading ? index : '') }
              tx={ item }
              enableTimeIncrement={ enableTimeIncrement }
              isLoading={ isLoading }
              animation={ initialList.getAnimationProp(item) }
            />
          )) }
        </TableBody>
      </TableRoot>
      <div ref={ cutRef }/>
    </AddressHighlightProvider>
  );
};

export default React.memo(TxsTable);
