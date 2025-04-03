import { Grid, Text, Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { InteropTransactionInfo } from 'types/api/transaction';

import config from 'configs/app';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import InteropMessageDestinationTx from 'ui/interopMessages/InteropMessageDestinationTx';
import InteropMessageSourceTx from 'ui/interopMessages/InteropMessageSourceTx';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
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

  if (!hasInterop || !data) {
    return null;
  }

  const details = (
    <Grid
      gridTemplateColumns="100px 1fr"
      textStyle="sm"
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      px={ 4 }
      py={ 2 }
      mt={ 3 }
      w="100%"
      rowGap={ 4 }
      borderRadius="md"
    >
      <Text color="text.secondary">Message id</Text>
      <Text>{ data.nonce }</Text>
      <Text color="text.secondary">Interop status</Text>
      <Box>
        <InteropMessageStatus status={ data.status }/>
      </Box>
      <Text color="text.secondary">Sender</Text>
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
      <Text color="text.secondary">Target</Text>
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
      <Text color="text.secondary">Payload</Text>
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
        <DetailedInfo.ItemLabel
          hint="The originating transaction that initiated the cross-L2 message on the source chain"
          isLoading={ isLoading }
        >
          Interop source tx
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <InteropMessageSourceTx { ...data } isLoading={ isLoading }/>
          <CollapsibleDetails variant="secondary" noScroll ml={ 3 }>
            { details }
          </CollapsibleDetails>
        </DetailedInfo.ItemValue>
      </>
    );
  }

  if (data.relay_chain !== undefined) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint="The transaction that relays the cross-L2 message to its destination chain"
          isLoading={ isLoading }
        >
          Interop relay tx
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <InteropMessageDestinationTx { ...data } isLoading={ isLoading }/>
          <CollapsibleDetails variant="secondary" noScroll ml={ 3 }>
            { details }
          </CollapsibleDetails>
        </DetailedInfo.ItemValue>
      </>
    );
  }
  return null;
};

export default TxDetailsInterop;
