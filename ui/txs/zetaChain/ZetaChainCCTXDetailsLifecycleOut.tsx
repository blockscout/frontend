import { Flex, Grid, Text } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { ZetaChainCCTXOutboundParams, ZetaChainCCTXResponse } from 'types/api/zetaChain';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntityZetaChain from 'ui/shared/entities/address/AddressEntityZetaChain';
import CCTxEntityZetaChain from 'ui/shared/entities/tx/CCTxEntityZetaChain';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityZetaChainExternal from 'ui/shared/entities/tx/TxEntityZetaChainExternal';
import IconSvg from 'ui/shared/IconSvg';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  outboundParam: ZetaChainCCTXOutboundParams;
  tx: ZetaChainCCTXResponse;
  isLoading: boolean;
  isLast: boolean;
  hasTxAfter: boolean;
};

const ZetaChainCCTXDetailsLifecycleOut = ({ outboundParam, tx, isLoading, isLast, hasTxAfter }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const chainToId = outboundParam.receiver_chain_id?.toString() || '';
  const chainTo = chainsConfig?.find((chain) => chain.chain_id.toString() === chainToId);

  const gasDecimals = config.chain.currency.decimals;

  const bgColor = useColorModeValue('white', 'black');

  if (tx.cctx_status.status === 'PENDING_INBOUND') {
    return null;
  }

  let content: React.ReactNode = null;
  let text: string = '';
  let color: string = '';

  const transactionOrCCTX = (() => {
    if (!outboundParam.hash) {
      return null;
    }
    const isCCTX = tx.related_cctxs.some((cctx) => cctx.index === outboundParam.hash);
    if (isCCTX) {
      return (
        <>
          <Text color="text.secondary" fontWeight="medium">CCTX</Text>
          <CCTxEntityZetaChain
            hash={ outboundParam.hash }
            isLoading={ isLoading }
            noIcon
            noCopy={ false }
          />
        </>
      );
    }
    return (
      <>
        <Text color="text.secondary" fontWeight="medium">Transaction</Text>
        { chainToId !== config.chain.id ? (
          <TxEntityZetaChainExternal chainId={ chainToId } hash={ outboundParam.hash } noIcon noCopy={ false }/>
        ) : (
          <TxEntity hash={ outboundParam.hash } noIcon noCopy={ false }/>
        ) }
      </>
    );
  })();

  if (tx.cctx_status.status === 'OUTBOUND_MINED') {
    content = (
      <>
        { transactionOrCCTX }
        <Text color="text.secondary" fontWeight="medium">Status</Text>
        <StatusTag type="ok" text="Success"/>
        <Text color="text.secondary" fontWeight="medium">Receiver</Text>
        <AddressEntityZetaChain
          address={{ hash: outboundParam.receiver }}
          chainId={ outboundParam.receiver_chain_id?.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text color="text.secondary" fontWeight="medium">Transferred</Text>
        <ZetaChainCCTXValue
          coinType={ outboundParam.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ outboundParam.amount }
          decimals={ tx.decimals?.toString() }
          isLoading={ isLoading }
        />
        <Text color="text.secondary" fontWeight="medium">Gas used</Text>
        <Text>{ BigNumber(outboundParam.gas_used || 0).div(10 ** gasDecimals).toFormat() }</Text>
      </>
    );
    text = `Sent tx to ${ chainTo?.chain_name || 'Unknown chain' }`;
    color = 'text.success';
  } else if (tx.cctx_status.status === 'PENDING_REVERT') {
    if (!isLast) {
      content = (
        <>
          { transactionOrCCTX }
          <Text color="text.secondary" fontWeight="medium">Status</Text>
          <StatusTag type="error" text="Failed"/>
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Reverting to</Text>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Waiting for revert to ${ chainTo?.chain_name || 'Unknown chain' }`;
      color = 'text.secondary';
    }
  } else if (tx.cctx_status.status === 'PENDING_OUTBOUND') {
    content = (
      <>
        <Text color="text.secondary" fontWeight="medium">Destination</Text>
        <AddressEntityZetaChain
          address={{ hash: outboundParam.receiver }}
          chainId={ outboundParam.receiver_chain_id?.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text color="text.secondary" fontWeight="medium">Nonce</Text>
        <Text>{ outboundParam.tss_nonce }</Text>
      </>
    );
    text = `Waiting for outbound tx to ${ chainTo?.chain_name || 'Unknown chain' }`;
    color = 'text.secondary';
  } else if (tx.cctx_status.status === 'REVERTED') {
    if (!isLast) {
      content = (
        <>
          { transactionOrCCTX }
          <Text color="text.secondary" fontWeight="medium">Status</Text>
          <StatusTag type="error" text="Failed"/>
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Origin</Text>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
          { transactionOrCCTX }
          <Text color="text.secondary" fontWeight="medium">Status</Text>
          <StatusTag type="ok" text="Success"/>
          <Text color="text.secondary" fontWeight="medium">Transferred</Text>
          <ZetaChainCCTXValue
            coinType={ outboundParam.coin_type }
            tokenSymbol={ tx.token_symbol }
            amount={ outboundParam.amount }
            decimals={ tx.decimals?.toString() }
            isLoading={ isLoading }
          />
          <Text color="text.secondary" fontWeight="medium">Gas used</Text>
          <Text>{ BigNumber(outboundParam.gas_used || 0).div(10 ** gasDecimals).toFormat() } { config.chain.currency.symbol }</Text>
        </>
      );
      text = `Reverted to ${ chainTo?.chain_name || 'Unknown chain' }`;
      color = 'text.success';
    }
  } else if (tx.cctx_status.status === 'ABORTED') {
    if (!isLast) {
      content = (
        <>
          <Text color="text.secondary" fontWeight="medium">Receiver</Text>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
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
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Abort executed`;
      color = 'text.success';
    }
  }

  return (
    <>
      <Flex
        h="100%"
        w="100%"
        bg={ (isLast && !hasTxAfter) ? bgColor : 'transparent' }
        zIndex={ 1 }
      >
        <IconSvg name="verification-steps/finalized" boxSize={ 5 } bg={ bgColor } zIndex={ 1 } color={ color }/>
      </Flex>
      <Skeleton loading={ isLoading } w="100%">
        <Flex color={ color } maxH="20px" alignItems="center" mb={ 2.5 }>
          { text }
        </Flex>
        <Grid
          templateColumns="100px 1fr"
          gap={ 3 }
          bg="alert.bg.info"
          py={ 3 }
          px={ 4 }
          borderBottomRadius="md"
          fontSize="sm"
        >
          { content }
        </Grid>
      </Skeleton>
    </>
  );
};

export default ZetaChainCCTXDetailsLifecycleOut;
