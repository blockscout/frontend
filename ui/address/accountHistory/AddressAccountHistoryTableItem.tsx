import { Td, Tr, Skeleton, Text, Box } from '@chakra-ui/react';
import React from 'react';

import type { NovesResponseData } from 'types/api/noves';

import dayjs from 'lib/date/dayjs';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/LinkInternal';
import NovesFromTo from 'ui/shared/Noves/NovesFromTo';

type Props = {
  isPlaceholderData: boolean;
  tx: NovesResponseData;
  currentAddress: string;
};

const AddressAccountHistoryTableItem = (props: Props) => {

  return (
    <Tr>
      <Td px={ 3 } py="18px" fontSize="sm" borderColor="gray.200">
        <Skeleton borderRadius="sm" flexShrink={ 0 } isLoaded={ !props.isPlaceholderData }>
          <Text as="span" color="text_secondary">
            { dayjs(props.tx.rawTransactionData.timestamp * 1000).fromNow() }
          </Text>
        </Skeleton>
      </Td>
      <Td px={ 3 } py="18px" fontSize="sm" borderColor="gray.200" >
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
              { props.tx.classificationData.description }
            </LinkInternal>
          </Box>
        </Skeleton>
      </Td>
      <Td px={ 3 } py="18px" fontSize="sm" borderColor="gray.200" >
        <Box flexShrink={ 0 } >
          <NovesFromTo txData={ props.tx } currentAddress={ props.currentAddress } isLoaded={ !props.isPlaceholderData }/>
        </Box>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressAccountHistoryTableItem);
