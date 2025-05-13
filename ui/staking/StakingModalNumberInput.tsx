/* eslint-disable */
import { 
    Input ,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import {
    Box,
    Flex,
    Button,
    Text,
} from '@chakra-ui/react';
import React from 'react';


const StakingModalNumberInput = ({
    value,
    setValue,
}: {
    value: string;
    setValue: (value: string) => void;
}) => {

  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup height={'auto'} width={'100%'} borderRadius={'16px'}>
      <Input
          pr='145px'
          pb='44px'
          height={'auto'}
          type={'number'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            color: '#FF57B7 !important',
          }}
          borderRadius={'16px'}
          _placeholder={{
            fontFamily: "HarmonyOS Sans",
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '140%',
            color: 'rgba(0, 0, 0, 0.10)'
          }}
          _focus={{
            color: '#FF57B7',
            border: '1px solid #FF57B7',
          }}
          _hover={{
            color: '#FF57B7',
          }}
          _active={{
            color: '#FF57B7',
          }}
          fontFamily={'HarmonyOS Sans'}
          fontSize={'40px'}
          fontStyle={'normal'}
          color={'#FF57B7'}
          fontWeight={700}
          lineHeight={'140%'} /* 56px */
          border = {'1px solid rgba(0, 46, 51, 0.10)'}
          backdropFilter='blur(5px)'
          placeholder = '0.00'
      />
      <InputRightElement width='auto' top={'14px'} right={'16px'} height='auto'>
        <Flex flexDirection={'column'} width='auto' height='auto'>
            <Box width='auto' height='56px' paddingY={'16px'}>
                <Flex justifyContent={'flex-end'} gap={'12px'} alignItems="center" width='100%' height='100%'>
                    <Button
                      px='8px'
                      py='4px'
                      borderRadius={'9999px'}
                      backgroundColor={'#FFCBEC'}
                      color={'#FF57B7'}
                      fontSize='12px'
                      fontStyle='normal'
                      fontWeight='400'
                      lineHeight='normal'
                      fontFamily="HarmonyOS Sans"
                      textTransform='capitalize'
                      _hover={{
                        backgroundColor: '#FF57B7',
                        color: '#FFCBEC',
                      }}
                      height='auto'
                      colorScheme='pink'
                    >MAX</Button>
                    <Flex flexDirection={'row'} width='auto' height='auto' alignItems='center' justifyContent={'flex-end'}>
                        <Text fontSize='sm' color='gray.500'>
                            0.00
                        </Text>
                        <Text fontSize='sm' color='gray.500'>
                          Moca
                        </Text>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
      </InputRightElement>
      <Flex 
        
        zIndex='200'
        px="16px"
        w="100%"
        height="20px"
        py = { 0}
        position={"absolute"}
        justifyContent="space-between"
        alignItems="center"
        bottom={"16px"}
        left={0}
      >
            <Text
                fontSize="14px"
                fontWeight="500"
                color="rgba(0, 0, 0, 0.30)"
                textAlign="center"
                fontStyle="normal"
                lineHeight="140%"
                as ="span"
                fontFamily="HarmonyOS Sans"
            >
               $--
            </Text>
            <Text
                fontSize="14px"
                fontWeight="500"
                color="rgba(0, 0, 0, 0.60)"
                textAlign="center"
                fontStyle="normal"
                lineHeight="140%"
                as ="span"
                fontFamily="HarmonyOS Sans"
            >
               Available: <span  style={{ color: '#000' }}>0.00 MOCA</span>
            </Text>
      </Flex>
    </InputGroup>
  )
}

export default StakingModalNumberInput;