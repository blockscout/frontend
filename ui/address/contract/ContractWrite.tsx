/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Web3 from 'web3';
// import { useAccount, useWalletClient, useSwitchChain } from 'wagmi';

import type { SmartContractWriteMethod } from 'types/api/contract';

// import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import hashEncodingHandler from 'lib/compile';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractCustomAbiAlert from './ContractCustomAbiAlert';
import ContractImplementationAddress from './ContractImplementationAddress';
import ContractWriteResult from './ContractWriteResult';
import InscribeModal from './InscribeModal';
import ContractMethodForm from './methodForm/ContractMethodForm';
import SuccessModal from './SuccessModal';
import useContractAbi from './useContractAbi';
// import { getNativeCoinValue, prepareAbi } from './utils';

const infuraUrl = 'https://mainnet.infura.io/v3/18b346ece35742b2948e73332f85ad86';

const ContractWrite = () => {
  // const { data: walletClient } = useWalletClient();
  // const { isConnected, chainId } = useAccount();
  const web3 = new Web3(infuraUrl);
  const toast = useToast();
  const address = localStorage.getItem('address');
  const router = useRouter();
  const [ openSuccessModal, setOpenSuccessModal ] = useState<boolean>(false);
  const addressHash = getQueryParamString(router.query.hash);
  const tab = getQueryParamString(router.query.tab);
  const [ open, setOpen ] = useState(false);
  const [ encodedData, setEncodedData ] = useState<string>('');
  const [ inscriptionId, setInscriptionId ] = useState<string>('');

  const isProxy = tab === 'write_proxy';
  const isCustomAbi = tab === 'write_custom_methods';

  const { data, isPending, isError } = useApiQuery(
    isProxy ? 'contract_methods_write_proxy' : 'contract_methods_write',
    {
      pathParams: { hash: addressHash },
      queryParams: {
        is_custom_abi: isCustomAbi ? 'true' : 'false',
      },
      queryOptions: {
        enabled: Boolean(addressHash),
        refetchOnMount: false,
      },
    },
  );

  const contractAbi = useContractAbi({ addressHash, isProxy, isCustomAbi });

  const handleMethodFormSubmit = React.useCallback(
    async(item: any, args: Array<unknown>) => {
      if (!address) {
        throw new Error('Wallet is not connected');
      }
      if (!contractAbi) {
        throw new Error('Something went wrong. Try again later.');
      }
      const methodName = item?.name;

      if (!methodName) {
        throw new Error('Method name is not defined');
      }
      const inputList = item?.inputs?.map((ele: any, key: number) => {

        if (ele?.type === 'uint256') {
          return Number(args?.[key]);
        }
        return args?.[key];
      }) ?? [];

      const contract = new web3.eth.Contract(contractAbi as any);
      const hash = contract?.methods?.[methodName](
        ...inputList,
      ).encodeABI();
      const newEncodedString: any = await hashEncodingHandler({ byteCode: hash });
      if (typeof newEncodedString === 'string') {
        setEncodedData(newEncodedString);
        setOpen(true);
        return newEncodedString;
      }
      toast({
        description: newEncodedString?.message || 'Error',
        status: 'error',
      });
      setOpen(false);
      return '';
    },
    [ address, contractAbi ],
  );

  const renderItemContent = React.useCallback(
    (item: SmartContractWriteMethod, index: number, id: number) => {
      return (
        <ContractMethodForm
          key={ id + '_' + index }
          data={ item }
          onSubmit={ handleMethodFormSubmit }
          resultComponent={ ContractWriteResult }
          methodType="write"
        />
      );
    },
    [ handleMethodFormSubmit ],
  );

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isPending) {
    return <ContentLoader/>;
  }

  if (data.length === 0 && !isProxy) {
    return <span>No public write functions were found for this contract.</span>;
  }

  return (
    <>
      { isCustomAbi && <ContractCustomAbiAlert/> }
      { /* <ContractConnectWallet /> */ }
      { isProxy && <ContractImplementationAddress hash={ addressHash }/> }
      <ContractMethodsAccordion
        data={ data }
        addressHash={ addressHash }
        renderItemContent={ renderItemContent }
        tab={ tab }
      />
      { open && (
        <InscribeModal
          open={ open }
          setOpen={ setOpen }
          encodedData={ encodedData }
          setOpenSuccessModal={ setOpenSuccessModal }
          setInscriptionId={ setInscriptionId }
        />
      ) }
      { openSuccessModal &&
      <SuccessModal open={ openSuccessModal } inscriptionId={ inscriptionId } setOpen={ setOpenSuccessModal } rlp={ encodedData }/>
      }
    </>
  );
};

export default React.memo(ContractWrite);
