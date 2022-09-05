import { Text } from '@chakra-ui/react';
import React from 'react';

const AccountPageDescription = ({ children }: {children: React.ReactNode}) => {
  return (
    <Text marginBottom={{ base: 6, lg: 12 }}>
      { children }
    </Text>
  );
};

export default AccountPageDescription;
