/* eslint-disable */
import { Tbody, Thead , Flex, Avatar, Tr, Th,  Td, Box } from '@chakra-ui/react';
import {  useDisclosure, } from '@chakra-ui/react';
import ValidatorInfo from 'ui/staking/ValidatorInfo';
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { debounce, orderBy } from 'lodash';
import { Table } from 'antd';
import useAccount from 'lib/web3/useAccount';
import CommonModal from 'ui/staking/CommonModal';
import StatusButton from 'ui/validators/StatusButton';
import WithTipsText from 'ui/validators/WithTipsText';
import ActionButtonGroup  from 'ui/staking/ActionButtonGroup';
import Pagination from 'ui/validators/Pagination';
import axios from 'axios';
import { formatUnits } from 'viem';
import { useStakeLoginContextValue } from 'lib/contexts/stakeLogin';
import FloatToPercent from 'ui/validators/FloatToPercent';
import isTxConfirmed from 'ui/staking/TransactionConfirmed';
import { toBigInt , parseUnits} from 'ethers';
import EmptyPlaceholder from 'ui/staking/EmptyPlaceholder';
import LinkInternal from 'ui/shared/links/LinkInternal';
import { route } from 'nextjs-routes';
import truncateTokenAmountWithComma from 'ui/staking/truncateTokenAmountWithComma';
import {  useSendTransaction, useWalletClient, useBalance, usePublicClient } from 'wagmi';
import styles from 'ui/staking/spinner.module.css';

type ValidatorStatus = 'Active' | 'Inactive' | 'Jailed' | 'Unbonding' ; 


const truncatePercentage = ( _num: number | string | null | undefined): string => {
  let num = _num;
  if (typeof num === 'string') {
      num = Number(num);
  } else if (!num || isNaN(num)) {
    return '-';
  }
  const rounded = +((num * 100) .toFixed(2)); // 四舍五入到两位

  if (rounded === 0 && num > 0 && num < 0.0001) {
    return '<0.01%';
  }

  const hasDecimal = rounded % 1 !== 0;
  return hasDecimal ? `${rounded}` + '%' : `${rounded}%`;
}



const TableTokenAmount = ({ 
    amount,
    symbol = 'MOCA'
}: { amount: number | string ; symbol: string }) => {

    return (
    <span 
        style={{ 
            color: '#A80C53',
            fontFamily: "HarmonyOS Sans",
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            width: '100%',
                
            textAlign: 'center',
        }}
    >
        <span>{ truncateTokenAmountWithComma(amount) }</span>
        <span style={{ color: '#000', marginLeft: '4px' }}>{ symbol }</span>
    </span>
    );
}


const  ValidatorInfoBox = ({ record } : { record: any }) => {
    return (
        <Flex flexDirection="row"  flexWrap="nowrap" alignItems="center" gap="8px" width="100%" justifyContent="flex-start">
            <img
                src="/static/moca-brand.svg"
                width="20px"
                height="20px"
                style={{ borderRadius: '50%', flexShrink: 0}}
            />
            <span>{record.validatorName}</span>
        </Flex>
    );
}



type unsignedTx = {
    to: string;
    data: `0x${string}`;
    value: string;
    gasLimit: string;
    chainId: string;
    from: string;
};


type tableHeadType = {
    label: string | React.ReactNode;
    key: string;
    allowSort?: boolean;
    render?: (value: any) => React.ReactNode;
    width?: string;
    tips?: string;
    minWidth?: string;
    sortBy?: string;
    sortOrder?: string;
    noCellPadding?: boolean;
}
type txType = 'Withdraw' | 'Claim' | 'Stake' | 'MoveStake' | 'ClaimAll' | 'ChooseStake' | 'Compound-Claim' | 'Compound-Stake'

type sortOrderType = 'asc' | 'desc' | '';

type ValidatorQueryParams = {
  /** 验证者状态过滤，支持数字或字符串类型 */
  status?: number | 'active' | 'inactive' | 'unbonding';
  /** 分页键，用于获取下一页数据 */
  nextKey?: string; // 默认值 '0x00'
  page?: number; // 默认值 1
  /** 每页返回的验证者数量 */
  limit?: number; // 默认值 10
  /** 是否返回总记录数 */
  countTotal?: boolean; // 默认值 true
  /** 是否按投票权重倒序排列 */
  reverse?: boolean; // 默认值 true
};

const icon_asc = (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.74377 7.32026C3.92589 7.15115 4.21062 7.16169 4.37973 7.34381L5.99998 9.08869L7.62022 7.34381C7.78933 7.16169 8.07406 7.15115 8.25618 7.32026C8.4383 7.48937 8.44885 7.7741 8.27973 7.95622L6.32973 10.0562C6.24459 10.1479 6.12511 10.2 5.99998 10.2C5.87485 10.2 5.75537 10.1479 5.67022 10.0562L3.72022 7.95622C3.55111 7.7741 3.56165 7.48937 3.74377 7.32026Z" fill="black" fillOpacity="0.4"/>
        <path d="M5.99998 1.79999C6.12511 1.79999 6.24459 1.85209 6.32973 1.94378L8.27974 4.04379C8.44885 4.2259 8.4383 4.51063 8.25618 4.67975C8.07406 4.84886 7.78933 4.83831 7.62022 4.65619L5.99998 2.91131L4.37973 4.65619C4.21062 4.83831 3.92589 4.84886 3.74377 4.67974C3.56165 4.51063 3.55111 4.2259 3.72022 4.04378L5.67022 1.94378C5.75537 1.85209 5.87485 1.79999 5.99998 1.79999Z" fill="#A80C53"/>
    </svg>
);

const icon_desc = (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.74377 4.67974C3.92589 4.84885 4.21062 4.83831 4.37973 4.65619L5.99998 2.91131L7.62022 4.65619C7.78933 4.83831 8.07406 4.84885 8.25618 4.67974C8.4383 4.51063 8.44885 4.2259 8.27973 4.04378L6.32973 1.94378C6.24459 1.85209 6.12511 1.79999 5.99998 1.79999C5.87485 1.79999 5.75537 1.85209 5.67022 1.94378L3.72022 4.04378C3.55111 4.2259 3.56165 4.51063 3.74377 4.67974Z" fill="black" fillOpacity="0.4"/>
        <path d="M5.99998 10.2C6.12511 10.2 6.24459 10.1479 6.32973 10.0562L8.27974 7.95621C8.44885 7.7741 8.4383 7.48937 8.25618 7.32025C8.07406 7.15114 7.78933 7.16169 7.62022 7.34381L5.99998 9.08869L4.37973 7.34381C4.21062 7.16169 3.92589 7.15114 3.74377 7.32026C3.56165 7.48937 3.55111 7.7741 3.72022 7.95622L5.67022 10.0562C5.75537 10.1479 5.87485 10.2 5.99998 10.2Z" fill="#A80C53"/>
    </svg>
);

const icon_no_order = (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.99998 1.79999C6.12511 1.79999 6.24459 1.85209 6.32973 1.94378L8.27974 4.04379C8.44885 4.2259 8.4383 4.51063 8.25618 4.67975C8.07406 4.84886 7.78933 4.83831 7.62022 4.65619L5.99998 2.91131L4.37973 4.65619C4.21062 4.83831 3.92589 4.84886 3.74377 4.67974C3.56165 4.51063 3.55111 4.2259 3.72022 4.04378L5.67022 1.94378C5.75537 1.85209 5.87485 1.79999 5.99998 1.79999ZM3.74377 7.32023C3.92589 7.15112 4.21062 7.16166 4.37973 7.34379L5.99998 9.08866L7.62022 7.34379C7.78933 7.16167 8.07406 7.15112 8.25618 7.32023C8.4383 7.48934 8.44885 7.77407 8.27973 7.95619L6.32973 10.0562C6.24459 10.1479 6.12511 10.2 5.99998 10.2C5.87485 10.2 5.75537 10.1479 5.67022 10.0562L3.72022 7.95619C3.55111 7.77407 3.56165 7.48934 3.74377 7.32023Z" fill="black" fillOpacity="0.4"/>
    </svg>
);


const getShortAddress = (address: string) => {
    if( !address) {
        return '';
    }
    if ( address.length > 10) {
        return `${address.slice(0, 12)}...${address.slice(-4)}`;
    }
    return address;
}

const CustomTableHeader = ({
    selfKey,
    width,
    allowSort,
    children,
    sortKey,
    sortOrder,
    setSort,
    setSortOrder,
    minWidth = '180px',
}: { 
    children: React.ReactNode
    width?: string | number
    selfKey: string
    allowSort?: boolean
    sortKey?: string
    sortOrder?: sortOrderType
    setSort?: (sort: string) => void
    setSortOrder?: (sortOrder: sortOrderType) => void
    minWidth?: string
}) => {

    const handleSort = () => {
        if (allowSort) {
            if (selfKey === sortKey) {
                setSort && setSort(selfKey || '');
                const newSortOrder = sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc';
                setSortOrder && setSortOrder(newSortOrder);
            } else {
                setSort && setSort(selfKey || '');
                const newSortOrder = 'asc';
                setSortOrder && setSortOrder(newSortOrder);
            }
        }
    };

    const noop = () => {};

    return (
            <Flex
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                userSelect={'none'}
                gap="2px" 
                className='node-staking-custom-table-header'
                onClick={ allowSort ? handleSort : noop }
            >
                <span style={{ color: 'rgba(0, 0, 0, 0.40)', fontSize: '12px' , fontWeight: 400 }}>
                    { children }
                </span>
                { allowSort && (
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        width="12px"
                        height="12px"
                        fontSize="12px"
                        cursor="pointer"
                    >
                        { (sortOrder === 'asc' && selfKey === sortKey) && icon_asc }
                        { (sortOrder === 'desc' && selfKey === sortKey) && icon_desc }
                        { (sortOrder === '' || selfKey !== sortKey) && icon_no_order }
                    </Box>
                )}
            </Flex>
    );
}

const TableApp = (props: {
    data: any;
    isLoading: boolean;
    totalCount: number;
    currentPage: number;
    fetcher: (params?: any) => void;
    onJumpPrevPage: () => void;
    onJumpNextPage: () => void;
    nextKey: string | null;
    handleStake: () => void;
    searchTerm: string;
}) => {

    const {
        data,
        isLoading,
        currentPage,
        searchTerm,
        onJumpPrevPage,
        onJumpNextPage,
        totalCount,
        fetcher,
        nextKey,
        handleStake: handleStakeMore,
    } = props;

    const [sortBy, setSortBy] = React.useState<string>('');
    const [sortOrder, setSortOrder] = React.useState<sortOrderType>('');

    const handleRowClick = (item: any) => { }

    const statusOrder = {
        "Active": 1,
        "Jailed": 2,
        "Unbonding": 3,
        "Inactive": 4,
    };

    const sortedData = React.useMemo(() => {


        const statusSort = (item: { status: string; }) => {
            const status = item.status as ValidatorStatus;
            return statusOrder[status]; // Default to 5 if status is not found
        }

        const defaultSortFields = [ statusSort, 'myStake'];
        const defaultSortOrder = [ 'asc'  , 'asc' ] as any[];

        if (sortBy && sortOrder) {
            return orderBy(data, 
                [ sortBy, defaultSortFields[0], defaultSortFields[1]],
                [ (!sortOrder ? false : sortOrder), defaultSortOrder[0], defaultSortOrder[1] ]
            );
        }
        return  orderBy(data,
            [defaultSortFields[0], defaultSortFields[1]],
            [defaultSortOrder[0], defaultSortOrder[1]]
        );
    }, [data, sortBy, sortOrder]);



    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ isTxLoading, setIsTxLoading ] = React.useState<boolean>(false);
    const [ currentTxType, setCurrentTxType ] = React.useState<txType>('Withdraw');
    const [ modalTitle, setModalTitle ] = React.useState<string>('Withdraw');
    const [ currentAddress, setCurrentAddress ] = React.useState<string>('');
    const [ currentFromAddress, setCurrentFromAddress ] = React.useState<string>('');
    const [ currentItem , setCurrentItem ] = React.useState<any>({});
    const [ currentFromItem , setCurrentFromItem ] = React.useState<any>({});
    const [ currentAmount, setCurrentAmount ] = React.useState<string>('');
    const [ transactionStage , setTransactionStage ] = React.useState<string>('edit'); // 'edit' | 'submitting' | 'success' | ' .... '
    const [ apr , setApr ] = React.useState<string>('0.00');

    const [ targetValidatorAddress, setTargetValidatorAddress ] = React.useState<string>('');
    const [ targetValidator, setTargetValidator ] = React.useState<any>({});

    const [ transactionHash, setTransactionHash ] = React.useState<string>('');

    const handleCloseModal = () => {
        setCurrentTxType('Withdraw');
        setModalTitle('Withdraw');
        setTransactionStage('edit');
        setCurrentItem({});
        setCurrentAddress('');
        onClose();
        setIsTxLoading(false);
    }

    const { serverUrl : url } = useStakeLoginContextValue();

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
            timeout: 10000
        }).then((response) => response.data).catch((error) => {
            return null;
        });
    } , [url]);

    const { address: userAddr } = useAccount();

    const { data: balanceData, refetch: refetchBalance } = useBalance({ address: userAddr});
    const [ availableAmount, setAvailableAmount ] = React.useState<string>('0.00');

    const formattedBalanceStr = React.useMemo(() => {
        if (balanceData && !!balanceData.value) {
            return formatUnits(balanceData.value, 18);
        }
        return '0.00';
    }, [userAddr , balanceData]);

    // stake: avaliable amount = balance 
    // stake more  : avaliable amount = 
    // withdraw: avaliable amount = my stake amount
    // move stake: avaliable amount = my stake amount
    // claim all/  compond ,   general claimable 

    const handleStake = (address: string, record: any) => {
        setCurrentItem({
            ...record,
            validatorAddress: record.validatorAddress,
            liveApr: record.liveAPR,
        });
        setCurrentAddress(address);
        setCurrentAmount("0.00");
        setAvailableAmount(formattedBalanceStr);
        setModalTitle('Stake');
        setApr(record.liveAPR);
        setCurrentTxType('Stake');
        onOpen();
    };  

    const handleClaim = (address: string, record: any) => {
        setCurrentItem({
            ...record,
            validatorAddress: record.validatorAddress,
            liveApr: record.liveAPR,
        });
        setAvailableAmount(record.claimable);
        setCurrentAmount(record.claimable);
        setCurrentAddress(address); 
        setCurrentTxType('Claim');
        setModalTitle('Claim Rewards');
        onOpen();
    };

    const handleWithdraw = (address: string, record: any) => {
        setCurrentItem({
            ...record,
            validatorAddress: record.validatorAddress,
            liveApr: record.liveAPR,
        });
        setAvailableAmount(record.myStake);
        setCurrentAmount("0.00");
        setCurrentAddress(address); 
        setCurrentTxType('Withdraw');
        setModalTitle('Withdraw');
        onOpen();
    };

    const handleMoveStake = (address: string, record: any) => {
        setCurrentFromItem({
            validatorAddress: record.validatorAddress,
            liveApr: record.liveAPR,
        });
        setCurrentItem({
            ...record,
            validatorAddress: record.validatorAddress,
            liveApr: record.liveAPR,
        });
        setTargetValidator({});
        setAvailableAmount(record.myStake);
        setCurrentAmount("0.00");
        setCurrentAddress(address); 
        setCurrentTxType('MoveStake');
        setModalTitle('Move Stake');
        onOpen();
    };


    const { sendTransactionAsync } = useSendTransaction();
    
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


    const handleSubmit = React.useCallback(async (mainAddr: string, txType: string, amount: string, source?: string) => {
        let param = null;
        let apiPath = null;
        if (currentTxType === 'Stake') {
            param = {
                "address": userAddr,
                "validatorAddress": mainAddr,
                "amount": amount,
                "stakingType": currentTxType
            };
            apiPath = '/api/staking/prepare/stake';
        } else if (currentTxType === 'Withdraw') {
            param = {
                "address": userAddr,
                "validatorAddress": mainAddr,
                "amount": amount,
                "stakingType": "Withdraw"
            };
            apiPath = '/api/staking/prepare/withdraw';
        } else if (currentTxType === 'Claim') {
            param = {
                "address": userAddr,
                "validatorAddress": mainAddr,
                "stakingType":  "Claim"
            };
            apiPath = '/api/staking/distribution/prepare/claim';
        } else if (currentTxType === 'MoveStake') {
            if(!source) {
                return;
            }
            param = {
                "address": userAddr,
                "validatorAddress": source || "",
                "targetValidatorAddress": mainAddr,
                "amount": amount,
                "stakingType": "MoveStake"
            };
            apiPath = '/api/staking/prepare/move-stake';
        } else if (currentTxType === 'ClaimAll') {
            param = {
                "address": userAddr,
                "stakingType": "ClaimAll"
            };
            apiPath = '/api/staking/distribution/prepare/claim-all';
        }

        setTransactionStage('submitting');

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
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                return response.data;
            });
            if( !!res && res.code === 200) {
                if(res.data && res.data.unsignedTx) {
                    const { unsignedTx } = res.data;
                    signAndSend(amount , unsignedTx).then((txHash: string) => {
                        refetchBalance();
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
                            refetchBalance();
                        }).catch((error: any) => {
                            setTransactionStage('error');
                            setIsTxLoading (false);
                        });
                    }).catch((error: any) => {
                        setIsTxLoading (false);
                        setTransactionStage('error');
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
    }, [ url , currentTxType,  userAddr, targetValidator ]);

    const tableHead: tableHeadType[] = [
        {
            label: 'Validators',
            key: 'validatorAddress',
            minWidth: '190px',
            width: '250px',
            render: (record) => (
                <LinkInternal
                    href={ route({ pathname: '/validator-detail/[addr]', query: { addr: record.validatorAddress } }) }
                >
                    <span 
                        style={{ 
                            color: '#A80C53',
                            fontFamily: "HarmonyOS Sans",
                            fontSize: '12px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 'normal',
                            flexShrink: 0,
                        }}
                    >
                        <ValidatorInfoBox record = { record } />
                    </span>
                </LinkInternal>
            )
        },
        {
            label: 'Live APR',
            key: 'liveAPR',
            allowSort: true,
            width: '160px',
            render: (record) => (
                <span 
                    style={{ 
                        color: '#A80C53',
                        fontFamily: "HarmonyOS Sans",
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                    }}
                >
                    { truncatePercentage(record.liveAPR) }
                </span>
            )
        },
        {
            label: 'My Stake',
            key: 'myStake',
            allowSort: true,
            width: '160px',
            render: (record) => (
                <TableTokenAmount
                    amount = { record.myStake }
                    symbol = 'MOCA'
                />
            )
        },
        {
            label: 'My Rewards',
            key: 'myRewards',
            allowSort: true,
            width: '160px',
            render: (record) => (
                <TableTokenAmount
                    amount = { record.myRewards }
                    symbol = 'MOCA'
                />
            )
        },
        {
            label: 'Claimable',
            key: 'claimable',
            allowSort: true,
            width: '160px',
            render: (record) => (
                <TableTokenAmount
                    amount = { record.claimable }
                    symbol = 'MOCA'
                />
            )
        },
        {
            label: 'Commission',
            key: 'commission',
            width: '160px',
            tips: 'This is the commission rate charged by the validator.',
            allowSort: false,
            render: (record) => (
                <div 
                    style={{ 
                        color: '#000',
                        fontFamily: "HarmonyOS Sans",
                        fontSize: '12px',
                        fontStyle: 'normal',
                        width: '100%',
                        fontWeight: 500,
                        lineHeight: 'normal',
                        textAlign: 'center',
                            
                    }}
                >
                    { truncatePercentage(record.commission) }
                </div>
            )
        },
        {
            label: 'Status',
            key: 'status',
            width: '90px',
            minWidth: '90px',
            allowSort: false,
            render: (record) => (
                <StatusButton
                    status={record.status}
                />
            )
        },
        {
            label: <span></span>,
            key: 'action',
            allowSort: false,
            width: 'auto',
            minWidth: '270px',
            noCellPadding: true,
            render: (record) => (
                <ActionButtonGroup 
                    showStake={ true }
                    showClaim={ true }
                    currentRecord={ record }
                    validatorAddress={ record.validatorAddress }
                    setAvailableAmount = { setAvailableAmount }
                    handleStake =  { handleStake }
                    setCurrentAddress = { setCurrentAddress }
                    handleClaim = { handleClaim }
                    handleWithdraw = { handleWithdraw }
                    handleMoveStake = { handleMoveStake }
                />
            )
        }
    ];


    const getColumnContent = (item: tableHeadType) => {
        const content = (item.tips ? (
                <WithTipsText 
                    label={ item.label }
                    tips={ item.tips }
                />
            ) : item.label);
        if (item.allowSort === true) {
            return (
                <CustomTableHeader
                    selfKey={ item.key }
                    width={ item.width }
                    allowSort={ item.allowSort }
                    sortKey={ sortBy }
                    sortOrder={ sortOrder }
                    setSort={ setSortBy }
                    setSortOrder={ setSortOrder }
                    minWidth={ item.minWidth }
                >
                    { content }
                </CustomTableHeader>
            );
        }
        return (
            <span
                style={{
                    color: 'rgba(0, 0, 0, 0.40)',
                    fontFamily: "HarmonyOS Sans",
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: 'normal',
                        
                }}  
                className="node-staking-custom-table-header"
            >
                { content }
            </span> 
        );
    };
        
    const CustomHeaderToAntDesignTableColumns = (tableHead: tableHeadType[]) => {
        return tableHead.map((item: tableHeadType) => ({
            title: getColumnContent(item),
            dataIndex: item.key,
            key: item.key,
            width: 'auto',
            render: (value: any, record: any) => {
                if (item.render) {
                    return item.render(record);
                }
                return value;
            },
        }));
    };

    const AntDesignTableColumns = useMemo(() => {
        return CustomHeaderToAntDesignTableColumns(tableHead);
    }
    , [tableHead, sortBy, sortOrder]);


    const { isConnected: WalletConnected } = useAccount();

    const spinner = ( <div style={{ width: '100%', height: 'auto', display: 'flex', minHeight: '200px',
            justifyContent: 'center', alignItems: 'center', marginTop: '56px', position: 'relative'}}>
        <Box className={ styles.loader }></Box>
    </div> );

    const noStake = false;

    if (!WalletConnected) {
        return (
            <div style={{ width: '100%', height: 'auto', paddingTop: '56px', position: 'relative'}}>
                <EmptyPlaceholder
                    tipsTextArray={ ['Your Stake information will appear here'] }
                    showButton={ "connect" }
                    buttonText={ 'Connect Wallet' }
                />
            </div>
        );
    }
    else if (isLoading) {
        return spinner;
    }
    else if ( !!searchTerm && sortedData.length === 0) {
        return (
            <div style={{ width: '100%', height: 'auto', paddingTop: '56px', position: 'relative'}}>
                <EmptyPlaceholder
                    tipsTextArray={ [`No matching records.` ] }
                    showButton={ false }
                />
            </div>
        );
    } else if ( sortedData.length === 0) {
        return (
            <div style={{ width: '100%', height: 'auto', paddingTop: '56px', position: 'relative'}}>
                <EmptyPlaceholder
                    tipsTextArray={ [`Looks like you haven’t staked yet. Choose a`, 'validator to get started.'] }
                    showButton={ true }
                    buttonText={ 'Stake' }
                    buttonOnClick={ handleStakeMore }
                />
            </div>
        );
    }

    return (
    <>
        <div style={{
                width: '100%',
                height: 'auto',
                overflowX: 'auto',
                overflowY: 'hidden',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                borderRadius: '12px',
            }}
        >
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table
                    columns={AntDesignTableColumns}
                    dataSource={sortedData}
                    className="node-staking-custom-table"
                    scroll={{ x: 'auto' }}
                    pagination={false}
                />
            </div>
            <CommonModal 
                isOpen = { isOpen }
                onClose = { handleCloseModal }
                title = { modalTitle}
                currentApr={ apr }
                transactionStage = { transactionStage }
                currentTxType = { currentTxType }
                availableAmount = { availableAmount }
                setAvailableAmount = { setAvailableAmount }
                onSubmit = { handleSubmit }
                onOpen = { onOpen }
                callback =  { fetcher } 
                txhash= { transactionHash }
                isSubmitting = { isTxLoading }
                currentAmount = { currentAmount }
                setCurrentAmount = { setCurrentAmount }
                currentAddress = { currentAddress }
                setCurrentAddress = { setCurrentAddress }
                currentItem = { currentItem }
                currentFromItem = { currentFromItem }
                setCurrentFromItem = { setCurrentFromItem }
                currentFromAddress = { currentFromAddress }
                setCurrentFromAddress = { setCurrentFromAddress }
                setCurrentItem = { setCurrentItem }
                currentToItem = { targetValidator }
                setCurrentToItem = { setTargetValidator }
                setCurrentToAddress = { setTargetValidatorAddress }
            />
            

        </div>
        <Flex
            justifyContent="justify-between"
            alignItems="center"
            zIndex={ 1 }
            width="100%"
            marginTop={ '16px'}
        >
            <span 
                style={{ 
                    color: 'rgba(0, 0, 0, 0.60)',
                    fontFamily: "HarmonyOS Sans",
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    visibility: 'hidden',
                    lineHeight: 'normal',
                    textWrap: 'nowrap',
                }}
            >
                Total: { totalCount }
            </span>
            <Pagination 
                totalCount={ props.totalCount }
                currentPage={ currentPage }
                onJumpPrevPage={ onJumpPrevPage }
                onJumpNextPage={ onJumpNextPage }
                isNextDisabled = { isLoading || !nextKey  || nextKey === 'null' }
                isPrevDisabled = { currentPage === 1 || currentPage === 0  || isLoading }
            />
        </Flex>
    </>
    );
}


const initial_nextKey = '0x00';
const defaultLimit = 20;


const TableWrapper = ({
    searchTerm,
    handleStake,
    randomKey = 0,
    callback = () => { }
}: {
    searchTerm: string;
    handleStake: () => void;
    randomKey?: number;
    callback?: () => void;
}) => {

    const { serverUrl : url , tokenPrice} = useStakeLoginContextValue();

    const { address: userAddr } = useAccount();
    const [ toNext, setToNext ] = React.useState<boolean>(true);
    const [ nextKey, setNextKey] = useState<string | null>(initial_nextKey);
    const [ currentPageKey, setCurrentPageKey] = useState<string | null>(initial_nextKey);
    const [ currentPage, setCurrentPage] = useState<number>(1);
    const [ tableData, setTableData] = useState<any[]>([]);
    const [ isTableLoading, setIsTableLoading] = useState(false);
    const [ totalCount, setTotalCount] = useState<number>(0);
    const [ keyStack, setKeyStack] = useState<(string | null)[]>([initial_nextKey]);
    const currentKeyRef = useRef<string | null>(initial_nextKey);


    const filteredData = React.useMemo(() => {
        const trimedSearchValue = searchTerm.trim().toLowerCase();
        if (!trimedSearchValue) {
            return tableData;
        } else {
            return tableData.filter((item) => {
            const { validatorName, validatorAddress} = item;
            return (
                validatorName.toLowerCase().includes(trimedSearchValue) ||
                validatorAddress.toLowerCase().includes(trimedSearchValue)
            );
            });
        }
    }, [ tableData, searchTerm ]);
    

    const [ queryParams, setQueryParams ] = React.useState<{ 
        status?: ValidatorQueryParams['status'];
        nextKey?: string;
        page?: ValidatorQueryParams['page'];
        limit?: ValidatorQueryParams['limit'];
        countTotal?: ValidatorQueryParams['countTotal'];
        reverse?: ValidatorQueryParams['reverse'];
      }>({
        nextKey: '',
        page: 1,
    });
    
    const updateQueryParams = (newParams: Partial<ValidatorQueryParams>) => {
        setQueryParams((prevParams) => ({
          ...prevParams,
          ...newParams,
        }));
    }




    const requestDelegatorsInfo = React.useCallback(async() => {
        if (!userAddr) return;
        try {
            setIsTableLoading(true);
            const key = currentKeyRef.current;
            const param = new URLSearchParams();
            param.append('nextKey', key || initial_nextKey);
            param.append('limit', defaultLimit.toString());
            param.append('address', (userAddr || '').toLowerCase());
            const res = await axios.get(url + '/api/me/staking/delegations' + '?' + param.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.data).catch((error) => {
                return null;
            });
            setIsTableLoading(false);
            if(res && res.code === 200) {
                setTableData(res.data.validators || []);
                setTotalCount(Number(res.data.pagination.total || "0"))
                setNextKey( res.data.pagination.nextKey || null );
                setCurrentPageKey(key ?? null);
                setTotalCount(Number(res.data.pagination.total || "0"))
                setNextKey( res.data.pagination.nextKey || null );
            }
        }
        catch (error: any) {
            setIsTableLoading(false);
            throw Error(error);
        }
    }
  , [ url , userAddr, randomKey,  queryParams.nextKey ]);

    useEffect(() => {
        if (!userAddr) {
            return;
        }
        requestDelegatorsInfo();
    }, [ requestDelegatorsInfo ]);


    const jumpToPrevPage = useCallback(() => {
        if (isTableLoading || currentPage <= 1) return;
        const prevKey = keyStack[currentPage - 2] ?? null;
        currentKeyRef.current = prevKey;

        setCurrentPage((prev) => prev - 1);
        requestDelegatorsInfo();
    }, [nextKey, isTableLoading, currentPage, requestDelegatorsInfo]);

    // 上一页
    const jumpToNextPage = useCallback(() => {
        if (isTableLoading || !nextKey) return;
        const nextKeyToUse = nextKey;
        currentKeyRef.current = nextKeyToUse;

        setKeyStack((prev) => [...prev.slice(0, currentPage), nextKeyToUse]);
        setCurrentPage((prev) => prev + 1);
        requestDelegatorsInfo();
    }, [currentPage, keyStack, isTableLoading, requestDelegatorsInfo]);



    return (
        <Box
            width="100%"
            height="auto"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            <TableApp
                data={ filteredData }
                searchTerm={ searchTerm }
                isLoading={ isTableLoading }
                totalCount={ totalCount }
                fetcher = { () => {
                    callback && callback();
                    requestDelegatorsInfo();
                } }
                currentPage={ currentPage }
                handleStake={ handleStake }
                onJumpPrevPage={ jumpToPrevPage }
                onJumpNextPage={ jumpToNextPage }
                nextKey={ nextKey }
            />
        </Box>
    );
}


export default React.memo(TableWrapper);