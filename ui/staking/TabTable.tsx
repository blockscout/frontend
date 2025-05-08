/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel
} from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import MyValidatorsTable from 'ui/staking/MyValidatorsTable';
import ActivityListTable from 'ui/staking/ActivityListTable';
import SearchInput from './SearchInput';
import React from 'react';

const App = () => {
    const [ searchTerm, setSearchTerm ] = React.useState<string>('');
    const [ isInitialLoading, setIsInitialLoading ] = React.useState<boolean>(false);


    const [ myValidatorTableData, setMyValidatorTableData ] = React.useState<any>([]);
    const [ myValidatorTableisLoading, setIsLoading ] = React.useState<boolean>(false);
    const [ myValidatorTablePage, setMyValidatorTablePage ] = React.useState<number>(1);
    const [ myValidatorTablePageSize, setMyValidatorTablePageSize ] = React.useState<number>(10);



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


  return (
        <Tabs color="#FF57B7" colorScheme="#FF57B7" marginTop={ { base: '24px', lg: '0' } }>
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
                    { searchInput }
                </Box>
            </Box>

            <TabPanels color="#000" >
                <TabPanel>
                    <MyValidatorsTable 
                        data={ myValidatorTableData }
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

