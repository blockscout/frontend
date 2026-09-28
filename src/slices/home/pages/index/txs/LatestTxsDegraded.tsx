// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import { clamp } from 'es-toolkit';
import { route } from 'nextjs-routes';
import React from 'react';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';
import { TX } from 'src/slices/tx/stubs/tx';

import { isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';

import config from 'src/config';

import { Link } from 'src/toolkit/chakra/link';
import { TableBody, TableContainerScrollable, TableRoot } from 'src/toolkit/chakra/table';

import LatestTxsDegradedNewItems from './LatestTxsDegradedNewItems';
import LatestTxsFallback from './LatestTxsFallback';
import LatestTxsItem, { LATEST_TXS_TABLE_MIN_WIDTH } from './LatestTxsItem';

const zetachainFeature = config.features.zetachain;

interface Props {
  maxNum: number;
}

const LatestTxsDegraded = ({ maxNum }: Props) => {
  const { txs, totalTxs, isError, isLoading, enable } = useHomeRpcDataContext();

  React.useEffect(() => {
    enable(true, 'latest-txs');
    return () => {
      enable(false, 'latest-txs');
    };
  }, [ enable ]);

  if (isError || !isPublicClientAvailable) {
    return <LatestTxsFallback/>;
  }

  const items = isLoading ? Array(maxNum).fill(TX) : txs.slice(0, maxNum);

  if (items.length === 0) {
    return <Box textStyle="sm">No latest transactions found.</Box>;
  }

  const txsUrl = route({ pathname: `/txs`, query: zetachainFeature.isEnabled ? { tab: 'evm' } : undefined });
  const overflow = clamp(totalTxs - maxNum, 0, Infinity);

  return (
    <>
      <AddressHighlightProvider>
        <Box mb={ 3 } textStyle="sm">
          <TableContainerScrollable>
            <LatestTxsDegradedNewItems overflow={ overflow } url={ txsUrl } isLoading={ isLoading }/>
            <TableRoot minW={ LATEST_TXS_TABLE_MIN_WIDTH }>
              <TableBody>
                { items.map(((tx, index) => (
                  <LatestTxsItem
                    key={ tx.hash + (isLoading ? index : '') }
                    tx={ tx }
                    isLoading={ isLoading }
                  />
                ))) }
              </TableBody>
            </TableRoot>
          </TableContainerScrollable>
        </Box>
      </AddressHighlightProvider>
      <Flex justifyContent="center">
        <Link textStyle="sm" loading={ isLoading } href={ txsUrl }>View all transactions</Link>
      </Flex>
    </>
  );
};

export default React.memo(LatestTxsDegraded);
