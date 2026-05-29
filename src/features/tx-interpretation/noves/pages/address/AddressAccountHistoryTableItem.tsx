// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import type { NovesResponseData } from 'src/features/tx-interpretation/noves/types/api';

import NovesFromTo from 'src/features/tx-interpretation/noves/components/NovesFromTo';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { SECOND } from 'src/toolkit/utils/consts';

type Props = {
  isPlaceholderData: boolean;
  tx: NovesResponseData;
  currentAddress: string;
};

const AddressAccountHistoryTableItem = (props: Props) => {

  const parsedDescription = useMemo(() => {
    const description = props.tx.classificationData.description;

    return description.endsWith('.') ? description.substring(0, description.length - 1) : description;
  }, [ props.tx.classificationData.description ]);

  return (
    <TableRow>
      <TableCell px={ 3 } py="18px" fontSize="sm" >
        <TimeWithTooltip
          timestamp={ props.tx.rawTransactionData.timestamp * SECOND }
          isLoading={ props.isPlaceholderData }
          color="text.secondary"
          borderRadius="sm"
          flexShrink={ 0 }
        />
      </TableCell>
      <TableCell px={ 3 } py="18px" fontSize="sm" >
        <Skeleton borderRadius="sm" loading={ props.isPlaceholderData }>
          <Box display="flex">
            <SpriteIcon
              name="lightning"
              height="5"
              width="5"
              color="icon.primary"
              mr="8px"
            />

            <Link
              href={ `/tx/${ props.tx.rawTransactionData.transactionHash }` }
              fontWeight="bold"
              whiteSpace="break-spaces"
              wordBreak="break-word"
            >
              { parsedDescription }
            </Link>
          </Box>
        </Skeleton>
      </TableCell>
      <TableCell px={ 3 } py="18px" fontSize="sm">
        <Box flexShrink={ 0 } >
          <NovesFromTo txData={ props.tx } currentAddress={ props.currentAddress } isLoaded={ !props.isPlaceholderData }/>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressAccountHistoryTableItem);
