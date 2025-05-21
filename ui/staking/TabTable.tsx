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


const App = ({
    handleStake,
}: {
    handleStake: () => void;
}) => {
    const [ searchTerm, setSearchTerm ] = React.useState<string>('');
    const [ isInitialLoading, setIsInitialLoading ] = React.useState<boolean>(false);


    const [ currentTabIndex, setCurrentTabIndex ] = React.useState<number>(0);
    const [ selectDateRange, setSelectDateRange ] = React.useState<any>([null , null]);

    const [ disableSelectDateRange, setDisableSelectDateRange ] = React.useState<boolean>(false);


    // Mock function to simulate loading
    React.useEffect(() => {
        setIsInitialLoading(true);
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);


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
                            <SearchInput
                                w={{ base: '100%', lg: '360px' }}
                                minW={{ base: 'auto', lg: '250px' }}
                                size="xs"
                                onChange={ setSearchTerm }
                                placeholder="Search by name, namespace or table ID..."
                                initialValue={ searchTerm }
                                isLoading={ isInitialLoading }
                            />
                        </Box>
                    ) : (
                        <Box 
                            width = {{ base: '100%', lg: '235px' , }}
                        >
                            <DatePicker 
                                value={ selectDateRange }
                                isDisabled={ disableSelectDateRange }
                                setValue={ (v: any) => {
                                    console.log('date range', v);
                                    setSelectDateRange(v);
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>

            <TabPanels color="#000" >
                <TabPanel>
                    <MyValidatorsTable 
                        searchTerm={ searchTerm }
                        handleStake={ handleStake }
                    />
                </TabPanel>
                <TabPanel>
                    <ActivityListTable 
                        selectDateRange={ selectDateRange }
                        handleStake={ handleStake }
                        setDisableSelectDateRange = { setDisableSelectDateRange}
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
  )
}

export default App;

