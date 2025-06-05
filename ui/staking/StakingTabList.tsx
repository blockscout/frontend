/* eslint-disable */
import { 
    Tabs, Tab, TabList, TabPanels, TabPanel, Box
} from '@chakra-ui/react';
import { Flex, Text } from '@chakra-ui/react';
import React ,  { useMemo } from 'react';
import ValidatorInfo from 'ui/staking/ValidatorInfo';
import EmptyRecords from 'ui/staking/EmptyRecords';
import styles from 'ui/staking/spinner.module.css';

const noop = () => {};

const ValidatorItem = ({
    validator,
    isDisabled = false,
    onClick,
}:  {
    validator: any;
    isDisabled?: boolean;
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}) => {
    
    return (
        <Flex 
                key={validator.validatorAddress} 
                onClick={ isDisabled ? noop : onClick }
                width="100%"
                _hover={{
                    backgroundColor: '#FEF1F9',
                }}
                cursor={ isDisabled ? 'not-allowed' : 'pointer'}
                opacity={ isDisabled ? 0.5 : 1}
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
                        <ValidatorInfo  validatorName = {(validator.validatorAddress || '')}  record={validator} />
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
    );
}

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
    isMyValidatorLoading = false,
    isAllValidatorLoading = false,
}: {
    myValidatorsList: any[];
    allValidatorsList: any[];
    setSelectedValidator: (validator: any) => void;
    onClose: () => void;
    isMyValidatorLoading?: boolean;
    isAllValidatorLoading?: boolean;
}) => {

    const spinner = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px',
            width: '100%', marginTop: '10px' }}>
            <span className ="modal-spinner"></span>
        </div>
    );

    const filteredOtherValidators = useMemo(() => {
        return allValidatorsList.filter(
            (validator) => !myValidatorsList.some(myValidator => myValidator.validatorAddress === validator.validatorAddress)
        );
    }, [myValidatorsList, allValidatorsList]);

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

                <TabPanels color="#000" borderRadius={"12px"}>
                    <TabPanel padding="0" >
                        {
                        myValidatorsList.length > 0 && (<Box
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
                                    My Validators
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
                        </Box>)
                        }

                        <Box
                            width="100%"
                            backgroundColor="#fff"
                            padding="0"
                            maxHeight="300px"
                            overflowY="auto"
                        >
                            { myValidatorsList.length === 0 && ( 
                                isMyValidatorLoading ? spinner :
                                <EmptyRecords text="You haven't stake in a bonded Validators" /> )}
                                { myValidatorsList.map((validator) => (
                                <ValidatorItem
                                    key={validator.validatorAddress}
                                    validator={validator}
                                    isDisabled={ validator.status !== "Active" }
                                    onClick={() => {
                                        console.log('Selected Validator:', validator);
                                        setSelectedValidator({
                                            ...validator,
                                            validatorAddress: validator.validatorAddress,
                                            liveApr: validator.liveApr,
                                        });
                                        onClose();
                                    }}
                                />
                            ))}
                        </Box>
                    </TabPanel>
                    <TabPanel padding="0" boxShadow="none">
                        {
                            filteredOtherValidators.length > 0  && (<Box
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
                                        Other Validators
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
                            </Box>)
                        }
                        <Box
                            width="100%"
                            backgroundColor="#fff"
                            padding="0"
                            maxHeight="300px"
                            overflowY="auto"
                        >
                            { filteredOtherValidators.length === 0 && (
                                isAllValidatorLoading ? spinner :
                                 <EmptyRecords text="No validators" /> )}
                                {filteredOtherValidators.map((validator) => (
                                    <ValidatorItem
                                        key={validator.validatorAddress} 
                                        validator={validator}
                                        isDisabled={ validator.status !== "Active" }
                                        onClick={() => {
                                            setSelectedValidator({
                                                ...validator,
                                                validatorAddress: validator.validatorAddress,
                                                liveApr: validator.liveApr,
                                            })
                                            onClose();
                                        }}
                                    />
                                ))}
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default StakingTabList;