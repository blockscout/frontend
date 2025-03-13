import React from 'react';

import { route } from 'nextjs-routes';

import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';

interface Props {
  isLoading: boolean;
  addressHash: string;
  isPartiallyVerified: boolean;
}

const ContractDetailsVerificationButton = ({ isLoading, addressHash, isPartiallyVerified }: Props) => {
  return (
    <Link
      href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: addressHash } }) }
      mr={ isPartiallyVerified ? 0 : 3 }
      ml={ isPartiallyVerified ? 0 : 'auto' }
      flexShrink={ 0 }
      asChild
    >
      <Button
        size="sm"
        loadingSkeleton={ isLoading }
      >
        Verify & publish
      </Button>
    </Link>
  );
};

export default React.memo(ContractDetailsVerificationButton);
