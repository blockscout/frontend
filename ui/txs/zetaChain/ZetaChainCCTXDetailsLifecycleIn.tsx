import { Flex, Grid, Text } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTXResponse } from 'types/api/zetaChain';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityWithExternalChain from 'ui/shared/entities/tx/TxEntityWithExternalChain';
import IconSvg from 'ui/shared/IconSvg';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import ZetaChainAddressEntity from 'ui/shared/zetaChain/ZetaChainAddressEntity';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  tx: ZetaChainCCTXResponse;
  isLoading: boolean;
};

const ZetaChainCCTXDetailsLifecycleIn = ({ tx, isLoading }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const inboundParams = tx.inbound_params;
  const chainFrom = chainsConfig?.find((chain) => chain.chain_id === inboundParams.sender_chain_id);

  return (
    <>
      <IconSvg name="verification-steps/finalized" boxSize={ 5 } bg="global.body.bg" zIndex={ 1 } color="text.success"/>
      <Skeleton loading={ isLoading }>
        <Flex color={ inboundParams.status === 'SUCCESS' ? 'text.success' : 'text.error' } maxH="20px" mb={ 2.5 } alignItems="center">
          { `Sender tx from ${ chainFrom?.chain_name || 'unknown chain' }` }
        </Flex>
        <Grid templateColumns="100px 1fr" rowGap={ 4 } columnGap={ 3 } bg="alert.bg.info" py={ 3 } px={ 4 } borderRadius="md" overflow="hidden">
          <Text color="text.secondary" fontWeight="medium">Transaction</Text>
          { chainFrom?.chain_id.toString() !== config.chain.id ? (
            <TxEntityWithExternalChain chain={ chainFrom } hash={ inboundParams.observed_hash } noIcon noCopy={ false }/>
          ) : (
            <TxEntity hash={ inboundParams.observed_hash } noIcon noCopy={ false }/>
          ) }
          <Text color="text.secondary" fontWeight="medium">Status</Text>
          <StatusTag type="ok" text="Success"/>
          <Text color="text.secondary" fontWeight="medium">Sender</Text>
          <ZetaChainAddressEntity
            hash={ inboundParams.sender }
            chainId={ inboundParams.sender_chain_id.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
          <Text color="text.secondary" fontWeight="medium">Transferred</Text>
          <ZetaChainCCTXValue
            coinType={ inboundParams.coin_type }
            tokenSymbol={ tx.token_symbol }
            amount={ inboundParams.amount }
            decimals={ tx.decimals?.toString() }
            isLoading={ isLoading }
          />
        </Grid>
      </Skeleton>
    </>
  );
};

export default ZetaChainCCTXDetailsLifecycleIn;
