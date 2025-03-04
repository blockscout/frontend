import stakingAbi from './stakingLongAbi.json';
const STAKING_CONTRACT_ADDRESS = '0x23ba922d2c435ea65aceb6d56feec7a7c29948b8';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export const useMyMachine = () => {
  const { address, isConnected, addresses } = useAccount();
  const toast = useToast();
  const config = useConfig(); // 获取全局配置

  // 获取质押数据
  const stake = useWriteContract();
  const { data: TxHash } = stake;
  const [loading, setLoading] = useState(false);
  const { isSuccess: isNftApproved } = useWaitForTransactionReceipt({ hash: TxHash });

  const getStakeData: any = async () => {
    if (!isConnected) {
      toast({
        position: 'top',
        title: 'Prompt',
        description: 'Please connect your wallet first',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);

    // 使用 toast.promise 包裹整个 Promise

    const hash = await stake.writeContractAsync({
      address: STAKING_CONTRACT_ADDRESS,
      abi: stakingAbi,
      functionName: 'setApprovalForAll',
      args: [STAKING_CONTRACT_ADDRESS, true],
    });
  };

  return { getStakeData };
};
