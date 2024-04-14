/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';

import ContentLoader from 'ui/shared/ContentLoader';

import { checkContract, fetchInscriptionService } from './contract.service';
import NuiContractMethodsAccordion from './NuiContractMethodsAccordion';
import { findMostMatchedString } from './utils';

type PropTypes = {
  currentTab: 'contract' | 'transactions' | 'write' | 'read';
};

const NuiContractRead = ({ currentTab }: PropTypes) => {
  const toast = useToast();
  const inscriptionId =
    '719531b285391ce5fb68d54176387bcfce381e9c6ddd993d260515556383f38ei0';
  // const [inscriptionId, setInscriptionId] = useState<string>(
  //   "719531b285391ce5fb68d54176387bcfce381e9c6ddd993d260515556383f38ei0"
  // );
  const [ data, setData ] = useState<any>();
  // const [inscriptionData, setInscriptionData] = useState<Record<string, any>>(
  //   {}
  // );

  const convertByteCodeToSHA256 = async(byteCode: string) => {
    try {
      const web3ForSha = new Web3();
      const sha256Hash = web3ForSha.utils.sha3(byteCode);
      return sha256Hash;
    } catch (error) {
    }
  };

  const compileCode = useCallback(
    (sc: string, bytecode: string) => {
      const worker = new Worker('/bundle.js');
      worker.addEventListener(
        'message',
        (e: MessageEvent) => {
          const output = e?.data?.output;
          if (output?.errors?.length > 0) {
            return;
          }
          const tempContractsList =
            output?.contracts?.[`contracts/contract.sol`];
          const mostMatched = findMostMatchedString(
            bytecode?.substring(2),
            tempContractsList,
          );
          setData(mostMatched);
        },
        false,
      );
      worker.postMessage({
        contractCode: decodeURIComponent(atob(sc)),
      });
    },
    [],
  );
  const checkAndGetSourceCode = async(byteCode: string) => {
    const contractHash = (await convertByteCodeToSHA256(byteCode)) ?? '';
    try {
      const response = await checkContract({
        contractHash: contractHash ?? '',
        inscriptionId,
      });
      if (!response.ok) {
        toast({
          description: 'Some error occured. Please try again...',
          status: 'error',
        });
        return false;
      }
      const data: any = await response.json();
      if (data?.exists) {
        compileCode(data?.raw_code?.source_code, byteCode);
      } else {
        // console.error("Code doesn't Exists.");
      }
    } catch (error: any) {
      // console.log("error", error);
      return false;
    }
  };
  const fetchInscriptionData = async(): Promise<any> => {
    if (!inscriptionId) {
      // console.log({ inscriptionId });
      return false;
    }
    try {
      const response = await fetchInscriptionService({
        inscriptionId,
      });
      if (!response.ok) {
        // console.error("Invalid Inscription ID");
        return false;
      }
      const data = await response.json();
      // setInscriptionData(data);
      return data;
    } catch (error: any) {
      // console.error(error);
      return false;
    }
  };
  const getAbi = async() => {
    const inscriptionResponse = await fetchInscriptionData();
    if (!inscriptionResponse) {
      return;
    }
    const sc = inscriptionResponse?.raw_code?.source_code;
    if (!sc) {
      await checkAndGetSourceCode(inscriptionResponse?.bytecode);
      // toast.error('Inscription is not a valid contract');
      // setIsLoading(false);
      return;
    }
    compileCode(sc, inscriptionResponse?.bytecode);
  };

  useEffect(() => {
    getAbi();
  }, []);

  if (!data) {
    return (
      <Box width="50%" margin="auto" textAlign="center" mt={ 2 }>
        <ContentLoader/>
      </Box>
    );
  }

  return <NuiContractMethodsAccordion data={ data } currentTab={ currentTab }/>;
};

export default React.memo(NuiContractRead);
