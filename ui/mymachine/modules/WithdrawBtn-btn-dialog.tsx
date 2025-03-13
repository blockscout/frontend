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
import React from 'react';
import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useConfig } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import stakingAbi from '../../../lib/hooks/useDeepLink/stakingLongAbi.json';

const STAKING_CONTRACT_ADDRESS = '0x7FDC6ed8387f3184De77E0cF6D6f3B361F906C21';

function WithdrawBtn({ id, forceRerender }: { id: string; forceRerender: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPending] = useTimeoutFn(() => {}, 2000, { immediate: true });
  const config = useConfig();
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const claim = useWriteContract();

  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  const getClaim = async () => {
    try {
      console.log('id是', id);
      setBtnData({ isLoading: true, loadingText: 'Sending...' });

      // 使用 Promise 链合并交易发送和确认
      const transactionPromise = claim
        .writeContractAsync({
          address: STAKING_CONTRACT_ADDRESS,
          abi: stakingAbi,
          functionName: 'claim',
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

  const handleConfirmClick = async () => {
    await getClaim();
  };

  return (
    <>
      <Skeleton isLoaded={!isPending}>
        <Button size="sm" variant="outline" onClick={onOpen}>
          Withdraw
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
          <AlertDialogBody>Are you sure you want to withdraw the earnings?</AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={handleConfirmClick}>
                Confirm
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default WithdrawBtn;
