import { Button, Skeleton } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

interface Props {
  isLoading: boolean;
  addressHash: string;
  isPartiallyVerified: boolean;
}

const ContractDetailsVerificationButton = ({ isLoading, addressHash, isPartiallyVerified }: Props) => {
  if (isLoading) {
    return (
      <Skeleton
        w="130px"
        h={ 8 }
        mr={ isPartiallyVerified ? 0 : 3 }
        ml={ isPartiallyVerified ? 0 : 'auto' }
        borderRadius="base"
        flexShrink={ 0 }
      />
    );
  }
  return (
    <Button
      size="sm"
      mr={ isPartiallyVerified ? 0 : 3 }
      ml={ isPartiallyVerified ? 0 : 'auto' }
      flexShrink={ 0 }
      as="a"
      href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: addressHash } }) }
    >
      Verify & publish
    </Button>
  );
};

export default React.memo(ContractDetailsVerificationButton);
