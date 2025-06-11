/* eslint-disable */
import { Flex, Avatar, Tr, Th,  Td } from '@chakra-ui/react';
import { Table } from 'antd';
import { useRouter } from 'next/router';
import { Box, useDisclosure } from '@chakra-ui/react';
import useAccount from 'lib/web3/useAccount';
import LinkInternal from 'ui/shared/links/LinkInternal';
import { route } from 'nextjs-routes';
import React, { useEffect , useMemo } from 'react';
import { orderBy } from 'lodash';
import { useAppKit, createAppKit } from '@reown/appkit/react';
import EmptyPlaceholder from 'ui/staking/EmptyPlaceholder';
import StatusButton from 'ui/validators/StatusButton';
import WithTipsText from 'ui/validators/WithTipsText';
import StakeButton  from 'ui/validators/StakeButton';
import Pagination from 'ui/validators/Pagination';
import CommonModal from 'ui/staking/CommonModal';
import axios from 'axios';
import { useWalletClient, usePublicClient } from 'wagmi';
import { useSendTransaction } from 'wagmi';
import { useAccount as useWagmiAccount , useBalance } from 'wagmi'
import { parseUnits} from 'ethers';
import isTxConfirmed from 'ui/staking/TransactionConfirmed';
import { formatUnits } from 'viem';
import { useStakeLoginContextValue } from 'lib/contexts/stakeLogin';
import formatPercentTruncated from 'ui/staking/formatPercentTruncated';
import TableTokenAmount from 'ui/staking/TableTokenAmount';
import styles from 'ui/staking/spinner.module.css';



const numberTypeFields = [
    'votingPower',
    'commissionRate',
    'liveApr',
    'totalStake',
    'uptime',
];


const  ValidatorInfoBox = ({ record } : { record: any }) => {
    return (
        <Flex flexDirection="row" alignItems="center" gap="8px" width="100%">
            <Box>
                <img
                    src="/static/moca-brand.svg"
                    width="20px"
                    height="20px"
                    style={{ borderRadius: '50%', flexShrink: 0}}
                />
            </Box>
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
}

type sortOrderType = 'asc' | 'desc' | '';
type ValidatorStatus = 'Active' | 'Inactive' | 'Jailed' | 'Unbonding' ; 
type txType = 'Withdraw' | 'Claim' | 'Stake' | 'MoveStake' | 'ClaimAll' | 'ChooseStake' | 'Compound-Claim' | 'Compound-Stake'

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

const noop = () => {};

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

    return (
            <Flex
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                userSelect={'none'}
                gap="2px" 
                onClick={ allowSort ? handleSort : noop }
            >
                <span 
                    style={{ 
                        color: 'rgba(0, 0, 0, 0.40)',
                        fontSize: '12px'
                    }} 
                    className="node-staking-custom-table-header-text"
                >
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
    fetcher: ( params ?: any ) => void;
    searchTerm: string;
    onJumpPrevPage: () => void;
    onJumpNextPage: () => void;
    nextKey: string | null;
}) => {

    const {
        data , 
        isLoading,
        currentPage,
        searchTerm,
        onJumpPrevPage,
        onJumpNextPage,
        totalCount,
        fetcher,
        nextKey
    } = props;

    const [sortBy, setSortBy] = React.useState<string>('');
    const [sortOrder, setSortOrder] = React.useState<sortOrderType>('');

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ isTxLoading, setIsTxLoading ] = React.useState<boolean>(false);
    const [ currentTxType, setCurrentTxType ] = React.useState<txType>('Withdraw');
    const [ modalTitle, setModalTitle ] = React.useState<string>('Withdraw');
    const [ currentAddress, setCurrentAddress ] = React.useState<string>('');
    const [ currentFromAddress, setCurrentFromAddress ] = React.useState<string>('');
    const [ currentItem , setCurrentItem ] = React.useState<any>({});
    const [ currentFromItem , setCurrentFromItem ] = React.useState<any>({});
    const [ currentAmount, setCurrentAmount ] = React.useState<string>('');
    const [ apr , setApr ] = React.useState<string>('0.00');
    const [ transactionStage , setTransactionStage ] = React.useState<string>('edit'); // 'edit' | 'submitting' | 'success' | ' .... '
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const router = useRouter();
    const { address: userAddr } = useAccount();



    const { data: balanceData, refetch: refetchBalance } = useBalance({ address: userAddr});
    const [ availableAmount, setAvailableAmount ] = React.useState<string>('0.00');

    useEffect(() => {
        if (balanceData && !!balanceData.value) {
            const formattedBalanceStr = formatUnits(balanceData.value, 18);
            setAvailableAmount(formattedBalanceStr);
        }
    }, [userAddr , balanceData]);

    const [ transactionHash, setTransactionHash ] = React.useState<string>('');
    
    const handleCloseModal = () => {
        setCurrentTxType('Withdraw');
        setModalTitle('Withdraw');
        setTransactionStage('edit');
        setCurrentItem({});
        setCurrentAddress('');
        onClose();
    }


    const { open: openModal } = useAppKit();

    const handleRowClick = (item: any) => { 
        const { validator } = item;
        router.push({
            pathname: '/validator-detail/[addr]',
            query: { addr: validator}
        });
    }

    const statusOrder = {
        "Active": 1,
        "Jailed": 2,
        "Unbonding": 3,
        "Inactive": 4,
    };


    const orderFn = (item: any, key: string) => {
        if (numberTypeFields.includes(key)) {
            return Number(item[key]);
        }
        return item[key];
    };

    const sortedData = React.useMemo(() => {
        const statusSort = (item: { status: string; }) => {
            const status = item.status as ValidatorStatus;
            return statusOrder[status]; // Default to 5 if status is not found
        }

        const defaultSortFields = [ statusSort, 'totalStake'];
        const defaultSortOrder = [ 'asc'  , 'desc' ] as any[];

        
        
        if (sortBy && sortOrder) {
            return orderBy(data, 
                [(item: any) => orderFn(item, sortBy), defaultSortFields[0], (item: any) => orderFn(item, 'totalStake')],
                [ (!sortOrder ? false : sortOrder), defaultSortOrder[0], defaultSortOrder[1] ]
            );
        }
        return  orderBy(data,
            [defaultSortFields[0],  (item: any) => orderFn(item, 'totalStake')],
            [defaultSortOrder[0], defaultSortOrder[1]]
        );
    }, [data, sortBy, sortOrder]);


    const formattedBalanceStr = React.useMemo(() => {
        if (balanceData && !!balanceData.value) {
            return formatUnits(balanceData.value, 18);
        }
        return '0.00';
    }, [userAddr , balanceData]);
    
    const handleStake = (address: string, record: any) => {
        setCurrentItem({
            ...record,
            validatorAddress: record.validator,
            liveApr: record.liveApr,
        });
        setCurrentAddress(address);
        setModalTitle('Stake');
        setApr(record.liveApr);
        setAvailableAmount(formattedBalanceStr);
        setCurrentTxType('Stake');
        onOpen();
    };  

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
        const res =  await axios.post(url + '/api/staking/broadcast', _newParam, {
            timeout: 10000,
            headers: {
            'Content-Type': 'application/json',
            },
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            return null; 
        });
    } , [url]);


    const { isConnected: WalletConnected } = useAccount();

    const { sendTransactionAsync } = useSendTransaction();
    
    const signAndSend = async ( amount :string, unsignedTx: unsignedTx | null | undefined ) => {

        if (!unsignedTx) throw new Error('Unsigned transaction null or undefined');

        const _unsignedTx = {
            to: unsignedTx.to as `0x${string}`,
            data: unsignedTx.data as `0x${string}`,
            // value: currentTxType === 'Stake' ? parseUnits(amount, 18) : BigInt(0),
            value:  BigInt(0),
            gas: BigInt(unsignedTx.gasLimit),
            gasPrice: parseUnits('20', 'gwei'),
        }

        const txHash = await sendTransactionAsync(_unsignedTx);

        return txHash;
    }

    const handleSubmit = React.useCallback(async (targetAddress: string, txType: string, amount: string, from?: string) => {
        let param = null;
        let apiPath = null;
        if (currentTxType === 'Stake') {
            param = {
                "address": userAddr,
                "validatorAddress": targetAddress,
                "amount": amount,
                "stakingType": currentTxType
            };
            apiPath = '/api/staking/prepare/stake';
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

            const res =  await axios.post(url + apiPath, param, {
                timeout: 10000,
                headers: {
                'Content-Type': 'application/json',
                },
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
                        refetchBalance();
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
    }, [ url , currentTxType,  userAddr]);

    const tableHead: tableHeadType[] = [
        {
            label: 'Validators',
            key: 'validator',
            width : '300px',
            render: (record) => (
                <LinkInternal
                    href={ route({ pathname: '/validator-detail/[addr]', query: { addr: record.validator } }) }
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
                        }}
                    >
                        <ValidatorInfoBox record = { record } />
                    </span>
                </LinkInternal>
            )
        },
        {
            label: 'Voting Power',
            tips: `The influence a validator has in network governance decisions, based on its stake.` ,
            key: 'votingPower',
            allowSort: true,
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
                    { formatPercentTruncated(record.votingPower) }
                </span>
            )
        },
        {
            label: 'Commission Rate',
            key: 'commissionRate',
            tips: `The percentage fee charged by validators from delegators' staking rewards.` ,
            width: '220px',
            allowSort: true,
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
                    { formatPercentTruncated(record.commissionRate) }
                </span>
            )
        },
        {
            label: 'Live APR',
            tips: 'The current annual percentage return estimated from staking tokens with the validator.',
            key: 'liveApr',
            allowSort: true,
            render: (record) => (
                <span 
                    style={{ 
                        color: '#000',
                        fontFamily: "HarmonyOS Sans",
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                            
                    }}
                >
                    { formatPercentTruncated(record.liveApr) }
                </span>
            )
        },
        {
            label: 'Total Stake',
            key: 'totalStake',
            tips: 'Total amount of tokens currently staked with the validator.',
            allowSort: true,
            render: (record) => (
                <TableTokenAmount
                    amount = { record.totalStake }
                    symbol = 'MOCA'
                />
            )
        },
        {
            label: 'Uptime',
            key: 'uptime',
            tips: 'The reliability and availability of a validator node, shown as an uptime percentage.',
            allowSort: true,
            render: (record) => (
                <span 
                    style={{ 
                        color: '#000',
                        fontFamily: "HarmonyOS Sans",
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                            
                    }}
                >
                    { formatPercentTruncated(record.uptime) }
                </span>
            )
        },
        {
            label: 'Status',
            key: 'status',
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
            render: (record) => (
                <StakeButton
                    text = "Stake"
                    onClick = { (e: any) => {
                        if  (!WalletConnected) {
                            openModal();
                            return;
                        }
                        e.stopPropagation();
                        e.preventDefault();
                        handleStake(record.validator, record);
                        setCurrentAddress(record.validator);
                    }}
                    disabled = { record.status !== 'Active' }
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
                className="node-staking-custom-table-header-text"
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



    const spinner = ( <div style={{ width: '100%', height: 'auto', display: 'flex', minHeight: '200px',
            justifyContent: 'center', alignItems: 'center', marginTop: '56px', position: 'relative'}}>
        <Box className={ styles.loader }></Box>
    </div> );


    if (isLoading) {
        return spinner;
    }
    else if ( !!searchTerm && data.length === 0) {
        return (
            <div style={{ width: '100%', height: 'auto', paddingTop: '56px', position: 'relative'}}>
                <EmptyPlaceholder
                    tipsTextArray={ [`No matching records.` ] }
                    showButton={ false }
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
                border: 'solid 1px rgba(0, 0, 0, 0.06)',
                borderRadius: '12px',
                padding: '24px'
            }}
        >
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table
                    columns={AntDesignTableColumns}
                    dataSource={ sortedData }
                    className="node-staking-custom-table"
                    scroll={{ x: 'auto' }}
                    pagination={false}
                    onRow={(record, rowIndex) => {
                        return {
                        onClick: (event) => {
                            event.stopPropagation();
                            handleRowClick(record)
                        }}
                    }}
                />
            </div>
            <Flex
                justifyContent="justify-between"
                alignItems="center"
                zIndex='200'
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
            <CommonModal 
                isOpen = { isOpen }
                onClose = { handleCloseModal }
                title = { modalTitle}
                currentApr={apr}
                transactionStage = { transactionStage }
                currentTxType = { currentTxType }
                availableAmount = { availableAmount }
                setAvailableAmount = { setAvailableAmount }
                onSubmit = { handleSubmit }
                onOpen = { onOpen }
                callback = { fetcher }
                txhash= { transactionHash }
                isSubmitting = { isTxLoading }
                currentAmount = { currentAmount }
                setCurrentAmount = { setCurrentAmount }
                currentAddress = { currentAddress }
                setCurrentFromItem = { setCurrentFromItem }
                setCurrentAddress = { setCurrentAddress }
                currentItem = { currentItem }
                currentFromItem = { currentFromItem }
                currentFromAddress = { currentFromAddress }
                setCurrentFromAddress = { setCurrentFromAddress }
                setCurrentItem = { setCurrentItem }
            />
        </div>
    </>
    );
}


export default TableApp;