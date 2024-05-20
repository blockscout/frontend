/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

import { createOrder, fetchOrder, fetchRecommendedFeeRate } from './contract.service';

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  encodedData: string;
  setOpenSuccessModal: (val: boolean) => void;
  setInscriptionId: (val: string) => void;
};
export function stringToBase64(stringToEncode: string) {
  // btoa only support ascii, use js-base64 instead
  return btoa(stringToEncode);
}
const InscribeModal = ({ open, setOpen, encodedData, setOpenSuccessModal, setInscriptionId }: Props) => {
  const toast = useToast();
  const [ outputValue, setOutputValue ] = useState<any>(564);
  const [ feeRate, setFeeRate ] = useState<any>(0);

  const handleClose = () => {
    setOpen(false);
  };
  const feeHandler = useCallback(async() => {
    try {
      const response = await fetchRecommendedFeeRate();
      const res: any = await response.json();
      setFeeRate(res?.halfHourFee);
    } catch (error: any) {
      toast({
        description: error?.message || '',
        status: 'error',
      });
    }
  }, [ toast ]);

  useEffect(() => {
    feeHandler();
  }, [ feeHandler ]);

  const inscribeOrder = async() => {
    try {
      const response = await createOrder({
        receiveAddress: localStorage.getItem('address') || '',
        feeRate: Number(feeRate),
        outputValue,
        files: [
          {
            dataURL: `data:text/plain;charset=utf-8;base64,${ stringToBase64(encodedData) }`,
            filename: encodedData.slice(0, 64),
          },
        ],
        devAddress: '',
        devFee: 0,
      });

      const data: any = await response.json();
      await signOrderId(
        data?.data?.orderId,
        data?.data?.payAddress,
        data?.data?.amount,
        data?.data?.feeRate,
      );
    } catch (error: any) {
      toast({
        description: error?.message || 'Error',
        status: 'error',
      });
      setOpen(false);

    }

  };
  const fetchOrderDetails = async(orderId: string) => {
    try {
      const response = await fetchOrder(orderId);
      if (response.ok) {
        const data: any = await response.json();
        if (data?.data?.files?.[0]?.status !== 'pending') {
          setInscriptionId(data?.data?.files?.[0]?.inscriptionId ?? '');
          setOpenSuccessModal(true);
        } else {
          setTimeout(() => {
            fetchOrderDetails(orderId);
          }, 60000);
        }
      }
    } catch (error) {
      toast({ description: 'Some error occurred. Please try again!', status: 'error' });
    } finally {
      handleClose();
    }
  };
  const signOrderId = async(
    orderId: string,
    payAddress: string,
    orderAmount: number,
    orderFeeRate: number,
  ) => {
    const message = JSON.stringify({
      orderId,
    });
    await (window as any)?.unisat?.signMessage(message);
    const returnedSomething = await (window as any).unisat.sendBitcoin(
      payAddress,
      orderAmount,
      orderFeeRate,
    );
    if (returnedSomething) {
      fetchOrderDetails(orderId);
    }
  };
  return (
    <Modal isOpen={ open } onClose={ handleClose }>
      <ModalContent>
        <ModalHeader>Inscribe</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <FormControl>
            <FormLabel>Output Value</FormLabel>
            <Input
              type="number"
              value={ outputValue }
              onChange={ (e) => setOutputValue(e.target.value) }
            />
          </FormControl>
          <FormControl mt={ 4 }>
            <FormLabel>Fee Rate</FormLabel>
            <Input
              type="number"
              value={ feeRate }
              onChange={ (e) => setFeeRate(e.target.value) }
            />
          </FormControl>
        </ModalBody>

        <ModalFooter display="flex" justifyContent="end">
          <Button colorScheme="blue" onClick={ inscribeOrder }>
            Inscribe
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InscribeModal;
