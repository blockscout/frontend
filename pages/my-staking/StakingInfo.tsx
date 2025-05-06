/* eslint-disable */

import { Box, Grid, Flex, Button,  Text } from '@chakra-ui/react';
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from '@chakra-ui/react';
import {
  useDisclosure,
} from '@chakra-ui/react';
import StakingModal from './StakingModal';
import StakingValidatorSelect from './StakingValidatorSelect';
import StakingModalNumberInput from './StakingModalNumberInput';
import SuccessfulContent from 'ui/stakingModal/SuccessfulContent';


const StakingInfo = () => {
    
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} 
            paddingRight={{ base: '0', lg: '24px' }}
            paddingBottom={{ base: '24px', lg: '0' }}
            marginBottom = {4} rowGap={"20px"} columnGap={ 6 } mb={ 8 }>
            <Box flex="1" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" p="24px">
                <Flex p="0" height={'100%'} flexDirection="column" justifyContent={{ base: 'flex-start', lg: 'space-between' }} alignItems='flex-start' gap={ 4 }>
                    <Stat>
                        <StatLabel>Collected Fees</StatLabel>
                        <StatNumber>£0.00</StatNumber>
                        <StatHelpText>Feb 12 - Feb 28</StatHelpText>
                    </Stat>
                    <Flex alignItems="center" mt={4} justifyContent="flex-start" gap={6}>
                        <Button colorScheme='blue' borderRadius={9999}>Button</Button>
                        <Button variant='outline' borderRadius={9999}>Button</Button> 
                    </Flex>
                </Flex>
            </Box>

            <Box flex="1" border="1px"  position={'relative'}  borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" p="24px">
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={"20px"} columnGap={ 6 } >
                    <Box p="12px 0">
                        <Stat>
                            <StatLabel>Collected Fees</StatLabel>
                            <Flex alignItems="baseline" justifyContent="flex-start">
                                <StatNumber>£0.00</StatNumber>
                                <StatHelpText>Feb 12 - Feb 28</StatHelpText>
                            </Flex>
                        </Stat>
                    </Box>

                    <Box p="12px 0">
                        <Stat>
                            <StatLabel>Collected Fees</StatLabel>
                            <Flex alignItems="baseline"  justifyContent="flex-start">
                                <StatNumber>£0.00</StatNumber>
                                <StatHelpText>Feb 12 - Feb 28</StatHelpText>
                            </Flex>
                        </Stat>
                    </Box>

                    <Box p="12px 0">
                        <Stat>
                            <StatLabel>Collected Fees</StatLabel>
                            <Flex alignItems="baseline" justifyContent="flex-start">
                                <StatNumber>£0.00</StatNumber>
                                <StatHelpText>Feb 12 - Feb 28</StatHelpText>
                            </Flex>
                        </Stat>
                    </Box>

                    <Box p="12px 0">
                        <Stat>
                            <StatLabel>Collected Fees</StatLabel>
                            <Flex alignItems="baseline" justifyContent="flex-start">
                                <StatNumber>£0.00</StatNumber>
                                <StatHelpText>Feb 12 - Feb 28</StatHelpText>
                            </Flex>
                        </Stat>
                    </Box>
                </Grid>

                <Button variant='outline' 
                    bottom={ 4 } right={ 4 }
                    onClick={ onOpen } 
                    position={'absolute'} borderRadius={9999}>Button</Button> 
                <StakingModal isOpen={ isOpen } onClose={ onClose } onOpen={ onOpen }>
                    <div style={{ height: '500px' }}>
                        <StakingValidatorSelect />
                        <Box paddingTop={ 10 } paddingBottom={ 4 }>
                            <StakingModalNumberInput />
                        </Box>
                        <Box paddingTop={ 10 } paddingBottom={ 4 }>
                            <StakingModalNumberInput />
                        </Box>
                        <SuccessfulContent text='Transaction Success' />    
                    </div>
                    <Button onClick={ onClose }>Close</Button>
                </StakingModal>
            </Box>
        </Grid>
    );
}

export default StakingInfo;