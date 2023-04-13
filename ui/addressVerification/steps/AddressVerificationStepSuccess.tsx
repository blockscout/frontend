import { Alert, Box, Button, chakra, Flex } from '@chakra-ui/react';
import React from 'react';

interface Props {
  onShowListClick: () => void;
  onAddTokenInfoClick: () => void;
  isToken?: boolean;
  address: string;
}

const AddressVerificationStepSuccess = ({ onAddTokenInfoClick, onShowListClick, isToken, address }: Props) => {
  return (
    <Box>
      <Alert status="success" flexWrap="wrap" whiteSpace="pre-wrap" wordBreak="break-word" mb={ 3 } display="inline-block">
        <span>The address ownership for </span>
        <chakra.span fontWeight={ 700 }>{ address }</chakra.span>
        <span> is verified.</span>
      </Alert>
      <p>You may now submit the “Add token information” request</p>
      <Flex alignItems="center" mt={ 8 } columnGap={ 5 } flexWrap="wrap" rowGap={ 5 }>
        <Button size="lg" variant={ isToken ? 'outline' : 'solid' } onClick={ onShowListClick }>
          View my verified addresses
        </Button>
        { isToken && (
          <Button size="lg" onClick={ onAddTokenInfoClick }>
            Add token information
          </Button>
        ) }
      </Flex>
    </Box>
  );
};

export default React.memo(AddressVerificationStepSuccess);
