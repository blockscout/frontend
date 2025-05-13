/* eslint-disable */
import { Table, Tbody, Thead , Flex, TableContainer, Tr, Th,  Td, Box } from '@chakra-ui/react';
import LinkInternal from 'ui/shared/links/LinkInternal';
import { route } from 'nextjs-routes';
import React, { useEffect } from 'react';
import { debounce, orderBy } from 'lodash';
import StatusButton from 'ui/validators/StatusButton';
import WithTipsText from 'ui/validators/WithTipsText';
import StakeButton  from 'ui/validators/StakeButton';
import Pagination from 'ui/validators/Pagination';


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
    if (address.length > 10) {
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    }
    return address;
}


const tableHead: tableHeadType[] = [
    {
        label: 'Validators',
        key: 'validator',
        width : '300px',
        render: (record) => (
            <LinkInternal
                href={ route({ pathname: '/validator-detail/[addr]', query: { addr: record.validator } }) }
            >
                { getShortAddress(record.validator) }
            </LinkInternal>
        )
    },
    {
        label: 'Voting Power',
        tips: `Represents a node's influence in network decisions, proportional to its stake.` ,
        key: 'votingPower',
        allowSort: true,
    },
    {
        label: 'Commission Rate',
        key: 'commissionRate',
        tips: 'The fee percentage a node operator charges on staking rewards.',
        width: '220px',
        allowSort: true,
    },
    {
        label: 'Live APR',
        tips: 'Current annualized return from staking on the node.',
        key: 'liveApr',
        allowSort: true,
    },
    {
        label: 'Total Stake',
        key: 'totalStake',
        tips: 'Total tokens staked on a node',
        allowSort: true,
    },
    {
        label: 'Uptime',
        key: 'uptime',
        tips: 'Validator name',
        allowSort: false,
    },
    {
        label: 'Status',
        key: 'status',
        tips: 'Percentage of time the node remains active and reliable',
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
                onClick = { () => console.log('Stake clicked') }
                disabled = { false }
            />
        )
    }
];

    

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

    const w = width || 'auto';
    const _w = width || '200px'; 
    const _minWidth = minWidth || '180px';

    return (
        <Th
            _first={{ p: "4px 10px 10px 10px" }}
            color="rgba(0, 0, 0, 0.6)"
            p="4px 10px 10px 10px"
            bg="#FFFF"
            borderBottom="1px"
            borderColor="rgba(0, 0, 0, 0.1)"
            width={{ base: _w , lg: w }}
            minWidth={_minWidth}
            flexShrink={ 0 }
        >
            <Flex
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                userSelect={'none'}
                gap="2px" 
            >
                <span style={{ color: 'rgba(0, 0, 0, 0.40)' }}>
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
                        onClick={handleSort}
                    >
                        { (sortOrder === 'asc' && selfKey === sortKey) && icon_asc }
                        { (sortOrder === 'desc' && selfKey === sortKey) && icon_desc }
                        { (sortOrder === '' || selfKey !== sortKey) && icon_no_order }
                    </Box>
                )}
            </Flex>
        </Th>
    );
}


const TableApp = (props: {
    data: any;
    isLoading: boolean;
    totalCount: number;
    currentPage: number;
    onJumpPrevPage: () => void;
    onJumpNextPage: () => void;
    nextKey: string | null;
}) => {

    const {
        data,
        isLoading,
        currentPage,
        onJumpPrevPage,
        onJumpNextPage,
        totalCount,
        nextKey
    } = props;

    const [sortBy, setSortBy] = React.useState<string>('');
    const [sortOrder, setSortOrder] = React.useState<sortOrderType>('');


    const handleRowClick = (item: any) => {
        console.log('Row clicked:', item);
    };


    const sortedData = React.useMemo(() => {
        if (sortBy && sortOrder) {
            return orderBy(data, [sortBy], [ !sortOrder ? false : sortOrder]);
        }
        return data;
    }, [data, sortBy, sortOrder]);
        


    const tableHeaders = (
        <Tr>
            {tableHead.map((item: tableHeadType, index: number) => (
                <CustomTableHeader 
                    key={index}
                    width={ item.width }
                    minWidth={ item.minWidth }
                    allowSort={ item.allowSort }
                    sortKey = { sortBy }
                    sortOrder = { sortOrder }
                    setSort = { setSortBy }
                    setSortOrder = { setSortOrder }
                    selfKey = { item.key }
                >
                    { ( item.tips ? ( 
                        <WithTipsText 
                            label={ item.label }
                            tips={ item.tips }
                        />
                    ) : item.label ) }
                </CustomTableHeader>
            ))}
        </Tr>
    );

    return (
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
            { isLoading ? (
                <div style={{ width: '100%', height: 'auto', 
                    display: 'flex', minHeight: '200px',
                        justifyContent: 'center', alignItems: 'center', marginTop: '16px'}}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FFCBEC' }}></div>
                </div>
                ) : (
                <Table variant="simple">
                    <Thead bg ="white" position="sticky" top={ 0 } zIndex={ 1 }>
                        { tableHeaders }
                    </Thead>
                    <Tbody>
                        {sortedData.map((validator: any, index: number) => (
                            <Tr key={index}
                                borderBottom={'none'}
                                _last={{ borderBottom: 'none' }} 
                                _hover={{ bg: 'rgba(0, 0, 0, 0.02)' }}
                                onClick={() => handleRowClick(validator)}
                            >
                                { tableHead.map((item: tableHeadType, index: number) => (
                                    <Td
                                        key={index}
                                        p="14px 10px 10px 10px"
                                        color="rgba(0, 0, 0, 0.6)"
                                        borderBottom={'none'} _last={{ borderBottom: 'none' }} 
                                        onClick={() => handleRowClick(validator)}
                                    >
                                        {item.render ? item.render(validator) : validator[item.key]}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
            {/* page, onNextPageClick, onPrevPageClick, resetPage, hasPages, hasNextPage, className, canGoBackwards, isLoading, isVisible  */}
            <Flex
                justifyContent="flex-end"
                alignItems="center"
                zIndex='200'
                width="100%"
                marginTop={ '16px'}
            >
                <Pagination 
                    totalCount={ props.totalCount }
                    currentPage={ currentPage }
                    onJumpPrevPage={ onJumpPrevPage }
                    onJumpNextPage={ onJumpNextPage }
                    isNextDisabled = { isLoading || !nextKey  || nextKey === 'null' }
                    isPrevDisabled = { currentPage === 1 || currentPage === 0  || isLoading }
                />
            </Flex>
        </div>
    );
}


export default TableApp;