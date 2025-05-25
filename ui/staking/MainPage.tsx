/* eslint-disable */
"use client";

import useAccount from 'lib/web3/useAccount';
import { waitForTransactionReceipt } from '@wagmi/core'
import BigNumber from 'bignumber.js';
import orderBy from 'lodash/orderBy';
import type { NextPage } from 'next';
import isTxConfirmed from './TransactionConfirmed';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import { formatUnits } from 'viem';
import useProvider from 'lib/web3/useProvider';
import { toBigInt , parseUnits} from 'ethers';
import axios from 'axios';
import {  useSendTransaction, useWalletClient, useBalance, usePublicClient } from 'wagmi';
import { useStakeLoginContextValue } from 'lib/contexts/stakeLogin';;
import { useDisclosure } from '@chakra-ui/react';
import TabTable from 'ui/staking/TabTable';
import StakingInfo from 'ui/staking/StakingInfo';


type RequestType = {
  has_next: boolean;
  has_more: boolean;
  next_cursor: string;
  previous_cursor: string;
  title_data: Array<{
    block_number: number;
    credential_id: string;
    from_address: string;
    to_address: string;
    transaction_status: string;
    tx_fee: string;
    tx_hash: string;
    tx_time: string;
    tx_value: string;
  }>;
};



type txType = 'Withdraw' | 'Claim' | 'Stake' | 'MoveStake' | 'ClaimAll' | 'ChooseStake' | 'Compound-Claim' | 'Compound-Stake'


type unsignedTx = {
    to: string;
    data: `0x${string}`;
    value: string;
    gasLimit: string;
    chainId: string;
    from: string;
};


type IssuanceTalbeListType = {
  'Credential ID': string;
  'Txn hash': string;
  Block: string;
  Method: string;
  'From/To': [ string, string ];
  Time: string;
  'Value MOCA': string;
  'Fee MOCA': string;
};

const ObjectDetails: NextPage = () => {
  const [ queryParams, setQueryParams ] = React.useState<{ offset: number; searchTerm: string; page: number }>({
    offset: 0,
    searchTerm: '',
    page: 1,
  });

  const updateQueryParams = (newParams: Partial<{ offset: number; searchTerm: string; page: number }>) => {
    setQueryParams(prevParams => ({
      ...prevParams,
      ...newParams,
    }));
  };

  const [ toNext, setToNext ] = React.useState<boolean>(true);
  const { provider } = useProvider();

  const [ tableList, setTableList ] = React.useState<Array<IssuanceTalbeListType>>([]);

  const tabThead = [ 'Credential ID', 'Txn hash', 'Block', 'Method', 'From/To', 'Time', 'Value MOCA', 'Fee MOCA' ];

  // const url = getEnvValue('NEXT_PUBLIC_CREDENTIAL_API_HOST');
  const { serverUrl : url } = useStakeLoginContextValue();
  const [ totalIssued, setTotalIssued ] = React.useState<number>(0);
  const [ totalCredential, setTotalCredential ] = React.useState<number>(0);
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ nextCursor, setNextCursor ] = React.useState<string>('');
  const [ previousCursor, setpreviousCursor ] = React.useState<string>('');
  const { address: userAddr } = useAccount();
  const { address } = useAccount();

  const handleSearchChange = () => () => {};

  function truncateToSignificantDigits(numberStr: string, significantDigits: number) {
    const num = new BigNumber(numberStr);
    if (num.isZero()) return num;

    const exponent = num.e || 0;

    let decimalPlaces;
    if (num.abs().isLessThan(1)) {
      decimalPlaces = Math.abs(exponent) + significantDigits - 1;
    } else {
      const integerDigits = exponent + 1;
      decimalPlaces = Math.max(significantDigits - integerDigits, 0);
    }

    return num.decimalPlaces(decimalPlaces, BigNumber.ROUND_DOWN);
  }

  const request = React.useCallback(async(hash?: string) => {
    try {
      setLoading(true);
      const rp1 = await (await fetch(url + `/api/v1/explorer/issuancestitle${ hash ? `?cursor=${ hash }` : '' }`,
        { method: 'get' })).json() as RequestType;
      const tableList: Array<IssuanceTalbeListType> = [];
      orderBy(rp1.title_data, [ 'transaction_status' ]).forEach((v: any) => {
        tableList.push({
          'Credential ID': v.credential_id || '/',
          'Txn hash': v.tx_hash,
          Block: v.block_number,
          Method: v.method,
          'From/To': [ v.from_address, v.to_address ],
          Time: v.tx_time,
          'Value MOCA': v.tx_value,
          'Fee MOCA': truncateToSignificantDigits(BigNumber(v.tx_fee / 1e18).toString(10), 3).toString(10),
        });
      });
      setNextCursor(rp1.next_cursor);
      setpreviousCursor(rp1?.previous_cursor || '');
      setToNext(rp1.has_next);
      setTableList(tableList);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  }, [ url ]);

  const requestTotal = React.useCallback(async() => {
    try {
      setLoading(true);
      const rp2 = await (await fetch(url + '/api/v1/explorer/totalissuancesinfo', { method: 'get' })).json() as {
        total_credential_number: number; total_issued_number: number;
      };
      setLoading(false);
      setTotalIssued(rp2.total_credential_number);
      setTotalCredential(rp2.total_issued_number);
    } catch (error: any) {
      setLoading(false);
    }
  }, [ url ]);



  const [ stakedAmount, setStakedAmount ] = React.useState<string>('0');
  const [ claimableRewards, setClaimableRewards ] = React.useState<string>('0');
  const [ withdrawingAmount , setWithdrawingAmount ] = React.useState<string>('0');
  const [ totalRewards, setTotalRewards ] = React.useState<string>('0');

  const requestMyStakingInfo = React.useCallback(async() => {
    if (!userAddr) return;
    const param = new URLSearchParams();
    param.append('address', (userAddr || '').toLowerCase());
    try {
      setLoading(true);
      const res = await axios.get(url + '/api/me/staking/summary' + '?' + param.toString(), {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }).then((response) => {
        return response.data;
      }).catch((error) => {
        return null;
      });
      if(res && res.code === 200) {
        setStakedAmount(res.data.stakedAmount);
        setClaimableRewards(res.data.claimableRewards);
        setWithdrawingAmount(res.data.withdrawingAmount);
        setTotalRewards(res.data.totalRewards);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  }, [ url , userAddr]);


    const requestMyStakingTableList = React.useCallback(async() => {
        if (!address) return;
        const param = new URLSearchParams();
        param.append('address', (address || '').toLowerCase());
        try {
          setLoading(true);
          const res = await axios.get(url + '/api/me/staking/delegations' + '?' + param.toString(), {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }).then((response) => {
            return response.data;
          }).catch((error) => {
            return null;
          });
          if(res && res.code === 200) {
            console.log('res', res);
          }
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
        }
  }, [ url, address ]);

  const requestMyActivityTableList = React.useCallback(async({
    limit = 10,
    offset = 0,
    countTotal = false,
    reverse = false,
    _addr = address,
  }) => {
    if (!_addr) return;
    try {
      setLoading(true);
      const paramStr = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        countTotal: countTotal.toString(),
        reverse: reverse.toString(),
        address: (_addr || '').toLowerCase(),
      }).toString();
      const res = await axios.get(url + '/api/me/staking/activity' + '?' + paramStr, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }).then((response) => {
        return response.data;
      }).catch((error) => {
        return null;
      });
      if(res && res.code === 200) {
        console.log('res', res);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  }, [ url ]);

    const propsPage = React.useCallback((value: number) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      if (value > queryParams.page) {
        request(nextCursor);
      } else {
        request(previousCursor);
      }
      updateQueryParams({
        page: value,
      });
    }, [ queryParams.page, request, nextCursor, previousCursor ]);

  React.useEffect(() => {
    if (url) {
      requestMyStakingInfo();
    }
  }, [ requestMyStakingInfo , url ]);

  React.useEffect(() => {
    if (url) {
      requestMyStakingTableList();
    }
  }, [ requestMyStakingTableList , url ]);

    React.useEffect(() => {
      if (url) {
        requestMyActivityTableList({
          limit: 10,
          offset: 0,
          countTotal: true,
          reverse: false,
          _addr: address,
        });
      }
    }, [ requestMyActivityTableList , address , url ]);


    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ isHideNumber, setIsHideNumber ] = React.useState<boolean>(false);



    const { data: balanceData } = useBalance({ address: userAddr});
    const [ availableAmount, setAvailableAmount ] = React.useState<string>('0.00');

    const formattedBalanceStr = React.useMemo(() => {
        if (balanceData && !!balanceData.value) {
            return formatUnits(balanceData.value, 18);
        }
        return '0.00';
    }, [userAddr , balanceData]);

    const [ isTxLoading, setIsTxLoading ] = React.useState<boolean>(false);
    const [ currentTxType, setCurrentTxType ] = React.useState<txType>('Withdraw');
    const [ modalTitle, setModalTitle ] = React.useState<string>('Withdraw');
    const [ currentAddress, setCurrentAddress ] = React.useState<string>('');
    const [ currentFromAddress, setCurrentFromAddress ] = React.useState<string>('');
    const [ currentItem , setCurrentItem ] = React.useState<any>({});
    const [ currentFromItem , setCurrentFromItem ] = React.useState<any>({});
    const [ currentAmount, setCurrentAmount ] = React.useState<string>('');
    const [ transactionStage , setTransactionStage ] = React.useState<string>('edit'); // 'edit' | 'submitting' | 'success' | ' .... '
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { sendTransactionAsync } = useSendTransaction();
    const [ transactionHash, setTransactionHash ] = React.useState<string>('');
    const [ extraDescription, setExtraDescription ] = React.useState<string | null>(null);

    const signAndSend = async ( amount :string, unsignedTx: unsignedTx | null | undefined ) => {

        if (!unsignedTx) throw new Error('Unsigned transaction null or undefined');
        
        const _unsignedTx = {
            to: unsignedTx.to as `0x${string}`,
            data: unsignedTx.data as `0x${string}`,
            value: currentTxType === 'Stake' ? parseUnits(amount, 18) : BigInt(0),
            gas: BigInt(unsignedTx.gasLimit),
            gasPrice: parseUnits('20', 'gwei'),
        }

        const txHash = await sendTransactionAsync(_unsignedTx);

        return txHash;
    }
    

    const sendTxHashToServer  = React.useCallback(async (txHash: string, param: any) => {
        if (!txHash) return;
        const _newParam = {
            ...param,
            txHash: txHash
        }
        // const res = await (await fetch(url + '/api/staking/broadcast', {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body:  JSON.stringify(_newParam),
        // })).json() as  any;
        const res = await axios.post(url + '/api/staking/broadcast', _newParam, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000,
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            return null;
        });
    } , [url]);


    const handleSubmit = React.useCallback(async (targetAddress: string, txType: string, amount: string, from?: string) => {
        let param = null;
        let apiPath = null;
        if (txType === 'ClaimAll' || txType === 'Compound-Claim') {
            param = {
                "address": userAddr,
                "stakingType": "ClaimAll"
            };
            apiPath = '/api/staking/distribution/prepare/claim-all';
        } else if (txType === 'Compound-Stake') {
            param = {
                "address": userAddr,
                "validatorAddress": targetAddress,
                "amount": amount,
                "stakingType": currentTxType
            };
            apiPath = '/api/staking/prepare/stake';
        } else if (txType === 'ChooseStake') {
            param = {
                "address": userAddr,
                "validatorAddress": targetAddress,
                "amount": amount,
                "stakingType": "Stake"
            };
            apiPath = '/api/staking/prepare/stake';
        }
        setTransactionStage('submitting');

        if (txType === 'Compound-Claim') {
            try {
                setIsTxLoading (true);
                // const res = await (await fetch(url + apiPath, {
                //         method: 'post',
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //         body:  JSON.stringify(param),
                //     })).json() as  any;
                const res = await axios.post(url + apiPath, param, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                }).then((response) => {
                    return response.data;
                }).catch((error) => {;
                    return null;
                });
                if(res && res.code === 200) {
                    if(res.data && res.data.unsignedTx) {
                        const { unsignedTx } = res.data;
                        signAndSend(amount , unsignedTx).then((txHash: string) => {
                            setTransactionHash(txHash);
                            setTransactionStage('comfirming');
                            isTxConfirmed(txHash).then((isConfirmed: boolean) => {
                                if (isConfirmed) {
                                    setTransactionStage('edit');
                                    sendTxHashToServer(txHash, param);

                                    // back to stake 
                                    setCurrentAddress('');
                                    setCurrentItem({});
                                    setCurrentTxType('Compound-Stake');
                                    setExtraDescription(null);
                                    setModalTitle('Compounding');
                                    setCurrentAmount("0.00");
                                    setAvailableAmount(formattedBalanceStr);

                                } else {
                                    setIsTxLoading (false);
                                    setTransactionStage('error');
                                }
                            }).catch((error: any) => {
                                setTransactionStage('error');
                                setIsTxLoading (false);
                            });
                        }).catch((error: any) => {
                            setTransactionStage('error');
                        }).finally(() => {
                            setIsTxLoading (false);
                        });
                    }
                } else {
                    setTransactionStage('error');
                    setIsTxLoading (false);
                }
            } catch (error: any) {
                setIsTxLoading (false);
                setTransactionStage('error');
            } 
            
        } else {
        
            try {
                setIsTxLoading (true);
                const res = await axios.post(url + apiPath, param, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                }).then((response) => {
                    return response.data;
                }).catch((error) => {
                    return null;
                });
                if(res && res.code === 200) {
                    if(res.data && res.data.unsignedTx) {
                        const { unsignedTx } = res.data;
                        signAndSend(amount , unsignedTx).then((txHash: string) => {
                            setTransactionHash(txHash);
                            setTransactionStage('comfirming');
                            isTxConfirmed(txHash).then((isConfirmed: boolean) => {
                                if (isConfirmed) {
                                    setTransactionStage('success');
                                    sendTxHashToServer(txHash, param);
                                } else {
                                    setIsTxLoading (false);
                                    setTransactionStage('error');
                                }
                            }).catch((error: any) => {
                                setTransactionStage('error');
                                setIsTxLoading (false);
                            });
                        }).catch((error: any) => {
                            setTransactionStage('error');
                        }).finally(() => {
                            setIsTxLoading (false);
                        });
                    }
                } else {
                    setTransactionStage('error');
                    setIsTxLoading (false);
                }
            } catch (error: any) {
                setIsTxLoading (false);
                setTransactionStage('error');
            } 
        }
    }, [ url , currentTxType,  userAddr]);

    const handleClaimAll = React.useCallback(() => {
        setCurrentAddress("0x1234");
        setCurrentTxType('ClaimAll');
        setModalTitle('Claim All');
        setCurrentAmount(String(claimableRewards));
        setAvailableAmount(String(claimableRewards));
        onOpen();
    }, [claimableRewards]);

    const handleCompound = React.useCallback(() => {
        setCurrentAddress("0x1234");
        setCurrentTxType('Compound-Claim');
        setExtraDescription('Please claim your reward before proceeding.');
        setModalTitle('Compounding');
        setCurrentAmount(String(claimableRewards));
        setAvailableAmount(String(claimableRewards));
        onOpen();
    }, [claimableRewards]);
    // claim all/  compond ,   general claimable 

    const handleStakeMore = () => {
        setCurrentTxType('ChooseStake');
        setModalTitle('Stake More');
        setCurrentAmount("0.00");
        setCurrentItem({});
        setAvailableAmount(formattedBalanceStr);
        onOpen();
    }

    const handleCloseModal = () => {
        onClose();
        setExtraDescription(null);
    }
    


  return (
    <PageNextJs pathname="/object">
      <StakingInfo
        stakedAmount={ stakedAmount }
        claimableRewards={ claimableRewards }
        withdrawingAmount={ withdrawingAmount }
        totalRewards={ totalRewards }
        isOpen = { isOpen }
        handleCloseModal = { handleCloseModal }
        callback = { () => {
          requestMyStakingInfo();
          requestMyStakingTableList();
        }}
        modalTitle = { modalTitle}
        extraDescription = { extraDescription }
        transactionStage = { transactionStage }
        currentTxType = { currentTxType }
        availableAmount = { availableAmount }
        setAvailableAmount = { setAvailableAmount }
        onOpen = { onOpen }
        isTxLoading = { isTxLoading }
        currentAmount = { currentAmount }
        setCurrentAmount = { setCurrentAmount }
        handleSubmit = { handleSubmit }
        currentAddress = { currentAddress }
        setCurrentFromItem = { setCurrentFromItem }
        setCurrentAddress = { setCurrentAddress }
        currentFromItem = { currentFromItem }
        currentFromAddress = { currentFromAddress }
        setCurrentFromAddress = { setCurrentFromAddress }
        currentItem = { currentItem }
        setCurrentItem = { setCurrentItem }
        handleClaimAll = { handleClaimAll }
        handleCompound = { handleCompound }
        handleStakeMore = { handleStakeMore }
        setCurrentTxType = { setCurrentTxType }
        transactionHash = { transactionHash }
        isHideNumber = { isHideNumber }
        setIsHideNumber = { setIsHideNumber }
      />
        <TabTable 
            handleStake = {handleStakeMore}
        />
    </PageNextJs>
  );
};

export default ObjectDetails;
