/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';

import { fetchContractAddress } from './contract.service';

type Props = {
  open: boolean;
  inscriptionId: string;
  setOpen: (val: boolean) => void;
  rlp: string;
};
const SuccessModal = ({ open, inscriptionId, setOpen, rlp }: Props) => {
  const toast = useToast();
  const [ contractAddress, setContractAddress ] = useState('');
  const handleClose = () => {
    setOpen(false);
  };
  const copyTransactionId = () => {
    navigator.clipboard.writeText(inscriptionId);
    toast({
      description: 'Transaction Id copied successfully',
      status: 'success',
    });
  };
  const copyContractId = () => {
    navigator.clipboard.writeText(contractAddress);
    toast({
      description:
           'Contract Id copied successfully',
      status: 'success',
    });
  };
  useEffect(() => {
    if (localStorage.getItem('address')) {
      fetchContractAddress({
        inscriptionId:
          '736b2929da7601c4efc2af5e744368d1ea9fea2d7d430ef9bfda6750ea525acci0',
        address: localStorage.getItem('address'),
        rlp: rlp,
      })
        .then(async(response: any) => {
          const data = await response.json();
          setContractAddress(data?.data?.contractAddress);
        })
        .catch((err: any) => {
          toast({
            description: err?.message || 'Error',
            status: 'error',
          });
        });
    }
  }, [ rlp, toast ]);
  return (
    <Modal isOpen={ open } onClose={ handleClose }>
      <ModalContent>
        <ModalCloseButton/>
        <ModalBody fontWeight={ 700 } fontSize={ 20 }>
          Contract Inscribed successfully.
        </ModalBody>
        <ModalBody
          fontSize={ 16 }
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          { ' ' }
          Tx ID : { inscriptionId?.substring(0, 10) }...
          { inscriptionId?.substring(56, 66) }
          <FaRegCopy className="cursor-pointer" onClick={ copyTransactionId }/>
        </ModalBody>
        <ModalBody
          fontSize={ 16 }
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          { ' ' }
          Contract ID : { contractAddress?.substring(0, 10) }...
          { contractAddress?.substring(56, 66) }
          <FaRegCopy className="cursor-pointer" onClick={ copyContractId }/>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="end">
          <Button colorScheme="blue" onClick={ handleClose }>
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
