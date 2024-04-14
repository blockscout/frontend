/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';

import NuiContractMethodAccordionItems from './NuiContractMethodAccordionItems';
// import Web3 from "web3";

export type ContractItemTypes = {
  inputs?: Array<any>;
  name?: string;
  outputs?: Array<any>;
  stateMutability?: string;
  type?: string;
};

export type PropTypes = {
  data: Record<string, any>;
  currentTab: 'contract' | 'transactions' | 'write' | 'read';
};

const NuiContractMethodsAccordion = ({ data, currentTab }: PropTypes) => {
  const toast = useToast();
  const [ expandedIndex, setExpandedIndex ] = useState('');
  const accordionItemsList = data?.abi?.filter((contractItem: any) => {
    if (currentTab === 'write') {
      return (
        contractItem?.stateMutability === 'nonpayable' &&
          contractItem?.type !== 'constructor'
      );
    }
    return contractItem?.stateMutability === 'view';
  });

  // const infuraUrl ="https://mainnet.infura.io/v3/18b346ece35742b2948e73332f85ad86";
  // const web3 = new Web3(infuraUrl);
  const handleWrite = (
    // contractItem: ContractItemTypes,
    // inputsState: any = []
  ) => {
    // const contract = new web3.eth.Contract(data?.abi);
    // const inputList =
    //   contractItem?.inputs?.map((ele: Record<string, any>) => {
    //     if (ele?.type === "uint256") {
    //       return Number(inputsState?.[ele?.name as string]);
    //     }
    //     return inputsState?.[ele?.name as string];
    //   }) ?? [];
    try {
      // const newData = contract?.methods?.[contractItem?.name as string](
      //   ...inputList
      // ).encodeABI();
    } catch (e: any) {
      if (e.code === 1100) {
        toast({
          status: 'error',
          description: 'Invalid input, please enter valid input and try again!',
        });
      } else {
        toast({
          status: 'error',
          description: 'Something went wrong! Please try again...',
        });
      }
    }
  };
  return (
    <Accordion allowToggle>
      { accordionItemsList?.map((ele: any, index: number) => {
        return (
          <NuiContractMethodAccordionItems
            data={ ele }
            key={ index }
            currentTab={ currentTab }
            serialNo={ index }
            handleWrite={ handleWrite }
            setExpandedIndex={ setExpandedIndex }
            expandedIndex={ expandedIndex }
            lastIndex={ accordionItemsList?.length - 1 }
          />
        );
      }) }
    </Accordion>
  );
};

export default React.memo(NuiContractMethodsAccordion);
