import React from 'react';
import type { SendTransactionReturnType } from 'viem';
import { getAddress, toBytes, toHex, toRlp } from 'viem';
import * as chains from 'viem/chains';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';

import config from 'configs/app';

const facetInboxAddress = '0x00000000000000000000000000000000000FacE7' as `0x${ string }`;

interface Params {
  to: `0x${ string }`;
  value?: bigint;
  maxFeePerGas: bigint;
  gasLimit: bigint;
  data?: `0x${ string }`;
}

export default function useFacet(): (params: Params) => Promise<SendTransactionReturnType> {
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  return React.useCallback(async({
    to,
    value = BigInt(0),
    maxFeePerGas,
    gasLimit,
    data,
  }) => {
    if (!walletClient) {
      throw new Error('Wallet Client is not defined');
    }

    if (!config.chain.l1Network || !chains[config.chain.l1Network]) {
      throw 'No L1 network';
    }

    if (!account) {
      throw 'Not connected';
    }

    const l1Chain = chains[config.chain.l1Network];

    await switchChainAsync?.({ chainId: l1Chain.id });

    const out = buildFacetTransaction({
      chainId: Number(config.chain.id),
      to,
      value,
      maxFeePerGas,
      gasLimit,
      data,
    });

    return walletClient.sendTransaction({
      chain: chains[config.chain.l1Network],
      to: facetInboxAddress as `0x${ string }`,
      data: toHex(out),
    });
  }, [ account, walletClient, switchChainAsync ]);
}

export const buildFacetTransaction = ({
  chainId,
  to,
  value,
  maxFeePerGas,
  gasLimit,
  data = '0x',
}: {
  chainId: number;
  to: `0x${ string }`;
  value: bigint;
  maxFeePerGas: bigint;
  gasLimit: bigint;
  data?: `0x${ string }`;
}) => {
  const facetTxType = toBytes(70);

  const rlpEncoded = toRlp([
    toHex(chainId),
    getAddress(to),
    toHex(value),
    toHex(maxFeePerGas),
    toHex(gasLimit),
    data,
  ], 'bytes');

  return new Uint8Array([ ...facetTxType, ...rlpEncoded ]);
};
