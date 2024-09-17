import { chakra, Box, Text, Input, Button, Link } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from '../types';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  email: string;
  onSubmit: (screen: Screen) => void;
}

const AuthModalScreenOtpCode = ({ email, onSubmit }: Props) => {

  const handleSubmitClick = React.useCallback(() => {
    onSubmit({ type: 'success_created_email' });
  }, [ onSubmit ]);

  return (
    <Box>
      <Text>
        Please check{ ' ' }
        <chakra.span fontWeight="700">{ email }</chakra.span>{ ' ' }
        and enter your code below.
      </Text>
      <Input placeholder="Confirmation code" mt={ 6 }/>
      <Link display="flex" alignItems="center" gap={ 2 } mt={ 3 } w="fit-content">
        <IconSvg name="repeat" boxSize={ 5 }/>
        <Box fontSize="sm">Resend code</Box>
      </Link>
      <Button mt={ 6 } onClick={ handleSubmitClick }>Submit</Button>
    </Box>
  );
};

export default React.memo(AuthModalScreenOtpCode);
