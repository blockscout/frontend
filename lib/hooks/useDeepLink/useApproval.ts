import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import erc20Abi from './dlcAbi.json';
import stakingAbi from './stakingAbi.json';
import { useToast } from '@chakra-ui/react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useEffect, useState } from 'react';

const NFT_CONTRACT_ADDRESS = '0x905dE58579886C5afe9B6406CFDE82bd6a1087C1';
const DLC_TOKEN_ADDRESS = '0xC8b47112D5413c6d06D4BB7573fD903908246614';
const STAKING_CONTRACT_ADDRESS = '0xa6c07a5c289a2b1b1b528baf9aa3177fd2b57d83';

export function useApproval(onPledgeModalClose: () => void, onPledgeModalCloseDLC: () => void) {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig(); // 获取全局配置

  // 读取 NFT 余额 (getBalance)
  const [nftNodeCount, setNftNodeCount] = useState('');

  const { data: nftData, refetch } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: 'getBalance',
    args: address && nftNodeCount ? [address, nftNodeCount] : undefined,
    query: {
      enabled: !!address && !!nftNodeCount,
    },
  });

  // NFT 授权
  const [nftLoading, setLoading] = useState(false);
  const [machineId, setMachineId] = useState('');
  const [rentalMachineIdOnChain, setRentalMachineIdOnChain] = useState('');

  const nftApproval = useWriteContract();
  const { data: nftTxHash, isPending: isApprovingNft, error: nftApproveError } = nftApproval;
  const {
    isLoading: isPendingNftConfirmation,
    isSuccess: isNftApproved,
    error: nftConfirmationError,
  } = useWaitForTransactionReceipt({ hash: nftTxHash });

  const approveNft = async () => {
    if (!address) {
      toast({
        position: 'top',
        title: '提示',
        description: '请先连接钱包',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return; // 如果未连接钱包，直接返回
    }
    setLoading(true);

    // 获取余额
    refetch();

    // 使用 toast.promise 包裹整个 Promise
    return toast.promise(
      nftApproval.writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: 'setApprovalForAll',
        args: [STAKING_CONTRACT_ADDRESS, true],
      }),
      {
        loading: { title: '授权中', description: '请在钱包中确认交易', position: 'top' },
        success: (txHash) => {
          console.log('NFT 授权交易已发送:', txHash);
          return { title: 'NFT 授权成功', description: '授权已完成', position: 'top' };
        },
        error: (err) => ({
          title: '授权失败',
          description: err.message || '请检查钱包设置或网络',
          position: 'top',
        }),
      }
    );
  };

  // 最终的质押方法
  const staking = useWriteContract();
  const { data: stakeTxHash, isPending: isStaking } = staking;

  const { isSuccess: isStakingSuccess } = useWaitForTransactionReceipt({
    hash: stakeTxHash,
  });

  const stake = async () => {
    try {
      const txHash = await staking.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'stake',
        args: [rentalMachineIdOnChain, nftData[0], nftData[1], machineId],
      });

      console.log('交易已发送，txHash:', txHash);
      return { success: true, txHash };
    } catch (err) {
      console.error('交易失败，错误:', err);
      return { success: false, txHash: null };
    }
  };

  useEffect(() => {
    if (isNftApproved) {
      try {
        stake();
      } catch {
        setLoading(false);
      }
    }
  }, [isNftApproved]);
  useEffect(() => {
    if (isStakingSuccess) {
      setLoading(false);
      onPledgeModalClose();
      toast({
        title: '提示',
        description: '恭喜您，质押nft成功！',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [isStakingSuccess]);

  // 质押dlc
  // dlc按钮数据
  const [dlcBtnLoading, setDlcBtnLoading] = useState(false);
  const [dlcNodeId, setdlcNodeId] = useState('');
  const [dlcNodeCount, setDlcNodeCount] = useState('');
  // DLC Token 授权
  const dlcApproval = useWriteContract();
  const { data: dlcTxHash, isPending: isApprovingDlc, error: dlcApproveError } = dlcApproval;
  const {
    isLoading: isPendingDlcConfirmation,
    isSuccess: isDlcApproved,
    error: dlcConfirmationError,
  } = useWaitForTransactionReceipt({ hash: dlcTxHash });
  const approveDlcToken = async () => {
    if (!address) {
      toast({
        position: 'top',
        title: '提示',
        description: '请先连接钱包',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setDlcBtnLoading(true);
    return toast.promise(
      dlcApproval.writeContractAsync({
        address: DLC_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [STAKING_CONTRACT_ADDRESS, dlcNodeCount],
      }),

      {
        loading: { title: '授权中', description: '请在钱包中确认交易', position: 'top' },
        success: (txHash) => {
          console.log('DLC Token 授权交易已发送:', txHash);
          return { title: 'DLC 授权成功', description: '授权已完成', position: 'top' };
        },
        error: (err) => ({
          title: '授权失败',
          description: err.message || '请检查钱包设置或网络',
          position: 'top',
        }),
      }
    );
  };
  // 交易方法：添加 DLC 到质押
  // const { writeContractAsync } = useWriteContract();
  const dlcStake = useWriteContract();

  const { data: addDLCTxHash, isPending: isAddingDLC } = dlcStake;
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
      const txHash = await dlcStake.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'addDLCToStake',
        args: [dlcNodeId, dlcNodeCount], // 使用传入的 machineId 和 amount
      });
      console.log('交易已发送，txHash:', txHash);

      // Step 2: 等待交易确认
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      if (receipt.status === 'success') {
        console.log('添加DLC成功，txHash:', txHash);
      } else {
        console.log('添加DLC失败，交易被回滚，txHash:', txHash);
      }
    } catch (err) {
      console.error('添加DLC失败，错误:', err);
    }
  };

  useEffect(() => {
    if (isDlcApproved) {
      try {
        handleAddDLCToStake();
      } catch {
        setDlcBtnLoading(false);
      }
    }
  }, [isDlcApproved]);
  useEffect(() => {
    if (isAddDLCSuccess) {
      setDlcBtnLoading(false);
      toast({
        title: '提示',
        description: '恭喜您，质押dlc成功！',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      onPledgeModalCloseDLC();
    }
  }, [isAddDLCSuccess]);
  // 解除质押

  const unStake = useWriteContract();
  const { data: unStakeHash } = unStake;
  const { isSuccess: isUnStakeed } = useWaitForTransactionReceipt({ hash: unStakeHash });

  // a8aeafb706433fc89c16817e8405705bd66f28b6d5cfc46c9da2faf7b204da78

  const handleUnStake = async () => {
    if (!address) {
      console.error('请先连接钱包');
      return;
    }
    try {
      // Step 1: 发送交易调用 addDLCToStake
      const txHash = await unStake.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'unStake',
        args: ['a8aeafb706433fc89c16817e8405705bd66f28b6d5cfc46c9da2faf7b204da78'], // 使用传入的 machineId 和 amount
      });
      console.log('交易已发送，txHash:', txHash);
      // Step 2: 等待交易确认
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      if (receipt.status === 'success') {
        console.log('解除质押成功，txHash:', txHash);
      } else {
        console.log('解除质押失败，交易被回滚，txHash:', txHash);
      }
    } catch (error) {
      console.error('添加DLC失败，错误:', error);
    }
  };

  return {
    approveNft,
    approveDlcToken,
    isApprovingNft,
    isPendingNftConfirmation,
    isNftApproved,
    nftApproveError,
    nftConfirmationError,
    nftTxHash,
    isApprovingDlc,
    isPendingDlcConfirmation,
    isDlcApproved,
    dlcApproveError,
    dlcConfirmationError,
    dlcTxHash,
    stake,
    isStaking,
    isStakingSuccess,
    handleAddDLCToStake,
    isAddDLCSuccess,

    dlcBtnLoading,
    dlcNodeId,
    setdlcNodeId,
    dlcNodeCount,
    setDlcNodeCount,
    nftLoading,
    machineId,
    setMachineId,
    rentalMachineIdOnChain,
    setRentalMachineIdOnChain,
    nftNodeCount,
    setNftNodeCount,
    isUnStakeed,
    handleUnStake,
  };
}
