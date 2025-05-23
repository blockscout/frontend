/* eslint-disable */

import { useWalletClient, usePublicClient } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { JsonRpcProvider, NonceManager, Wallet } from 'ethers';
import { ethers } from 'ethers';
import { getEnvValue } from 'configs/app/utils';

type unsignedTx = {
    to: string;
    data: `0x${string}`;
    value: string;
    gasLimit: string;
    chainId: string;
    from: string;
};


const provider = new JsonRpcProvider(
  getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'),
  Number(getEnvValue('NEXT_PUBLIC_NETWORK_ID')),
  {
    staticNetwork: true,
  },
);

const _signer = new Wallet(getEnvValue('NEXT_PUBLIC_FAUCET_KEY')!, provider);


export const signAndSend = async ( unsignedTx: unsignedTx | null | undefined ) => {

    if (!unsignedTx) throw new Error('Unsigned transaction null or undefined');

    if (!_signer) throw new Error('Signer not found')
    if (!provider) throw new Error('Provider not found')

        // 2. 构建交易对象
    const _unsignedTx: ethers.TransactionRequest = {
        from: unsignedTx.from,
        to: unsignedTx.to,
        value: ethers.parseEther(unsignedTx.value), // string -> BigInt
        gasLimit: ethers.parseUnits(unsignedTx.gasLimit, 0), // string -> BigInt
        chainId: Number(unsignedTx.chainId), // chainId 需要是 number 类型
    }


    const txResponse = await _signer.sendTransaction(_unsignedTx)
    const txHash = txResponse.hash;

    return txHash;
}