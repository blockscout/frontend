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
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Skeleton,
} from '@chakra-ui/react';
import { useTimeoutFn } from '@reactuses/core';
import React, { useEffect, useState } from 'react';

function RestakeBtn() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const [ nftNodeCount, setNftNodeCount ] = useState('');
  const [ machineId, setMachineId ] = useState('');
  const [ rentalMachineIdOnChain, setRentalMachineIdOnChain ] = useState('');
  const [ privateKey, setPrivateKey ] = useState('');
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
          Restake
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

        <AlertDialogContent>
          <AlertDialogHeader>Confirmation</AlertDialogHeader>
          <AlertDialogCloseButton/>
          <AlertDialogBody>
            { /* Are you sure you want to discard all of your notes? 44 words will be deleted. */ }
            <FormControl mb={ 4 } size="sm">
              <FormLabel fontSize="sm">Number of NFT nodes to pledge</FormLabel>
              <Input
                value={ nftNodeCount }
                onChange={ (e) => setNftNodeCount(e.target.value) }
                placeholder="Enter number of nodes"
                size="sm"
              />
              <FormHelperText fontSize="xs">
                A minimum of 1 NFT and a maximum of 20 NFT need to be pledged
              </FormHelperText>
            </FormControl>

            <FormControl mb={ 4 } size="sm">
              <FormLabel fontSize="sm">ID of the machine you want to pledge</FormLabel>
              <Input
                value={ machineId }
                onChange={ (e) => setMachineId(e.target.value) }
                placeholder="Enter machine ID"
                size="sm"
              />
            </FormControl>

            <FormControl mb={ 4 } size="sm">
              <FormLabel fontSize="sm">ID for On-chain Rental setRentalMachineIdOnChain</FormLabel>
              <Input
                value={ rentalMachineIdOnChain }
                onChange={ (e) => setRentalMachineIdOnChain(e.target.value) }
                placeholder="Enter the ID for on-chain rental"
                size="sm"
              />
            </FormControl>

            <FormControl mb={ 6 } size="sm">
              <FormLabel fontSize="sm">Machine private key you want to pledge</FormLabel>
              <Input
                value={ privateKey }
                onChange={ (e) => setPrivateKey(e.target.value) }
                placeholder="Enter private key"
                type="password"
                size="sm"
              />
            </FormControl>
          </AlertDialogBody>
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

export default RestakeBtn;
