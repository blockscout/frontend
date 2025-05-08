/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel, Box
} from '@chakra-ui/react';
import React from 'react';
import ValidatorChart from 'ui/validators/ValidatorChart';
import ValidatorDelegator from 'ui/validators/ValidatorDelegator';

const TabChart = () => {

    return (
        <Box border="solid 1px rgba(0, 0, 0, 0.06)" borderRadius="12px">
            <Tabs color="#FF57B7" colorScheme="#FF57B7">
                <div 
                    style={{
                        position: 'relative',
                    }}
                >
                    <TabList padding={'20px 10px 0 24px'} borderBottom="1px solid rgba(0, 0, 0, 0.06)">
                        <Tab>Analytics</Tab>
                        <Tab>Validator Activities</Tab>
                        <Tab>Delegators</Tab>
                    </TabList>
                    {/* <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        position: 'absolute',
                        right: '10px',
                        top: '-50%',
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                    }}>
                        hahahahh
                    </div> */}
                </div>

                <TabPanels color="#000" >
                    <TabPanel>
                        <p>
                            <ValidatorChart />
                        </p>
                    </TabPanel>
                    <TabPanel>
                        <p>22222!</p>
                    </TabPanel>
                    <TabPanel>
                        <ValidatorDelegator />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default TabChart;