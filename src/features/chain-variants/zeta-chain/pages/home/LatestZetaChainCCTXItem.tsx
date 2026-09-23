// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { CctxListItem } from '@blockscout/zetachain-cctx-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';

import TxEntityZetaChainCC from 'src/features/chain-variants/zeta-chain/components/TxEntityZetaChainCC';
import ZetaChainCCTXReducedStatus from 'src/features/chain-variants/zeta-chain/components/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'src/features/chain-variants/zeta-chain/components/ZetaChainCCTXValue';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { SECOND } from 'src/toolkit/utils/consts';

export const LATEST_ZETA_CHAIN_CCTXS_TABLE_MIN_WIDTH = '800px';

type Props = {
  tx: CctxListItem;
  isLoading?: boolean;
  animation?: string;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading, animation }: Props) => {
  return (
    <TableRow animation={ animation }>
      <TableCell w="36px">
        <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading }/>
      </TableCell>
      <TableCell w="160px">
        <TxEntityZetaChainCC truncation="constant" hash={ tx.index } isLoading={ isLoading } fontWeight={ 600 }/>
      </TableCell>
      <TableCell w="92px">
        <TimeWithTooltip
          color="text.secondary"
          timestamp={ Number(tx.last_update_timestamp) * SECOND }
          isLoading={ isLoading }
          timeFormat="relative"
        />
      </TableCell>
      <TableCell w="362px">
        <AddressFromTo
          from={{ hash: tx.sender_address, chainId: tx.source_chain_id.toString(), chainType: 'zeta' }}
          to={{ hash: tx.receiver_address, chainId: tx.target_chain_id.toString(), chainType: 'zeta' }}
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell>
        <ZetaChainCCTXValue
          coinType={ tx.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ tx.amount }
          decimals={ tx.decimals }
          isLoading={ isLoading }
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
