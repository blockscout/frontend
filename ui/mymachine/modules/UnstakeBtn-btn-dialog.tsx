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
import { deleteMachine } from '../modules/api/index';
import { useApproval } from '../../../lib/hooks/useDeepLink/useApproval';
import { ascending } from 'd3';

interface UnstakeBtnProps {
  id: string;
}

function UnstakeBtn({ id }: UnstakeBtnProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  // 按钮数据
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });
  const { handleUnStake, isUnStakeed } = useApproval();

  // 模拟确认点击事件
  const handleConfirmClick = async () => {
    setBtnData({
      isLoading: true,
      loadingText: 'loading',
    });

    handleUnStake(id);
  };
  const [isPending, start] = useTimeoutFn(() => {}, 2000, { immediate: true });

  // 删除机器
  const deleteMachine = async (id: any) => {
    const res: any = await deleteMachine(id);
    console.log(res, '<<<<<<<<<<<<<<<<<<<<<<<<<<');

    if (res.code === 200) {
      setBtnData({
        isLoading: false,
        loadingText: '',
      });
    }
  };

  useEffect(() => {
    if (isUnStakeed) {
      deleteMachine(id);
    }
  }, [isUnStakeed]);
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

export default UnstakeBtn;
