/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel, Box
} from '@chakra-ui/react';
import React from 'react';


const StakingTabList = () => {

    return (
        <Box>
            <Tabs 
                variant="solid-rounded"
                size='sm'
            >
                <div 
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <TabList>
                        <div style={{
                            width: 'auto',
                            padding: '4px',
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Tab 
                                _selected={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                                _active={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                            >Total Stake</Tab>
                            <Tab 
                                _selected={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                                _active={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                            >Rewards</Tab>
                        </div>
                    </TabList>
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
        </Box>
    );
}

export default StakingTabList;