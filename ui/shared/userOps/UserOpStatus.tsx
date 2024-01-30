import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import StatusTag from 'ui/shared/statusTag/StatusTag';

type Props = {
  status?: boolean;
  isLoading?: boolean;
}

const UserOpStatus = ({ status, isLoading }: Props) => {
  if (status === undefined) {
    return null;
  }

  return (
    <Skeleton isLoaded={ !isLoading } display="inline-block">
      <StatusTag type={ status === true ? 'ok' : 'error' } text={ status === true ? 'Success' : 'Failed' }/>
    </Skeleton>
  );
};

export default UserOpStatus;
