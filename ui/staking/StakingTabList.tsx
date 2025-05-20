/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel, Box
} from '@chakra-ui/react';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import ValidatorInfo from 'ui/staking/ValidatorInfo';




const getShortAddress = (address: string) => {
    if( !address) {
        return '';
    }
    if ( address.length > 10) {
        return `${address.slice(0, 12)}...${address.slice(-4)}`;
    }
    return address;
}

const StakingTabList = ({
    myValidatorsList,
    allValidatorsList,
    setSelectedValidator,
    onClose,
}: {
    myValidatorsList: any[];
    allValidatorsList: any[];
    setSelectedValidator: (validator: any) => void;
    onClose: () => void;
}) => {
    return (
        <Box  borderRadius={"12px"}>
            <Tabs 
                variant="solid-rounded"
                size='sm'
                borderRadius={"12px"}
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
                        <span 
                            style={{
                                height: 'auto',
                                width: 'auto',
                                fontSize: '12px',
                                fontWeight: '400',
                                color: '#000',
                                lineHeight: '20px',
                                fontStyle: 'normal',
                                textTransform: 'capitalize',
                                fontFamily: 'HarmonyOS Sans',
                            }}
                        >
                            All Validators
                        </span>
                        <span 
                            style={{
                                height: 'auto',
                                width: 'auto',
                                fontSize: '12px',
                                fontWeight: '400',
                                color: '#000',
                                lineHeight: '20px',
                                fontStyle: 'normal',
                                textTransform: 'capitalize',
                                fontFamily: 'HarmonyOS Sans',
                            }}
                        >
                            Live APR
                        </span>
                    </Flex>
                </Box>

                <TabPanels color="#000" borderRadius={"12px"}>
                    <TabPanel padding="0" >
                        <Box
                            width="100%"
                            backgroundColor="#fff"
                            padding="0"
                            maxHeight="300px"
                            overflowY="auto"
                        >
                            { myValidatorsList.map((validator) => (
                                <Flex 
                                    key={validator.validatorAddress} 
                                    flexDirection="row"
                                    cursor="pointer"
                                    onClick={() => {
                                        setSelectedValidator({
                                            validatorAddress: validator.validatorAddress,
                                            liveApr: validator.liveApr,
                                        });
                                        onClose();
                                    }}
                                    _hover={{
                                        backgroundColor: '#FEF1F9',
                                    }}
                                    borderBottom="1px solid rgba(0, 46, 51, 0.10)"
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '16px',
                                        alignItems: 'center',
                                    }}>
                                        <span 
                                            style={{
                                                height: 'auto',
                                                width: 'auto',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#000',
                                                lineHeight: 'normal',
                                                fontStyle: 'normal',
                                                textTransform: 'capitalize',
                                                fontFamily: 'HarmonyOS Sans',
                                            }}
                                        >
                                            <ValidatorInfo  validatorName = {(validator.validatorAddress || '')} />
                                        </span>
                                        <span 
                                            style={{
                                                height: 'auto',
                                                width: 'auto',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#FF57B7',
                                                lineHeight: 'normal',
                                                fontStyle: 'normal',
                                                textTransform: 'capitalize',
                                                fontFamily: 'HarmonyOS Sans',
                                            }}
                                        >
                                            {  (Number(validator.liveApr  || 0) * 100).toFixed(1)  }%
                                        </span>
                                    </div>
                                </Flex>
                            ))}
                        </Box>
                    </TabPanel>
                    <TabPanel padding="0" boxShadow="none">
                        <Box
                            width="100%"
                            backgroundColor="#fff"
                            padding="0"
                            maxHeight="300px"
                            overflowY="auto"
                        >
                            {allValidatorsList.map((validator) => (
                                <Flex 
                                    key={validator.validatorAddress} 
                                    onClick={() => {
                                        setSelectedValidator({
                                            validatorAddress: validator.validatorAddress,
                                            liveApr: validator.liveApr,
                                        })
                                        onClose();
                                    }}
                                    width="100%"
                                    cursor="pointer"
                                    _hover={{
                                        backgroundColor: '#FEF1F9',
                                    }}
                                    borderBottom="1px solid rgba(0, 46, 51, 0.10)"
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '16px',
                                        alignItems: 'center',
                                    }}>
                                        <span 
                                            style={{
                                                height: 'auto',
                                                width: 'auto',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#000',
                                                lineHeight: 'normal',
                                                fontStyle: 'normal',
                                                textTransform: 'capitalize',
                                                fontFamily: 'HarmonyOS Sans',
                                            }}
                                        >
                                            <ValidatorInfo  validatorName = {(validator.validatorAddress || '')} />
                                        </span>
                                        <span
                                            style={{
                                                height: 'auto',
                                                width: 'auto',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#FF57B7',
                                                lineHeight: 'normal',
                                                fontStyle: 'normal',
                                                textTransform: 'capitalize',
                                                fontFamily: 'HarmonyOS Sans',
                                            }}
                                        >
                                            {  (Number(validator.liveApr  || 0) * 100).toFixed(1)  }%
                                        </span>
                                    </div>
                                </Flex>
                            ))}
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default StakingTabList;