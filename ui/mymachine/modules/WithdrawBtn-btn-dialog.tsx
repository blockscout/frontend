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

function WithdrawBtn() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  // 按钮数据
  const [ btnData, setBtnData ] = React.useState({
    isLoading: false,
    loadingText: '',
  });
  // 模拟确认点击事件
  const handleConfirmClick = async() => {
    setBtnData({
      isLoading: true,
      loadingText: 'loading',
    });
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
        onClose();
      }, 2000);
    });
    setBtnData({
      isLoading: false,
      loadingText: '666666',
    });
    return false;
  };
  const [ isPending, start ] = useTimeoutFn(
    () => {
      console.log('已经3s了', isPending);
    },
    2000,
    { immediate: true },
  );
  return (
    <>
      <Skeleton isLoaded={ !isPending }>
        <Button size="sm" variant="outline" onClick={ onOpen }>
          Withdraw
        </Button>
      </Skeleton>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={ cancelRef }
        onClose={ onClose }
        isOpen={ isOpen }
        isCentered
      >
        <AlertDialogOverlay/>

        <AlertDialogContent className="!max-w-[500px]">
          <AlertDialogHeader>Confirmation</AlertDialogHeader>
          <AlertDialogCloseButton/>
          <AlertDialogBody>Are you sure you want to withdraw the earnings?</AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6">
              <Button colorScheme="blackAlpha" ref={ cancelRef } onClick={ onClose }>
                Cancel
              </Button>
              <Button isLoading={ btnData.isLoading } loadingText={ btnData.loadingText } onClick={ handleConfirmClick }>
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
