import React from 'react';
import { Button } from '@chakra-ui/react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import stakingAbi from '../../../../lib/hooks/useDeepLink/stakingLongAbi.json'; // 确保路径正确

const STAKING_CONTRACT_ADDRESS = '0x3c059dbe0f42d65acd763c3c3da8b5a1b12bb74f';

// 定义 Props 类型（可选，使用 TypeScript 时推荐）
interface AddDLCToStakeProps {
  h: () => void; // 回调函数
  machineId: string; // 机器 ID
  amount: string; // DLC 数量 (uint256 类型，作为字符串传递)
}

function AddDLCToStake({ h, machineId, amount }: AddDLCToStakeProps) {
  const { address } = useAccount(); // 获取用户钱包地址
  const config = useConfig(); // 获取全局配置

  // 交易方法：添加 DLC 到质押
  const { writeContractAsync } = useWriteContract();
  const { data: addDLCTxHash, isPending: isAddingDLC } = useWriteContract();
  const { isLoading: isPendingAddDLCConfirmation, isSuccess: isAddDLCSuccess } = useWaitForTransactionReceipt({
    hash: addDLCTxHash,
  });

  // 开始质押 DLC
  const handleAddDLCToStake = async () => {
    if (!address) {
      console.error('请先连接钱包');
      return;
    }

    try {
      // Step 1: 发送交易调用 addDLCToStake
      const txHash = await writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'addDLCToStake',
        args: [machineId, amount], // 使用传入的 machineId 和 amount
      });
      console.log('交易已发送，txHash:', txHash);

      // Step 2: 等待交易确认
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      if (receipt.status === 'success') {
        console.log('添加DLC成功，txHash:', txHash);
      } else {
        console.log('添加DLC失败，交易被回滚，txHash:', txHash);
      }

      // Step 3: 调用传入的回调函数
      h();
    } catch (err) {
      console.error('添加DLC失败，错误:', err);
      h(); // 调用回调，即使失败
    }
  };

  return (
    <Button
      isLoading={isAddingDLC || isPendingAddDLCConfirmation} // 按钮加载状态
      colorScheme="blue"
      width="full"
      size="sm"
      onClick={handleAddDLCToStake}
    >
      Submit
    </Button>
  );
}

export default AddDLCToStake;
