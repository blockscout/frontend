import { Grid, Link, useColorModeValue, Text, Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { InteropTransactionInfo } from 'types/api/transaction';

import config from 'configs/app';
import InteropMessageDestinationTx from 'ui/interopMessages/InteropMessageDestinationTx';
import InteropMessageSourceTx from 'ui/interopMessages/InteropMessageSourceTx';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityInterop from 'ui/shared/entities/address/AddressEntityInterop';
import InteropMessageStatus from 'ui/shared/statusTag/InteropMessageStatus';

const rollupFeature = config.features.rollup;

type Props = {
  data?: InteropTransactionInfo;
  isLoading: boolean;
};

const TxDetailsInterop = ({ data, isLoading }: Props) => {
  const hasInterop = rollupFeature.isEnabled && rollupFeature.interopEnabled;
  const [ isExpanded, setIsExpanded ] = React.useState(false);
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const toggleDetails = React.useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [ isExpanded ]);

  if (!hasInterop || !data) {
    return null;
  }

  const detailsLink = (
    <Link
      display="inline-block"
      fontSize="sm"
      textDecorationLine="underline"
      textDecorationStyle="dashed"
      color="text_secondary"
      onClick={ toggleDetails }
      ml={ 3 }
    >
      { isExpanded ? 'Hide details' : 'View details' }
    </Link>
  );

  const details = (
    <Grid
      gridTemplateColumns="100px 1fr"
      fontSize="sm"
      lineHeight={ 5 }
      bgColor={ bgColor }
      px={ 4 }
      py={ 2 }
      mt={ 3 }
      w="100%"
      rowGap={ 4 }
      borderRadius="md"
    >
      <Text color="text_secondary">Message id</Text>
      <Text>{ data.nonce }</Text>
      <Text color="text_secondary">Interop status</Text>
      <Box>
        <InteropMessageStatus status={ data.status }/>
      </Box>
      <Text color="text_secondary">Sender</Text>
      { data.init_chain !== undefined ? (
        <AddressEntityInterop
          chain={ data.init_chain }
          address={{ hash: data.sender }}
          isLoading={ isLoading }
          truncation="constant"
        />
      ) : (
        <AddressEntity address={{ hash: data.sender }} isLoading={ isLoading } truncation="constant"/>
      ) }
      <Text color="text_secondary">Target</Text>
      { data.relay_chain !== undefined ? (
        <AddressEntityInterop
          chain={ data.relay_chain }
          address={{ hash: data.target }}
          isLoading={ isLoading }
          truncation="constant"
        />
      ) : (
        <AddressEntity address={{ hash: data.target }} isLoading={ isLoading } truncation="constant"/>
      ) }
      <Text color="text_secondary">Payload</Text>
      <Flex overflow="hidden">
        <Text
          wordBreak="break-all"
          whiteSpace="normal"
          overflow="hidden"
          flex="1"
        >
          { data.payload }
        </Text>
        <CopyToClipboard text={ data.payload }/>
      </Flex>
    </Grid>
  );

  if (data.init_chain !== undefined) {
    return (
      <>
        <DetailsInfoItem.Label
          hint="The originating transaction that initiated the cross-L2 message on the source chain"
          isLoading={ isLoading }
        >
          Interop source tx
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          <InteropMessageSourceTx { ...data } isLoading={ isLoading }/>
          { detailsLink }
          { isExpanded && details }
        </DetailsInfoItem.Value>
      </>
    );
  }

  if (data.relay_chain !== undefined) {
    return (
      <>
        <DetailsInfoItem.Label
          hint="The transaction that relays the cross-L2 message to its destination chain"
          isLoading={ isLoading }
        >
          Interop relay tx
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          <InteropMessageDestinationTx { ...data } isLoading={ isLoading }/>
          { detailsLink }
          { isExpanded && details }
        </DetailsInfoItem.Value>
      </>
    );
  }
  return null;
};

export default TxDetailsInterop;
