/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel, Box
} from '@chakra-ui/react';
import { Flex, Text } from '@chakra-ui/react';
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
                                width = "120px"
                                padding = "0px 12px"
                                _active={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                            >My Validators</Tab>
                            <Tab 
                                _selected={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                                width = "120px"
                                padding = "0px 12px"
                                _active={{
                                    color: '#fff',
                                    backgroundColor: '#FF57B7',
                                }}
                            >Others</Tab>
                        </div>
                    </TabList>
                </div>

                <Box
                    width="100%"
                    borderTop="1px solid rgba(0, 46, 51, 0.10)"
                    borderBottom="1px solid rgba(0, 46, 51, 0.10)"
                    marginTop={"12px"}
                >
                    <Flex
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                        px="16px"
                        py="8px"
                    > 
                        <Text
                            fontSize="12px"
                            fontWeight="400"
                            color="#000"
                            textAlign="left"
                            fontStyle="normal"
                            lineHeight="20px"
                            fontFamily="HarmonyOS Sans"
                        >
                            Other Validators
                        </Text>
                        <Text
                            fontSize="12px"
                            fontWeight="400"
                            color="#000"
                            textAlign="left"
                            fontStyle="normal"
                            lineHeight="20px"
                            fontFamily="HarmonyOS Sans"
                        >
                            Live APR
                        </Text>
                    </Flex>
                </Box>

                <TabPanels color="#000" >
                    <TabPanel>

                    </TabPanel>
                    <TabPanel>
                        
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default StakingTabList;