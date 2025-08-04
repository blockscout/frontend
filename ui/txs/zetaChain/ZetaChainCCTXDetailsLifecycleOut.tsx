import { Flex, Grid, Text } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { ZetaChainCCTXOutboundParams, ZetaChainCCTXStatus } from 'types/api/zetaChain';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityWithExternalChain from 'ui/shared/entities/tx/TxEntityWithExternalChain';
// import StatusTag from 'ui/shared/statusTag/StatusTag';
import ZetaChainAddressEntity from 'ui/shared/zetaChain/ZetaChainAddressEntity';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  tx: ZetaChainCCTXOutboundParams;
  txStatus: ZetaChainCCTXStatus;
  isLoading: boolean;
  isLast: boolean;
};

const ZetaChainCCTXDetailsLifecycleOut = ({ tx, txStatus, isLoading, isLast }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const chainTo = chainsConfig?.find((chain) => chain.chain_id === tx.receiver_chain_id);

  if (txStatus === 'PENDING_INBOUND') {
    return null;
  }

  let content: React.ReactNode = null;
  let text: string = '';
  let color: string = '';

  if (txStatus === 'OUTBOUND_MINED') {
    content = (
      <>
        <Text color="text.secondary" fontWeight="medium">Transferred</Text>
        { chainTo?.chain_id.toString() !== config.chain.id ? (
          <TxEntityWithExternalChain chain={ chainTo } hash={ tx.hash } noIcon noCopy={ false }/>
        ) : (
          <TxEntity hash={ tx.hash } noIcon noCopy={ false }/>
        ) }
        <Text color="text.secondary" fontWeight="medium">Receiver</Text>
        <ZetaChainAddressEntity
          hash={ tx.receiver }
          chainId={ tx.receiver_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text color="text.secondary" fontWeight="medium">Gas used</Text>
        <Text>{ BigNumber(tx.gas_used || 0).toFormat() }</Text>
      </>
    );
    text = `Sent tx to ${ chainTo?.chain_name || 'Unknown chain' }`;
    color = 'text.success';
  } else if (txStatus === 'PENDING_REVERT') {
    if (!isLast) {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Transaction</Text>
          { chainTo?.chain_id.toString() !== config.chain.id ? (
            <TxEntityWithExternalChain chain={ chainTo } hash={ tx.hash } noIcon noCopy={ false }/>
          ) : (
            <TxEntity hash={ tx.hash } noIcon noCopy={ false }/>
          ) }
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Reverting to</Text>
          <ZetaChainAddressEntity
            hash={ tx.receiver }
            chainId={ tx.receiver_chain_id.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Waiting for revert to ${ chainTo?.chain_name || 'Unknown chain' }`;
      color = 'text.secondary';
    }
  } else if (txStatus === 'PENDING_OUTBOUND') {
    content = (
      <>
        <Text color="text.secondary" fontWeight="medium">Destination</Text>
        <ZetaChainAddressEntity
          hash={ tx.receiver }
          chainId={ tx.receiver_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text color="text.secondary" fontWeight="medium">Nonce</Text>
        <Text>{ tx.tss_nonce }</Text>
      </>
    );
    text = `Waiting for outbound tx to ${ chainTo?.chain_name || 'Unknown chain' }`;
    color = 'text.secondary';
  } else if (txStatus === 'REVERTED') {
    if (!isLast) {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Transaction</Text>
          { chainTo?.chain_id.toString() !== config.chain.id ? (
            <TxEntityWithExternalChain chain={ chainTo } hash={ tx.hash } noIcon noCopy={ false }/>
          ) : (
            <TxEntity hash={ tx.hash } noIcon noCopy={ false }/>
          ) }
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Reverted to</Text>
          <ZetaChainAddressEntity
            hash={ tx.receiver }
            chainId={ tx.receiver_chain_id.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Reverted to ${ chainTo?.chain_name || 'Unknown chain' }`;
      color = 'text.success';
    }
  } else if (txStatus === 'ABORTED') {
    if (!isLast) {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Receiver</Text>
          <ZetaChainAddressEntity
            hash={ tx.receiver }
            chainId={ tx.receiver_chain_id.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Sender</Text>
          <ZetaChainAddressEntity
            hash={ tx.receiver }
            chainId={ tx.receiver_chain_id.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Revert to ${ chainTo?.chain_name || 'Unknown chain' } failed`;
      color = 'text.error';
    }
  }

  return (
    <Skeleton loading={ isLoading } key={ tx.hash } w="100%">
      { /* color is incorrect, idk where to get the right one */ }
      <Flex color={ color } maxH="20px" alignItems="center" mb={ 2.5 }>
        { text }
      </Flex>
      <Grid templateColumns="100px 1fr" rowGap={ 4 } columnGap={ 3 } bg="alert.bg.info" py={ 3 } px={ 4 } borderRadius="md">
        { content }
      </Grid>
    </Skeleton>
  );
};

export default ZetaChainCCTXDetailsLifecycleOut;
