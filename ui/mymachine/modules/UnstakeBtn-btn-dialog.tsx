import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useDisclosure,
  Skeleton,
} from '@chakra-ui/react';
import { useTimeoutFn } from '@reactuses/core';
import React, { useEffect } from 'react';
import { useApproval } from '../../../lib/hooks/useDeepLink/useApproval';
import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useConfig } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import stakingAbi from '../../../lib/hooks/useDeepLink/stakingLongAbi.json';
import { deleteMachine } from './api/index';
import { usePolling } from './hooks/usePolling';
import { getTimestamp } from './api/index';

const STAKING_CONTRACT_ADDRESS = '0x3c059dbe0f42d65acd763c3c3da8b5a1b12bb74f';

interface UnstakeBtnProps {
  id: string;
  forceRerender: any;
}

function UnstakeBtn({ id, forceRerender }: UnstakeBtnProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const config = useConfig();
  const toast = useToast();
  const unstake = useWriteContract();
  const [isPending, start] = useTimeoutFn(() => {}, 2000, { immediate: true });
  // 是否可以解除质押
  const [canUnstake, setCanUnstake] = React.useState(false);

  // 按钮数据
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  // 模拟确认点击事件
  const unstakeH = async () => {
    try {
      // 先判断是否可以解除质押
      if (!canUnstake) {
        console.log('不可以解除质押');
        toast({
          title: 'Reminder',
          description: 'It is not yet time to unstake, please wait patiently!',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
        return;
      }
      console.log('id是', id);
      setBtnData({ isLoading: true, loadingText: 'Sending...' });

      // 使用 Promise 链合并交易发送和确认
      const transactionPromise = unstake
        .writeContractAsync({
          address: STAKING_CONTRACT_ADDRESS,
          abi: stakingAbi,
          functionName: 'unStake',
          args: [id],
        })
        .then((txHash) =>
          waitForTransactionReceipt(config, { hash: txHash }).then((receipt) => {
            return {
              txHash,
              receipt,
            };
          })
        );

      // 使用 toast.promise 管理整个流程
      await toast.promise(transactionPromise, {
        loading: {
          title: 'In Progress',
          description: 'Please confirm the transaction in your wallet',
          position: 'top',
          duration: null, // 确保加载状态持续到 Promise 完成
        },
        success: ({ txHash, receipt }) => {
          setBtnData({ isLoading: false, loadingText: '' });
          if (receipt.status === 'success') {
            // 删除机器
            deleteMachineH();
            // 重新渲染
            forceRerender();
            onClose();
            return {
              title: 'Transaction Confirmed',
              description: 'DLC staking completed successfully!',
              status: 'success',
              position: 'top',
              duration: 2000,
              isClosable: true,
            };
          } else {
            setBtnData({ isLoading: false, loadingText: '' });

            return {
              title: 'Transaction Failed',
              description: 'Transaction failed!',
              status: 'error',
              position: 'top',
              duration: 2000,
              isClosable: true,
            };
          }
        },
        error: (err) => {
          setBtnData({ isLoading: false, loadingText: '' });
          return {
            title: 'Transaction Failed',
            description: err.message || 'Please check wallet settings or network',
            status: 'error',
            position: 'top',
            duration: 2000,
            isClosable: true,
          };
        },
      });
    } catch (err: any) {
      console.error('领取奖励出错:', err);
    }
  };

  // 删除机器
  const deleteMachineH = async () => {
    const res: any = await deleteMachine(id);

    if (res.code === 200) {
      setBtnData({
        isLoading: false,
        loadingText: '',
      });
    }
  };

  // 定义轮询执行的函数
  const checkStakeStatus = async () => {
    const res: any = await getTimestamp(id);
    console.log(res, 'MMMMM');
    if (res.code === 200) {
      if (res.ended) {
        setCanUnstake(true);
        console.log('自动解除质押');
        unstakeH();
      } else {
        setCanUnstake(false);
        console.log('时间还没到');
      }
    }
  };
  // 使用 usePolling Hook，传入 checkStakeStatus 和轮询间隔（60秒）
  usePolling(checkStakeStatus, 60 * 1000);

  return (
    <>
      <Skeleton isLoaded={!isPending}>
        <Button size="sm" variant="outline" onClick={onOpen}>
          Unstake
        </Button>
      </Skeleton>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent className="!max-w-[500px]">
          <AlertDialogHeader>Confirmation</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Are you sure you want to unstake?</AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={unstakeH}>
                Confirm
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UnstakeBtn;
