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


const StakingModalNumberInput = () => {

  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup height={'auto'} width={'100%'} borderRadius={'16px'}>
      <Input
          pr='60px'
          pb='70px'
          height={'auto'}
          type={'text'}
          placeholder='Enter password'
          borderRadius={'16px'}
          border = {'1px solid rgba(0, 46, 51, 0.10)'}
          backdropFilter='blur(5px)'
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
            <Flex width='auto' height='auto' marginTop={'8px'} justifyContent={'flex-end'} alignItems='flex-end'>
                hahhaa
                <Text fontSize='sm' color='gray.500'>
                    $342525.00
                </Text>
            </Flex>
        </Flex>
      </InputRightElement>
      <Flex 
        justifyContent="space-between"
        zIndex='200'
        px="16px"
        alignItems="flex-end"
        w="100%"
        position={"absolute"}
        bottom={0}
        left={0}
        paddingBottom={2}
      >
          <Text fontSize='sm' color='gray.500'>
              $342525.00
          </Text>
      </Flex>
    </InputGroup>
  )
}

export default StakingModalNumberInput;