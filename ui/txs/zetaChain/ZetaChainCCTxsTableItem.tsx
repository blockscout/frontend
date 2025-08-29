import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import CCTxEntityZetaChain from 'ui/shared/entities/tx/CCTxEntityZetaChain';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

type Props = {
  tx: ZetaChainCCTX;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  animation?: string;
};

const ZetaChainCCTxsTableItem = ({ tx, enableTimeIncrement, isLoading, animation }: Props) => {
  return (
    <TableRow key={ tx.index } animation={ animation }>
      <TableCell pr={ 4 }>
        <HStack alignItems="start" lineHeight="24px">
          <CCTxEntityZetaChain
            hash={ tx.index }
            isLoading={ isLoading }
            fontWeight="bold"
            noIcon
            maxW="100%"
            truncation="constant"
          />
          <TimeWithTooltip
            timestamp={ Number(tx.last_update_timestamp) * 1000 }
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
          from={{ hash: tx.sender_address }}
          to={{ hash: tx.receiver_address }}
          isLoading={ isLoading }
          zetaChainFromChainId={ tx.source_chain_id.toString() }
          zetaChainToChainId={ tx.target_chain_id.toString() }
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
