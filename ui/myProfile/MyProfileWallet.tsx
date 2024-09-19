import { Button, Heading } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
}

const MyProfileWallet = ({ profileQuery }: Props) => {
  return (
    <section>
      <Heading as="h2" size="sm" mb={ 3 }>My linked wallet</Heading>
      { !profileQuery.data?.address_hash && <Button size="sm">Link wallet</Button> }
    </section>
  );
};

export default React.memo(MyProfileWallet);
