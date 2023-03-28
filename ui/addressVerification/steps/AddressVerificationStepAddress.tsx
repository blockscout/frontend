import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { AddressVerificationFormFields } from '../types';

import AddressVerificationFieldAddress from '../fields/AddressVerificationFieldAddress';

interface Props {
  onContinue: () => void;
}

const AddressVerificationStepAddress = ({ onContinue }: Props) => {
  const { formState, trigger } = useFormContext<AddressVerificationFormFields>();

  const handleButtonClick = React.useCallback(() => {
    if (formState.errors.address) {
      trigger('address');
      return;
    }
    onContinue();
  }, [ formState, onContinue, trigger ]);

  return (
    <Box>
      <Box mb={ 8 }>Let’s check your address...</Box>
      <AddressVerificationFieldAddress/>
      <Flex alignItems="center" mt={ 8 } columnGap={ 5 }>
        <Button size="lg" onClick={ handleButtonClick }>
            Continue
        </Button>
        <Box>
          <span>Contact </span>
          <Link>support@blockscout.com</Link>
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(AddressVerificationStepAddress);
