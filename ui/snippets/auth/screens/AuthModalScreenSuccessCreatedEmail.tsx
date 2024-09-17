import { Box, Text, Button } from '@chakra-ui/react';
import React from 'react';

const AuthModalScreenSuccessCreatedEmail = () => {
  return (
    <Box>
      <Text>Your account was successfully created!</Text>
      <Text mt={ 6 }>Connect a web3 wallet to safely interact with smart contracts and dapps inside Blockscout.</Text>
      <Button mt={ 6 }>Connect wallet</Button>
    </Box>
  );
};

export default React.memo(AuthModalScreenSuccessCreatedEmail);
