import { Flex, Grid, Text } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTXResponse } from 'types/api/zetaChain';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityWithExternalChain from 'ui/shared/entities/tx/TxEntityWithExternalChain';
// import StatusTag from 'ui/shared/statusTag/StatusTag';
import ZetaChainAddressEntity from 'ui/shared/zetaChain/ZetaChainAddressEntity';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  tx: ZetaChainCCTXResponse['inbound_params'];
  isLoading: boolean;
};

const ZetaChainCCTXDetailsLifecycleIn = ({ tx, isLoading }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const chainFrom = chainsConfig?.find((chain) => chain.chain_id === Number(tx.sender_chain_id));

  return (
    <Skeleton loading={ isLoading }>
      <Flex color={ tx.status === 'SUCCESS' ? 'text.success' : 'text.error' } maxH="20px" mb={ 2.5 } alignItems="center">
        { `Sender tx from ${ chainFrom?.chain_name || 'unknown chain' }` }
      </Flex>
      <Grid templateColumns="100px 1fr" rowGap={ 4 } columnGap={ 3 } bg="alert.bg.info" py={ 3 } px={ 4 } borderRadius="md">
        <Text color="text.secondary" fontWeight="medium">Transaction</Text>
        { chainFrom?.chain_id.toString() !== config.chain.id ? (
          <TxEntityWithExternalChain chain={ chainFrom } hash={ tx.observed_hash } noIcon noCopy={ false }/>
        ) : (
          <TxEntity hash={ tx.observed_hash } noIcon noCopy={ false }/>
        ) }
        { /* <Text>Timestamp</Text> */ }
        { /* <Text>{ new Date(Number(tx.inbound_params.) * 1000).toLocaleString() }</Text> */ }
        { /* <Text color="text.secondary">Status</Text>
          <StatusTag type={ tx.inbound_params.status === 'SUCCESS' ? 'ok' : 'error' } text={ tx.inbound_params.status }/> */ }
        <Text color="text.secondary" fontWeight="medium">Sender</Text>
        <ZetaChainAddressEntity
          hash={ tx.sender }
          chainId={ tx.sender_chain_id }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text color="text.secondary" fontWeight="medium">Transferred</Text>
        <ZetaChainCCTXValue
          coinType={ tx.coin_type }
          tokenSymbol={ tx.asset }
          amount={ tx.amount }
          // decimals={ tx.inbound_params.decimals?.toString() ?? null }
          isLoading={ isLoading }
        />
      </Grid>
    </Skeleton>
  );
};

export default ZetaChainCCTXDetailsLifecycleIn;
