import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import erc20Abi from './dlcAbi.json';
import stakingAbi from './stakingLongAbi.json';
import { useToast } from '@chakra-ui/react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useEffect, useState } from 'react';
// machin ID: a8aeafb706433fc89c16817e8405705bd66f28b6d5cfc46c9da2faf7b204da78
// private key: d85789ca443866f898a928bba3d863a5e3c66dc03b03a7d947e8dde99e19368e
const NFT_CONTRACT_ADDRESS = '0x905dE58579886C5afe9B6406CFDE82bd6a1087C1';
const DLC_TOKEN_ADDRESS = '0x23ba922d2c435ea65aceb6d56feec7a7c29948b8';
const STAKING_CONTRACT_ADDRESS = '0x7FDC6ed8387f3184De77E0cF6D6f3B361F906C21';
import { createMachine } from '../../../ui/mymachine/modules/api/index';

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
  }) as any;

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

    try {
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
          loading: {
            title: 'Authorizing',
            description: 'Please confirm the transaction in your wallet',
            position: 'top',
          },
          success: (txHash) => {
            console.log('NFT authorization transaction sent:', txHash);
            return { title: 'NFT Authorization Successful', description: 'Authorization completed', position: 'top' };
          },
          error: (err) => ({
            title: 'Authorization Failed',
            description: err.message || 'Please check wallet settings or network',
            position: 'top',
          }),
        }
      );
    } catch (error) {
      setLoading(false);
    }
  };

  // 最终的质押方法
  const staking = useWriteContract();
  const { data: stakeTxHash, isPending: isStaking } = staking;

  const { isSuccess: isStakingSuccess } = useWaitForTransactionReceipt({
    hash: stakeTxHash,
  });

  const stake = async () => {
    return toast.promise(
      staking.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'stake',
        args: [rentalMachineIdOnChain, nftData[0], nftData[1], machineId],
      }),
      {
        loading: {
          title: 'In Progress',
          description: 'Please confirm the transaction in your wallet',
          position: 'top',
        },
        success: (txHash) => {
          console.log('NFT staking transaction sent:', txHash);
          return {
            title: 'NFT Staking Successful',
            description: 'Staking completed',
            position: 'top',
          };
        },
        error: (err) => ({
          title: 'Authorization Failed',
          description: err.message || 'Please check wallet settings or network',
          position: 'top',
        }),
      }
    );
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

      // 在组件中定义创建机器的函数
      const handleCreateMachine = async () => {
        const machineData = {
          address: address,
          machineId: rentalMachineIdOnChain,
          numberOfNodes: nftNodeCount,
          rentalMachineId: machineId,
        };

        try {
          const res: any = await createMachine(machineData);
          if (res.code === 1000) {
            toast({
              title: 'Prompt',
              description: 'Congratulations, you have successfully staked your NFT!',
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'top',
            });
          }

          // 可选：创建成功后刷新列表
          // fetchMachineDataH();
        } catch (err: any) {
          console.log(err, '////////////////');
          toast({
            title: 'Prompt',
            description: err.msg,
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top',
          });
        }
      };
      handleCreateMachine();
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
    setDlcBtnLoading(true);
    return toast.promise(
      dlcApproval.writeContractAsync({
        address: DLC_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [STAKING_CONTRACT_ADDRESS, dlcNodeCount],
      }),
      {
        loading: {
          title: 'Authorizing',
          description: 'Please confirm the transaction in your wallet',
          position: 'top',
        },
        success: (txHash) => {
          console.log('DLC Token authorization transaction sent:', txHash);
          return { title: 'DLC Authorization Successful', description: 'Authorization completed', position: 'top' };
        },
        error: (err) => ({
          title: 'Authorization Failed',
          description: err.message || 'Please check wallet settings or network',
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
        title: 'Prompt',
        description: 'Congratulations, you have successfully staked DLC!',
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
    if (!isConnected) {
      console.error('Please connect your wallet first');
      return;
    }
    try {
      // Step 1: Send transaction to call addDLCToStake
      const txHash = await unStake.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'unStake',
        args: ['a8aeafb706433fc89c16817e8405705bd66f28b6d5cfc46c9da2faf7b204da78'], // Using the passed machineId and amount
      });
      console.log('Transaction sent, txHash:', txHash);
      // Step 2: Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      if (receipt.status === 'success') {
        console.log('Unstaking successful, txHash:', txHash);
      } else {
        console.log('Unstaking failed, transaction reverted, txHash:', txHash);
      }
    } catch (error) {
      console.error('Failed to add DLC, error:', error);
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
