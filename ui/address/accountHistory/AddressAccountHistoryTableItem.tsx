import { Td, Tr, Skeleton, Box } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import type { NovesResponseData } from 'types/api/noves';

import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import NovesFromTo from 'ui/shared/Noves/NovesFromTo';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

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
    <Tr>
      <Td px={ 3 } py="18px" fontSize="sm" >
        <TimeAgoWithTooltip
          timestamp={ props.tx.rawTransactionData.timestamp * 1000 }
          isLoading={ props.isPlaceholderData }
          color="text_secondary"
          borderRadius="sm"
          flexShrink={ 0 }
        />
      </Td>
      <Td px={ 3 } py="18px" fontSize="sm" >
        <Skeleton borderRadius="sm" isLoaded={ !props.isPlaceholderData }>
          <Box display="flex">
            <IconSvg
              name="lightning"
              height="5"
              width="5"
              color="gray.500"
              mr="8px"
              _dark={{ color: 'gray.400' }}
            />

            <LinkInternal
              href={ `/tx/${ props.tx.rawTransactionData.transactionHash }` }
              fontWeight="bold"
              whiteSpace="break-spaces"
              wordBreak="break-word"
            >
              { parsedDescription }
            </LinkInternal>
          </Box>
        </Skeleton>
      </Td>
      <Td px={ 3 } py="18px" fontSize="sm">
        <Box flexShrink={ 0 } >
          <NovesFromTo txData={ props.tx } currentAddress={ props.currentAddress } isLoaded={ !props.isPlaceholderData }/>
        </Box>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressAccountHistoryTableItem);
