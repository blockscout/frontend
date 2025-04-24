/* eslint-disable */
import { 
    Input ,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import {
    Box,
    Flex,
    Text,
} from '@chakra-ui/react';
import React from 'react';


const StakingModalNumberInput = () => {

  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup height={'auto'} width={'100%'} borderRadius={'10px'}>
      <Input
        pr='60px'
        pb='70px'
        height={'auto'}
        type={'text'}
        placeholder='Enter password'
      />
      <InputRightElement width='auto'>
        <Box width='100px' height='60px' bg='red.100'>
            hahhaa
        </Box>
      </InputRightElement>
      <Flex justifyContent="space-between" zIndex='200' px="30px" alignItems="center" w="100%" position={"absolute"} bottom={0} left={0} paddingBottom={2}>
        <Text fontSize='sm' color='gray.500'>
            $342525.00
        </Text>
        

        <Box width='auto' height='auto' bg='yellow.100'>
            hahhaa
            <Text fontSize='sm' color='gray.500'>
                $342525.00
            </Text>
        </Box>
      </Flex>
    </InputGroup>
  )
}

export default StakingModalNumberInput;