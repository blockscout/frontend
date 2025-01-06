import { Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import type { NovesResponseData } from 'types/api/noves';

import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NovesFromTo from 'ui/shared/Noves/NovesFromTo';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

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
      <Skeleton borderRadius="sm" isLoaded={ !props.isPlaceholderData } w="full">
        <Flex justifyContent="space-between" w="full">
          <Flex columnGap={ 2 }>
            <IconSvg
              name="lightning"
              height="5"
              width="5"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
            />

            <Text fontSize="sm" fontWeight={ 500 }>
              Action
            </Text>
          </Flex>
          <TimeAgoWithTooltip
            timestamp={ props.tx.rawTransactionData.timestamp * 1000 }
            color="text_secondary"
            borderRadius="sm"
            fontWeight={ 500 }
          />
        </Flex>
      </Skeleton>
      <Skeleton borderRadius="sm" isLoaded={ !props.isPlaceholderData }>
        <LinkInternal
          href={ `/tx/${ props.tx.rawTransactionData.transactionHash }` }
          fontWeight="bold"
          whiteSpace="break-spaces"
          wordBreak="break-word"
        >
          { parsedDescription }
        </LinkInternal>
      </Skeleton>

      <Box maxW="full">
        <NovesFromTo txData={ props.tx } currentAddress={ props.currentAddress } isLoaded={ !props.isPlaceholderData }/>
      </Box>
    </ListItemMobile>
  );
};

export default React.memo(AddressAccountHistoryListItem);
