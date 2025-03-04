import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import nftStakinigAbi from './freeModeAbi.json';
import dgcAbi from './dgcAbi.json';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';

const NFT_CONTRACT_ADDRESS = '0xC40ba6AC7Fcd11B8E0Dc73c86b0F8D63714F6494';
const DGC_CONTRACT_ADDRESS = '0xb6aD0ddC796A110D469D868F6A94c80e3f53D384';
const NFTSTAKING = '0xdC8856cFd02b0fb3821F06667EEC373a020a46AD';

import { useToast } from '@chakra-ui/react';

export function useLongH(dailog: () => void) {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig(); // 获取全局配置

  // 授权NFT
  const [BtnLoading, setBtnLoading] = useState(false);
  // 质押dgc的数量
  const [stakedDgcAmount, setStakedDgcAmount] = useState('');

  // 质押nft的数量
  const [stakedNftAmount, setStakedNftAmount] = useState('');

  // 容器id
  const [containerId, setContainerId] = useState('');

  // substrate上面生成的机器id
  const [machineId, setMachineId] = useState('');

  // 租用id
  const [leaseId, setLeaseId] = useState('');

  const nftApproval = useWriteContract();
  const { data: nftHash } = nftApproval;

  // 授权NFT
  const { isSuccess: nftApproved } = useWaitForTransactionReceipt({ hash: nftHash });
  const approveNft: any = async () => {
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
    setBtnLoading(true);

    return toast.promise(
      nftApproval.writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: 'setApprovalForAll',
        args: [NFTSTAKING, true],
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
          setBtnLoading(false);

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
        args: [NFTSTAKING, stakedDgcAmount],
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
          setBtnLoading(false);
          return {
            title: 'Approval Failed',
            description: err.message || 'Please check your wallet settings or network',
            position: 'top',
          };
        },
      }
    );
  };

  // 进行质押
  const nftStaking = useWriteContract();
  const { data: nftStakingHash } = nftStaking;
  const { isSuccess: nftStakingSuccess } = useWaitForTransactionReceipt({ hash: nftStakingHash });
  const nftStakingH = async () => {
    return toast.promise(
      nftStaking.writeContractAsync({
        address: NFTSTAKING,
        abi: nftStakinigAbi,
        functionName: 'stake',
        args: [machineId, containerId, stakedDgcAmount, stakedNftAmount, leaseId],
      }),

      {
        loading: { title: 'Staking', description: 'Please confirm the transaction in your wallet', position: 'top' },
        success: (txHash) => {
          console.log('NFT staking transaction sent:', txHash);
          return {
            title: 'NFT Staking Successful',
            description: 'Staking completed',
            position: 'top',
          };
        },
        error: (err) => {
          setBtnLoading(false);
          return {
            title: 'Staking Failed',
            description: err.message || 'Please check your wallet settings or network',
            position: 'top',
          };
        },
      }
    );
  };

  useEffect(() => {
    if (nftApproved) {
      approveDgc();
    }
  }, [nftApproved]);

  useEffect(() => {
    if (dgcApproved) {
      nftStakingH();
    }
  }, [dgcApproved]);

  useEffect(() => {
    if (nftStakingSuccess) {
      toast({
        title: 'Congratulations! Staking Successful',
        description: 'You have successfully staked DGC and NFT',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setBtnLoading(false);
    }
  }, [nftStakingSuccess]);
  // machin ID: a8aeafb706433fc89c16817e8405705bd66f28b6d5cfc46c9da2faf7b204da78
  // private key: d85789ca443866f898a928bba3d863a5e3c66dc03b03a7d947e8dde99e19368e
  return {
    BtnLoading,
    stakedDgcAmount,
    setStakedDgcAmount,
    stakedNftAmount,
    setStakedNftAmount,
    containerId,
    setContainerId,
    machineId,
    setMachineId,
    leaseId,
    setLeaseId,
    approveNft,
  };
}
