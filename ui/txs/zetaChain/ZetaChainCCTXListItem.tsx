import { Flex, Grid, VStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { unknownAddress } from 'ui/shared/address/utils';
import AddressEntityWithExternalChain from 'ui/shared/entities/address/AddressEntityWithExternalChain';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TextSeparator from 'ui/shared/TextSeparator';
import ZetaChainCCTXStatusTag from 'ui/shared/zetaChain/ZetaChainCCTXStatusTag';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  tx: ZetaChainCCTX;
  isLoading?: boolean;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();

  const senderChain = tx.source_chain_id === config.chain.id ? undefined :
    (chainsConfig?.find((chain) => chain.chain_id.toString() === tx.source_chain_id) || null);
  const receiverChain = tx.target_chain_id === config.chain.id ? undefined :
    (chainsConfig?.find((chain) => chain.chain_id.toString() === tx.target_chain_id) || null);

  const separatorColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  return (
    <VStack
      width="100%"
      borderBottom="1px solid"
      borderColor="border.divider"
      py={ 3 }
      fontSize="sm"
      alignItems="start"
      gap={ 2 }
    >
      <ZetaChainCCTXStatusTag status={ tx.status_reduced } isLoading={ isLoading } type="full"/>
      <TxEntity hash={ tx.index } isLoading={ isLoading } truncation="constant_long" fontWeight={ 600 }/>
      <Flex color="text.secondary" gap={ 2 } justifyContent="start">
        { dayjs(Number(tx.created_timestamp) * 1000).fromNow() }
        <TextSeparator color={ separatorColor } mx={ 0 }/>
        { dayjs(Number(tx.created_timestamp) * 1000).format('llll') }
      </Flex>
      <Grid gridTemplateColumns="100px 1fr" gap={ 2 }>
        <Text>Sender</Text>
        <AddressEntityWithExternalChain
          address={{ ...unknownAddress, hash: tx.sender_address }}
          externalChain={ senderChain }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text>Receiver</Text>
        <AddressEntityWithExternalChain
          address={{ ...unknownAddress, hash: tx.receiver_address }}
          externalChain={ receiverChain }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text>Asset</Text>
        <ZetaChainCCTXValue tx={ tx } isLoading={ isLoading }/>
      </Grid>
    </VStack>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
