import { Flex, Grid, VStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import dayjs from 'lib/date/dayjs';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import TextSeparator from 'ui/shared/TextSeparator';
import ZetaChainAddressEntity from 'ui/shared/zetaChain/ZetaChainAddressEntity';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

type Props = {
  tx: ZetaChainCCTX;
  isLoading?: boolean;
  animation?: string;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading, animation }: Props) => {
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
      animation={ animation }
    >
      <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading } type="full"/>
      <TxEntityZetaChainCC hash={ tx.index } isLoading={ isLoading } truncation="constant_long" fontWeight={ 600 }/>
      <Flex color="text.secondary" gap={ 2 } justifyContent="start">
        { dayjs(Number(tx.last_update_timestamp) * 1000).fromNow() }
        <TextSeparator color={ separatorColor } mx={ 0 }/>
        { dayjs(Number(tx.last_update_timestamp) * 1000).format('llll') }
      </Flex>
      <Grid gridTemplateColumns="100px 1fr" gap={ 2 }>
        <Text>Sender</Text>
        <ZetaChainAddressEntity
          hash={ tx.sender_address }
          chainId={ tx.source_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text>Receiver</Text>
        <ZetaChainAddressEntity
          hash={ tx.receiver_address }
          chainId={ tx.target_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text>Asset</Text>
        <ZetaChainCCTXValue
          coinType={ tx.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ tx.amount }
          decimals={ tx.decimals }
          isLoading={ isLoading }
        />
      </Grid>
    </VStack>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
