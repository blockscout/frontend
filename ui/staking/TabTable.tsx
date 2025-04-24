/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel
} from '@chakra-ui/react';
import SearchInput from './SearchInput';
import React from 'react';

const App = () => {
    const [ searchTerm, setSearchTerm ] = React.useState<string>('');
    const [ isInitialLoading, setIsInitialLoading ] = React.useState<boolean>(false);

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
        <Tabs color="#FF57B7" colorScheme="#FF57B7">
            <div 
                style={{
                    position: 'relative',
                }}
            >
                <TabList>
                    <Tab>My Validators</Tab>
                    <Tab>Activity</Tab>
                </TabList>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    position: 'absolute',
                    right: '10px',
                    top: '-50%',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                }}>
                    { searchInput }
                </div>
            </div>

            <TabPanels color="#000" >
                <TabPanel>
                    <p>1111</p>
                </TabPanel>
                <TabPanel>
                    <p>22222!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
  )
}

export default App;

