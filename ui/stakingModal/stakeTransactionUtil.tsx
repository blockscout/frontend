/* eslint-disable */

import { useWalletClient, usePublicClient } from 'wagmi';
import { parseEther, parseUnits } from 'viem';

type unsignedTx = {
    to: string;
    data: `0x${string}`;
    value: string;
    gasLimit: string;
    chainId: string;
    from: string;
};

export const signAndSend = async ( unsignedTx: unsignedTx | null | undefined ) => {

    if (!unsignedTx) throw new Error('Unsigned transaction null or undefined');

    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient()

    if (!walletClient) throw new Error('Wallet client not found')
    if (!publicClient) throw new Error('Public client not found')

    const _unsignedTx = {
        ...unsignedTx,
        from: unsignedTx.from as `0x${string}`,
        to: unsignedTx.to as `0x${string}`,
        value: parseEther(unsignedTx.value),
        gas: parseUnits(unsignedTx.gasLimit, 0),
        chainId: BigInt(unsignedTx.chainId),
    }

    const txHash = await walletClient.sendTransaction(_unsignedTx);

    return txHash;
}