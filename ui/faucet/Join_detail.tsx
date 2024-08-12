import {
  Flex,
  Box,
  Square,
  Text,
  Button,
  Input,
  Spacer,
  Heading,
  Highlight,
} from '@chakra-ui/react';
import React from 'react';

const JoinDetail = () => {

  return (
    <>
      <Heading fontSize="24px" fontWeight="400" lineHeight="28px">
        <Highlight
          query="$ZKME"
          styles={{ color: '#8A55FD', fontWeight: '700' }}
        >
          To receive $ZKME on MeChain Testnet, please follow the steps below.
        </Highlight>
      </Heading>
      <Text margin="16px 0 24px 0" fontSize="24px" fontWeight="400" lineHeight="28px">Tokens will be automatically transferred to your address.</Text>
      <Flex>
        <Box width="580px" border="1px solid rgba(0, 0, 0, 0.06)" borderRadius="16px" bg="rgba(245, 242, 255, 0.32)" padding="24px">
          <Box
            border="1px solid #3846DE"
            bg="#707CFF"
            borderRadius="50%" width="32px"
            height="32px" color="#FFFFFF"
            textAlign="center" lineHeight="32px" >1</Box>
          <Flex margin="24px 0 48px 0" fontWeight="700" fontSize="24px" color="#000000">
            <Text>Join our Discord</Text>
            <Text>community</Text>
          </Flex>
          <Button
            bg="#707CFF" height="48px"
            border="1px solid #3846DE"
            _hover={{ background: '#707CFF' }} borderRadius="100px" padding="12px 0" width="200px">Verify</Button>
        </Box>
        <Square size="20px"></Square>
        <Box width="580px" border="1px solid rgba(0, 0, 0, 0.06)" borderRadius="16px" bg="rgba(245, 242, 255, 0.32)" padding="24px">
          <Box
            border="1px solid #3846DE" bg="#707CFF"
            borderRadius="50%" width="32px"
            height="32px" color="#FFFFFF" textAlign="center" lineHeight="32px" >2</Box>
          <Flex margin="24px 0 48px 0" fontWeight="700" fontSize="24px">
            <Heading fontWeight="700" fontSize="24px" color="#000000" lineHeight="28px">
              <Highlight
                query="$ZKME"
                styles={{ color: '#8A55FD' }}
              >
                Request $ZKME on MeChain
              </Highlight>
            </Heading>
            <Text fontWeight="700" color="#000000">Testnet</Text>
          </Flex>
          <Flex>
            <Input width="300px" height="48px" placeholder="Enter address"/>
            <Spacer/>
            <Button bg="#A07EFF"
              height="48px" border="1px solid #8A55FD"
              _hover={{ background: '#A07EFF' }} borderRadius="100px"
              padding="12px 0" width="200px">Verify</Button>
          </Flex>
        </Box>
      </Flex>
      <Box marginTop="24px" width="580px" border="1px solid rgba(0, 0, 0, 0.06)" borderRadius="16px" padding="24px">
        Detail
      </Box>
    </>
  );
};

export default React.memo(JoinDetail);
