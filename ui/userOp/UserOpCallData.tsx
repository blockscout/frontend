import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import RawInputData from 'ui/shared/RawInputData';

// decoded calldata will be added later
type Props = {
  rawCallData?: string;
  isLoading?: boolean;
}

const UserOpCallData = ({ rawCallData, isLoading }: Props) => {
  if (!rawCallData) {
    return null;
  }
  return <Skeleton isLoaded={ !isLoading }><RawInputData hex={ rawCallData }/></Skeleton>;
};

export default UserOpCallData;
