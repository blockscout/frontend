/* eslint-disable */
import { Table, Tbody, Thead , TableContainer, Tr, Th,  Td } from '@chakra-ui/react';
import LinkInternal from 'ui/shared/links/LinkInternal';
import { route } from 'nextjs-routes';


const CustomTableHeader = ({ width, children }: { children: React.ReactNode ; width?: string }) => {
    return (
        <Th
            _first={{ p: "14px 10px 10px 10px" }}
            color="rgba(0, 0, 0, 0.6)"
            p="14px 10px 10px 10px"
            bg="#FFFF"
            borderBottom="1px"
            borderColor="rgba(0, 0, 0, 0.1)"
            width={ width || 'auto' }
        >
            { children }
        </Th>
    );
}

const ValidatorsTable = (props: {
    data: any;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onSortChange: (sortBy: string, sortOrder: string) => void;
}) => {

    const {
        data,
        isLoading,
        onPageChange,
        onPageSizeChange,
        onSortChange
    } = props;


    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        );
    }


    const tableHeaders = (
            <Tr>
                <CustomTableHeader width='300px'>Validators</CustomTableHeader>
                <CustomTableHeader>Live APR</CustomTableHeader>
                <CustomTableHeader>My Stake</CustomTableHeader>
                <CustomTableHeader>My Rewards</CustomTableHeader>
                <CustomTableHeader>Claimable</CustomTableHeader>
                <CustomTableHeader>Commission</CustomTableHeader>
                <CustomTableHeader>Status</CustomTableHeader>
                <CustomTableHeader width='300px'><span></span></CustomTableHeader>
            </Tr>
        );
    
    
        const handleRowClick = (item: any) => {
            // Handle row click event
            console.log('Row clicked:', item);
            const { validator, votingPower, commissionRate, liveApr, totalStake, uptime, status } = item;
        };
            
    
        return (
        <Table>
            <Thead bg ="white" position="sticky" top={ 0 } zIndex={ 1 }>
                {tableHeaders}
            </Thead>
            <Tbody>
                {data.map((validator: any, index: number) => (
                    <Tr key={index} >
                        <Td>
                            <LinkInternal
                                href={ route({ pathname: '/validator-detail/[addr]', query: { addr: validator.validator } }) }
                            >
                                { validator.validator }
                            </LinkInternal>
                        </Td>
                        <Td>{validator.votingPower}</Td>
                        <Td>{validator.commissionRate}</Td>
                        <Td>{validator.liveApr}</Td>
                        <Td>{validator.totalStake}</Td>
                        <Td>{validator.uptime}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}


export default ValidatorsTable;