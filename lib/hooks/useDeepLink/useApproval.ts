import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import erc20Abi from './dlcAbi.json';
import stakingAbi from './stakingLongAbi.json';
import { useToast } from '@chakra-ui/react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useState } from 'react';

// 主网：
// 长租质押合约：0x3c059dbe0f42d65acd763c3c3da8b5a1b12bb74f
//  NFT: 0x905dE58579886C5afe9B6406CFDE82bd6a1087C1
//  DLC: 0xC8b47112D5413c6d06D4BB7573fD903908246614
// 短租质押合约：0x6268aba94d0d0e4fb917cc02765f631f309a7388

// machin ID: a8aeafb706433fc89c16817e8405705bd66f28b6d5cfc46c9da2faf7b204da78
// private key: d85789ca443866f898a928bba3d863a5e3c66dc03b03a7d947e8dde99e19368e
const NFT_CONTRACT_ADDRESS = '0x905dE58579886C5afe9B6406CFDE82bd6a1087C1';
const DLC_TOKEN_ADDRESS = '0xC8b47112D5413c6d06D4BB7573fD903908246614';
const STAKING_CONTRACT_ADDRESS = '0x7FDC6ed8387f3184De77E0cF6D6f3B361F906C21';
import { createMachine } from '../../../ui/mymachine/modules/api/index';

export function useApproval(onPledgeModalClose?: () => void, onPledgeModalCloseDLC?: () => void) {
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

    setLoading(true);

    // 获取余额
    refetch();

    const hash = await nftApproval.writeContractAsync({
      address: NFT_CONTRACT_ADDRESS,
      abi: nftAbi,
      functionName: 'setApprovalForAll',
      args: [STAKING_CONTRACT_ADDRESS, true],
    });
    console.log(hash, '授权交易hash');

    toast({
      position: 'top',
      title: '交易已发送',
      status: 'success',
      description: `授权交易发送成功，请等待成功！hash:${hash}`,
      isClosable: true,
    });
    try {
      waitForTransactionReceipt(config, { hash: hash }).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 'success') {
          console.log('成功授权了');
          toast({
            position: 'top',
            title: '成功',
            status: 'success',
            description: '授权成功，请继续等待质押！',
            isClosable: true,
          });
          stake();
        } else {
          console.log(receipt);
        }
      });
    } catch (error) {
      setLoading(false);
      return {
        title: '授权失败',
        description: error || '授权失败',
        position: 'top',
        duration: null,
        isClosable: true,
      };
    }
  };

  // 最终的质押方法
  const staking = useWriteContract();
  const stake = async () => {
    try {
      const hash = await staking.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'stake',
        args: [
          address,
          rentalMachineIdOnChain,
          nftData === undefined ? [] : nftData[0],
          nftData === undefined ? [] : nftData[1],
          machineId,
        ],
      });
      console.log('质押:', hash);
      toast({
        position: 'top',
        title: '交易已发送',
        status: 'success',
        description: `质押交易发送成功，请等待成功！hash:${hash}`,
        isClosable: true,
      });
      waitForTransactionReceipt(config, { hash: hash }).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 'success') {
          console.log('成功质押了');

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
                  position: 'top',
                  title: '成功',
                  status: 'success',
                  description: '成功质押了',
                  isClosable: true,
                });
                if (onPledgeModalClose) {
                  onPledgeModalClose();
                }
              } else {
                toast({
                  position: 'top',
                  title: '质押成功，但创建机器失败！',
                  status: 'error',
                  description: res.msg,
                  isClosable: true,
                });
                setLoading(false);
              }
            } catch (err: any) {
              console.log(err, '////////////////');
              toast({
                position: 'top',
                title: '警告',
                status: 'warning',
                description: '质押成功，但创建机器失败！',
                isClosable: true,
              });
              setLoading(false);
            }
          };
          handleCreateMachine();
        } else {
          console.log('失败了', receipt);
          setLoading(false);
        }
      });
    } catch (error: any) {
      setLoading(false);
      console.log(error, 'errorerror');
    }
  };

  // DLC 授权
  const [dlcBtnLoading, setDlcBtnLoading] = useState(false);
  const [dlcNodeId, setdlcNodeId] = useState('');
  const [dlcNodeCount, setDlcNodeCount] = useState('');
  const dlcApproval = useWriteContract();

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

    const hash = await dlcApproval.writeContractAsync({
      address: DLC_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [STAKING_CONTRACT_ADDRESS, dlcNodeCount],
    });

    console.log('dlc授权hash:', hash);
    toast({
      position: 'top',
      title: 'DLC授权交易已发送',
      status: 'success',
      description: `DLC授权交易发送成功，请等待成功！hash:${hash}`,
      isClosable: true,
    });
    try {
      waitForTransactionReceipt(config, { hash: hash }).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 'success') {
          console.log('成功授权了');

          toast({
            position: 'top',
            title: '成功',
            status: 'success',
            description: `授权成功，请等待DLC质押操作！`,
            isClosable: true,
          });
          handleAddDLCToStake();
        } else {
          console.log('失败了', receipt);
          setDlcBtnLoading(false);
        }
      });
    } catch (error: any) {
      setDlcBtnLoading(false);
      toast({
        position: 'top',
        title: '失败',
        status: 'error',
        description: error || '授权失败',
        isClosable: true,
      });
    }
  };
  // 交易方法：添加 DLC 到质押
  // const { writeContractAsync } = useWriteContract();
  const dlcStake = useWriteContract();

  // 开始质押 DLC
  const handleAddDLCToStake = async () => {
    try {
      // return toast.promise(
      //   dlcStake.writeContractAsync({
      //     address: STAKING_CONTRACT_ADDRESS,
      //     abi: stakingAbi,
      //     functionName: 'addDLCToStake',
      //     args: [dlcNodeId, dlcNodeCount], // 使用传入的 machineId 和 amount
      //   }),
      //   {
      //     loading: {
      //       title: 'In Progress',
      //       description: 'Please confirm the transaction in your wallet',
      //       position: 'top',
      //     },
      //     success: (txHash) => {
      //       console.log('DLC staking transaction sent:', txHash);
      //       return {
      //         title: 'Transaction Sent',
      //         description: 'DLC transaction sent successfully, please wait for confirmation!',
      //         position: 'top',
      //         duration: 2000,
      //         isClosable: true,
      //       };
      //     },
      //     error: (err) => {
      //       setDlcBtnLoading(false);
      //       return {
      //         title: 'Transaction sending failed',
      //         description: err.message || 'Please check wallet settings or network',
      //         position: 'top',
      //         status: 'error',
      //         duration: 2000,
      //         isClosable: true,
      //       };
      //     },
      //   }
      // );
      const hash = await dlcStake.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'addDLCToStake',
        args: [dlcNodeId, dlcNodeCount], // 使用传入的 machineId 和 amount
      });
      console.log(`DLC质押交易发送成功，请等待成功！hash:${hash}`);
      toast({
        position: 'top',
        title: '交易已发送',
        status: 'success',
        description: `DLC质押交易发送成功，请等待成功！hash:${hash}`,
        isClosable: true,
      });
      waitForTransactionReceipt(config, { hash: hash }).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 'success') {
          console.log('dlc质押成功');
          if (onPledgeModalCloseDLC) {
            onPledgeModalCloseDLC();
          }
          toast({
            position: 'top',
            title: '成功',
            status: 'success',
            description: `dlc质押成功！`,
            isClosable: true,
          });
        } else {
          console.log('失败了', receipt);
          setDlcBtnLoading(false);
        }
      });
    } catch (err: any) {
      console.log(err, 'errrrrrr');
      setDlcBtnLoading(false);
      toast({
        title: '交易失败',
        description: err,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return {
    approveNft,
    approveDlcToken,
    stake,
    handleAddDLCToStake,
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
  };
}
