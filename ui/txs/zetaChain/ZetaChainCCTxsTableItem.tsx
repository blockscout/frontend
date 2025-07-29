import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import ZetaChainAddressFromTo from 'ui/shared/zetaChain/ZetaChainAddressFromTo';
import ZetaChainCCTXStatusTag from 'ui/shared/zetaChain/ZetaChainCCTXStatusTag';
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
          <TxEntity
            hash={ tx.index }
            isLoading={ isLoading }
            fontWeight="bold"
            noIcon
            maxW="100%"
            truncation="constant"
          />
          <TimeWithTooltip
            timestamp={ Number(tx.created_timestamp) * 1000 }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text.secondary"
          />
        </HStack>
      </TableCell>
      <TableCell>
        <ZetaChainCCTXStatusTag status={ tx.status_reduced } type="full" isLoading={ isLoading }/>
      </TableCell>
      <TableCell colSpan={ 2 }>
        <ZetaChainAddressFromTo tx={ tx } isLoading={ isLoading }/>
      </TableCell>
      <TableCell>
        <ZetaChainCCTXValue tx={ tx } isLoading={ isLoading } justifyContent="end"/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ZetaChainCCTxsTableItem);
