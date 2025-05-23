/* eslint-disable */

import { JsonRpcProvider, NonceManager, Wallet } from 'ethers';
import { ethers } from 'ethers';
import { getEnvValue } from 'configs/app/utils';

const provider = new JsonRpcProvider(
  getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'),
  Number(getEnvValue('NEXT_PUBLIC_NETWORK_ID')),
  {
    staticNetwork: true,
  },
);

const isTxConfirmed = async function (txHash: string): Promise<boolean> {
  try {
    const receipt = await provider.waitForTransaction(txHash, 1,  20 * 1000) // 1次确认
    console.log('receipt', receipt)
    if (receipt === null) {
      return false;
    } else {
      console.log('status', receipt.status)
      return receipt.status === 1
    }
  } catch (error) {
    return false
  }
}

export default isTxConfirmed;