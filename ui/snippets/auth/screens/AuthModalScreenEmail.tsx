import { Box, Button, Input, Text } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from '../types';

interface Props {
  onSubmit: (screen: Screen) => void;
}

const AuthModalScreenEmail = ({ onSubmit }: Props) => {

  const handleSubmitClick = React.useCallback(() => {
    onSubmit({ type: 'otp_code', email: 'tom@ohhhh.me' });
  }, [ onSubmit ]);

  return (
    <Box>
      <Text>Account email, used for transaction notifications from your watchlist.</Text>
      <Input placeholder="Email" mt={ 6 }/>
      <Button mt={ 6 } onClick={ handleSubmitClick }>Send a code</Button>
    </Box>
  );
};

export default React.memo(AuthModalScreenEmail);
