// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { CctxListItem } from '@blockscout/zetachain-cctx-types';

import AddressFromTo from 'client/slices/address/components/from-to/AddressFromTo';

import TxEntityZetaChainCC from 'client/features/chain-variants/zeta-chain/components/TxEntityZetaChainCC';
import ZetaChainCCTXReducedStatus from 'client/features/chain-variants/zeta-chain/components/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'client/features/chain-variants/zeta-chain/components/ZetaChainCCTXValue';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import { SECOND } from 'toolkit/utils/consts';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  tx: CctxListItem;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  animation?: string;
};

const ZetaChainCCTxsTableItem = ({ tx, enableTimeIncrement, isLoading, animation }: Props) => {
  return (
    <TableRow key={ tx.index } animation={ animation }>
      <TableCell pr={ 4 }>
        <HStack alignItems="start" lineHeight="24px">
          <TxEntityZetaChainCC
            hash={ tx.index }
            isLoading={ isLoading }
            fontWeight="bold"
            noIcon
            maxW="100%"
            truncation="constant"
          />
          <TimeWithTooltip
            timestamp={ Number(tx.last_update_timestamp) * SECOND }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text.secondary"
          />
        </HStack>
      </TableCell>
      <TableCell>
        <ZetaChainCCTXReducedStatus status={ tx.status_reduced } type="full" isLoading={ isLoading }/>
      </TableCell>
      <TableCell colSpan={ 2 }>
        <AddressFromTo
          from={{ hash: tx.sender_address, chainId: tx.source_chain_id.toString(), chainType: 'zeta' }}
          to={{ hash: tx.receiver_address, chainId: tx.target_chain_id.toString(), chainType: 'zeta' }}
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric>
        <ZetaChainCCTXValue
          coinType={ tx.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ tx.amount }
          decimals={ tx.decimals }
          isLoading={ isLoading }
          justifyContent="flex-end"
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ZetaChainCCTxsTableItem);
