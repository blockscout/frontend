// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import type { NovesResponseData } from 'src/features/tx-interpretation/noves/types/api';

import NovesFromTo from 'src/features/tx-interpretation/noves/components/NovesFromTo';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { SECOND } from 'src/toolkit/utils/consts';

type Props = {
  isPlaceholderData: boolean;
  tx: NovesResponseData;
  currentAddress: string;
};

const AddressAccountHistoryListItem = (props: Props) => {

  const parsedDescription = useMemo(() => {
    const description = props.tx.classificationData.description;

    return description.endsWith('.') ? description.substring(0, description.length - 1) : description;
  }, [ props.tx.classificationData.description ]);

  return (
    <ListItemMobile rowGap={ 4 } w="full">
      <Skeleton borderRadius="sm" loading={ props.isPlaceholderData } w="full">
        <Flex justifyContent="space-between" w="full">
          <Flex columnGap={ 2 }>
            <SpriteIcon
              name="lightning"
              height="5"
              width="5"
              color="icon.primary"
            />

            <Text fontSize="sm" fontWeight={ 500 }>
              Action
            </Text>
          </Flex>
          <TimeWithTooltip
            timestamp={ props.tx.rawTransactionData.timestamp * SECOND }
            color="text.secondary"
            borderRadius="sm"
            fontWeight={ 500 }
          />
        </Flex>
      </Skeleton>
      <Skeleton borderRadius="sm" loading={ props.isPlaceholderData }>
        <Link
          href={ `/tx/${ props.tx.rawTransactionData.transactionHash }` }
          fontWeight="bold"
          whiteSpace="break-spaces"
          wordBreak="break-word"
        >
          { parsedDescription }
        </Link>
      </Skeleton>

      <Box maxW="full">
        <NovesFromTo txData={ props.tx } currentAddress={ props.currentAddress } isLoaded={ !props.isPlaceholderData }/>
      </Box>
    </ListItemMobile>
  );
};

export default React.memo(AddressAccountHistoryListItem);
