import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import freeMode from './freeModeAbi.json';
import dgcAbi from './dgcAbi.json';
import { useToast } from '@chakra-ui/react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useEffect, useState } from 'react';

const NFT_CONTRACT_ADDRESS = '0xC40ba6AC7Fcd11B8E0Dc73c86b0F8D63714F6494';
const DGC_CONTRACT_ADDRESS = '0xb6aD0ddC796A110D469D868F6A94c80e3f53D384';
const FREEMODE_CONTRACT_ADDRESS = '0x9b35c3b9E13E058d958364eA0e7692a0d5D39Ab4';
export function useFreeH(nftOnPledgeModalClose: () => void) {
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
        loading: { title: '授权中', description: '请在钱包中确认交易', position: 'top' },
        success: (txHash) => {
          console.log('DGC  授权交易已发送:', txHash);
          return { title: 'DGC 授权成功', description: '授权已完成', position: 'top' };
        },
        error: (err) => ({
          title: '授权失败',
          description: err.message || '请检查钱包设置或网络',
          position: 'top',
        }),
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
    try {
      // Step 1: 发送交易调用 addDLCToStake
      const txHash = await nftStake.writeContractAsync({
        address: FREEMODE_CONTRACT_ADDRESS,
        abi: freeMode,
        functionName: 'stake',
        args: [machineId, pledgedDgcCount, pledgedNftCount],
        // 使用传入的 machineId 和 amount
      });
      console.log('交易已发送，txHash:', txHash);

      // Step 2: 等待交易确认
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      if (receipt.status === 'success') {
        console.log('添加NFT成功，txHash:', txHash);
      } else {
        console.log('添加NFT失败，交易被回滚，txHash:', txHash);
      }
    } catch (err) {
      console.error('添加NFT失败，错误:', err);
    }
  };
  // 开始授权
  const startApprove = async () => {
    if (!isConnected) {
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
    // 开始加载状态
    setNftBtnLoading(true);

    // 先授权NFT
    await approveNft();
    // 再授权DGC
    approveDgc();
  };
  // --------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (dgcApproved && nftApproved) {
      try {
        handleAddNftToStake();
      } catch {
        setNftBtnLoading(false);
      }
    }
  }, [dgcApproved]);

  useEffect(() => {
    if (isAddSuccess) {
      setNftBtnLoading(false);
      toast({
        title: '提示',
        description: '恭喜您，质押成功！',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      nftOnPledgeModalClose();
    }
  }, [isAddSuccess]);

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
  };
}
