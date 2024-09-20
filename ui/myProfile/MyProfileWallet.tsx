import { Box, Button, Heading, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  onAddWallet: () => void;
}

const MyProfileWallet = ({ profileQuery, onAddWallet }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <section>
      <Heading as="h2" size="sm" mb={ 3 }>My linked wallet</Heading>
      { profileQuery.data?.address_hash ? (
        <Box px={ 3 } py="18px" bgColor={ bgColor } borderRadius="base">
          <AddressEntity
            address={{ hash: profileQuery.data.address_hash }}
            fontWeight="500"
          />
        </Box>
      ) : <Button size="sm" onClick={ onAddWallet }>Link wallet</Button> }
    </section>
  );
};

export default React.memo(MyProfileWallet);
