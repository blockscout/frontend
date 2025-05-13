/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel
} from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import MyValidatorsTable from 'ui/staking/MyValidatorsTable';
import ActivityListTable from 'ui/staking/ActivityListTable';
import SearchInput from './SearchInput';
import DatePicker from './DatePickerFilter';
import React from 'react';



const mockData = [
    {
        "validatorAddress": "0x766CE7525d33Fb091B97acb4dCfB1Df7A9aB70Cf",
        "liveAPR": "12.5",
        "commission": "5.0",
        "status": "Active",
        "myStake": "50.000000",
        "myRewards": "2.500000",
        "claimable": "0.750000"
      },
      {
        "validatorAddress": "0x8A7F7C5B9387aCA1E0a5f9c3B22dDC46248a8975",
        "liveAPR": "11.8",
        "commission": "10.0",
        "status": "Active",
        "myStake": "30.000000",
        "myRewards": "1.800000",
        "claimable": "0.500000"
    },
    {
        "validatorAddress": "0xA1B2C3D4E5F60708090A0B0C0D0E0F1011121314",
        "liveAPR": "10.2",
        "commission": "7.5",
        "status": "Jailed",
        "myStake": "20.000000",
        "myRewards": "1.200000",
        "claimable": "0.300000"
    }
];



const App = () => {
    const [ searchTerm, setSearchTerm ] = React.useState<string>('');
    const [ isInitialLoading, setIsInitialLoading ] = React.useState<boolean>(false);


    const [ myValidatorTableData, setMyValidatorTableData ] = React.useState<any>([]);
    const [ myValidatorTableisLoading, setIsLoading ] = React.useState<boolean>(false);
    const [ myValidatorTablePage, setMyValidatorTablePage ] = React.useState<number>(1);
    const [ myValidatorTablePageSize, setMyValidatorTablePageSize ] = React.useState<number>(10);

    const [ currentTabIndex, setCurrentTabIndex ] = React.useState<number>(0);


    // Mock function to simulate loading
    React.useEffect(() => {
        setIsInitialLoading(true);
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const searchInput = (
        <SearchInput
            w={{ base: '100%', lg: '360px' }}
            minW={{ base: 'auto', lg: '250px' }}
            size="xs"
            onChange={ setSearchTerm }
            placeholder="Search by name, namespace or table ID..."
            initialValue={ searchTerm }
            isLoading={ isInitialLoading }
        />
    );


    const datepicker = (
        <DatePicker />
    );


  return (
        <Tabs color="#FF57B7" colorScheme="#FF57B7" marginTop={ { base: '24px', lg: '0' } }
            index = { currentTabIndex }
            onChange = { (index: number) => {
                setCurrentTabIndex(index);
            }
        }
        >
            <Box 
                style={{
                    position: 'relative',
                }}
            >
                <TabList borderBottom={'1px solid rgba(0, 0, 0, 0.06)'} >
                    <Tab>My Validators</Tab>
                    <Tab>Activity</Tab>
                </TabList>
                <Box 
                    top = {{ base: '-120%', lg: '-50%' }}
                    width = {{ base: '100%', lg: 'auto' }}
                    justifyContent = {{ base: 'center', lg: 'flex-end' }}
                    px = {{ base: '12px', lg: '0' }}
                    
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        position: 'absolute',
                        right: '10px',
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                }}>
                    { currentTabIndex === 0 ? (
                        <Box 
                            width = {{ base: '100%', lg: 'auto' }}
                        >
                            { searchInput }
                        </Box>
                    ) : (
                        <Box 
                            width = {{ base: '100%', lg: '235px' , }}
                        >
                            { datepicker }
                        </Box>
                    )}
                </Box>
            </Box>

            <TabPanels color="#000" >
                <TabPanel>
                    <MyValidatorsTable 
                        data={ mockData }
                        isLoading={ myValidatorTableisLoading }
                        onPageChange={ () => {} }
                        onPageSizeChange={ () => {} }
                        onSortChange={ () => {} }
                    />
                </TabPanel>
                <TabPanel>
                    <ActivityListTable 
                        data={ myValidatorTableData }
                        isLoading={ myValidatorTableisLoading }
                        onPageChange={ () => {} }
                        onPageSizeChange={ () => {} }
                        onSortChange={ () => {} }
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
  )
}

export default App;

