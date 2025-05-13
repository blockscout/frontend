/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel, Box
} from '@chakra-ui/react';
import React from 'react';

const TabChart = () => {

    return (
        <Box>
            <Tabs 
                variant="solid-rounded"
            >
                {/* <div 
                    style={{
                        position: 'relative',
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
                            justifyContent: 'flex-start',
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
                            <Tab 
                                _selected={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                                _active={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                            >My Validators</Tab>
                        </div>
                    </TabList>

                    <div style={{
                            width: 'auto',
                            padding: '4px',
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            justifyContent: 'flex-start',
                        }}>
                            <span> </span>
                    </div>
                </div> */}

                <TabPanels color="#000" >
                    <TabPanel>
                        <p></p>
                    </TabPanel>
                    <TabPanel>
                        <p></p>
                    </TabPanel>
                    <TabPanel>
                        <p></p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default TabChart;