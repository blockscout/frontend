import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import freeMode from './freeModeAbi.json';
import dgcAbi from './dgcAbi.json';
import dbcAbi from './dbcAbi.json';
import { useToast } from '@chakra-ui/react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';

const NFT_CONTRACT_ADDRESS = '0xC40ba6AC7Fcd11B8E0Dc73c86b0F8D63714F6494';
const DGC_CONTRACT_ADDRESS = '0xb6aD0ddC796A110D469D868F6A94c80e3f53D384';
const DBC_CONTRACT_ADDRESS = '0x8CD8F5517ab18edfA7c121140B03229cD0771B83';
const FREEMODE_CONTRACT_ADDRESS = '0x9b35c3b9E13E058d958364eA0e7692a0d5D39Ab4';

export function useFreeH(nftOnPledgeModalClose: () => void, dbcOnPledgeModalClose: () => void) {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig(); // 获取全局配置

  // 授权NFT
  const [nftBtnLoading, setNftBtnLoading] = useState(false);
  const [pledgedNftCount, setPledgedNftCount] = useState('');
  const [pledgedDgcCount, setPledgedDgcCount] = useState('');
  const [machineId, setMachineId] = useState('');
  const nftApproval = useWriteContract();
  const { data: nftHash } = nftApproval;
  const { isSuccess: nftApproved } = useWaitForTransactionReceipt({ hash: nftHash });

  const approveNft: any = async () => {
    return toast.promise(
      nftApproval.writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: 'setApprovalForAll',
        args: [FREEMODE_CONTRACT_ADDRESS, true],
      }),

      {
        loading: { title: 'Approving', description: 'Please confirm the transaction in your wallet', position: 'top' },
        success: (txHash) => {
          console.log('NFT approval transaction sent:', txHash);
          return {
            title: 'NFT Approval Transaction Sent Successfully',
            description: 'Approval transaction sent successfully',
            position: 'top',
          };
        },
        error: (err) => {
          setNftBtnLoading(false);
          return {
            title: 'Approval Failed',
            description: err.message || 'Please check your wallet settings or network',
            position: 'top',
          };
        },
      }
    );
  };

  // 授权DGC
  const dgcApproval = useWriteContract();
  const { data: dgcHash } = dgcApproval;
  const { isSuccess: dgcApproved } = useWaitForTransactionReceipt({ hash: dgcHash });

  const approveDgc = async () => {
    return toast.promise(
      dgcApproval.writeContractAsync({
        address: DGC_CONTRACT_ADDRESS,
        abi: dgcAbi,
        functionName: 'approve',
        args: [FREEMODE_CONTRACT_ADDRESS, pledgedDgcCount],
      }),

      {
        loading: { title: 'Approving', description: 'Please confirm the transaction in your wallet', position: 'top' },
        success: (txHash) => {
          console.log('DGC approval transaction sent:', txHash);
          return {
            title: 'DGC Transaction Sent Successfully',
            description: 'DGC approval transaction sent successfully',
            position: 'top',
          };
        },
        error: (err) => {
          setNftBtnLoading(false);
          return {
            title: 'Approval Failed',
            description: err.message || 'Please check your wallet settings or network',
            position: 'top',
          };
        },
      }
    );
  };

  //  质押函数
  const nftStake = useWriteContract();
  const { data: addNftHash } = nftStake;
  const { isSuccess: isAddSuccess } = useWaitForTransactionReceipt({
    hash: addNftHash,
  });

  const handleAddNftToStake = async () => {
    return toast.promise(
      nftStake.writeContractAsync({
        address: FREEMODE_CONTRACT_ADDRESS,
        abi: freeMode,
        functionName: 'stake',
        args: [machineId, pledgedDgcCount, pledgedNftCount],
        // Use the provided machineId and amount
      }),

      {
        loading: {
          title: 'Staking in Progress',
          description: 'Please confirm the transaction in your wallet',
          position: 'top',
        },
        success: (txHash) => {
          console.log('Staking transaction sent:', txHash);
          return {
            title: 'Staking Transaction Sent',
            description: 'The staking transaction has been sent',
            position: 'top',
          };
        },
        error: (err) => {
          setNftBtnLoading(false);
          return {
            title: 'Staking Failed',
            description: err.message || 'Please check your wallet settings or network',
            position: 'top',
          };
        },
      }
    );
  };
  // 开始授权

  const startApprove = async () => {
    if (!isConnected) {
      toast({
        position: 'top',
        title: 'Reminder',
        description: 'Please connect your wallet first',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    // Start loading state
    setNftBtnLoading(true);

    // Approve NFT first
    await approveNft();
  };
  // --------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (nftApproved) {
      // 再授权DGC
      approveDgc();
    }
  }, [nftApproved]);

  useEffect(() => {
    if (dgcApproved) {
      handleAddNftToStake();
    }
  }, [dgcApproved]);

  useEffect(() => {
    if (isAddSuccess) {
      setNftBtnLoading(false);
      toast({
        title: 'Reminder',
        description: 'Congratulations, staking successful!',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      nftOnPledgeModalClose();
    }
  }, [isAddSuccess]);

  // 质押原生DBC代币
  const [dbcBtnLoading, setDbcBtnLoading] = useState(false);
  const [pledgedDbcCount, setPledgedDbcCount] = useState('');
  const [dockerId, setDockerId] = useState('');
  const [toPledgedDbcCount, settoPledgedDbcCount] = useState('');

  const dbgStake = useWriteContract();
  const { data: addDbcHash } = dbgStake;
  const { isSuccess: isAddDbcSuccess } = useWaitForTransactionReceipt({
    hash: addDbcHash,
  });

  const handleAddDbcToStake = async () => {
    if (!isConnected) {
      toast({
        position: 'top',
        title: 'Reminder',
        description: 'Please connect your wallet first',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setDbcBtnLoading(true);
    return toast.promise(
      dbgStake.writeContractAsync({
        address: DBC_CONTRACT_ADDRESS,
        abi: dbcAbi,
        functionName: 'stakeDbc',
        args: [dockerId, parseEther(pledgedDbcCount)],
        value: parseEther(pledgedDbcCount),
      }),

      {
        loading: {
          title: 'Staking in Progress',
          description: 'Please confirm the transaction in your wallet',
          position: 'top',
        },
        success: (txHash) => {
          console.log('Staking transaction sent:', txHash);
          return {
            title: 'Staking Transaction Sent',
            description: 'The staking transaction has been sent',
            position: 'top',
          };
        },
        error: (err) => {
          setDbcBtnLoading(false);
          return {
            title: 'Staking Failed',
            description: err.message || 'Please check your wallet settings or network',
            position: 'top',
            isClosable: true,
          };
        },
      }
    );
  };

  useEffect(() => {
    if (isAddDbcSuccess) {
      setDbcBtnLoading(false);
      toast({
        title: 'Reminder',
        description: 'Congratulations, staking successful!',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      dbcOnPledgeModalClose();
    }
  }, [isAddDbcSuccess]);
  return {
    nftBtnLoading,
    approveDgc,
    pledgedNftCount,
    setPledgedNftCount,
    pledgedDgcCount,
    setPledgedDgcCount,
    machineId,
    setMachineId,
    startApprove,
    handleAddDbcToStake,
    dbcBtnLoading,
    pledgedDbcCount,
    dockerId,
    toPledgedDbcCount,
    setPledgedDbcCount,
    setDockerId,
    settoPledgedDbcCount,
  };
}
