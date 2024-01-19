import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import RawDataSnippet from 'ui/shared/RawDataSnippet';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawData?: Record<string, any>;
  isLoading?: boolean;
}

const UserOpRaw = ({ rawData, isLoading }: Props) => {
  if (!rawData) {
    return null;
  }

  const text = JSON.stringify(rawData, undefined, 4);

  return <Skeleton isLoaded={ !isLoading }><RawDataSnippet data={ text }/></Skeleton>;
};

export default UserOpRaw;
