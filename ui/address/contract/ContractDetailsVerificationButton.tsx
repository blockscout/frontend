import React from 'react';

import { route } from 'nextjs-routes';

import { Button } from 'toolkit/chakra/button';
import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';

interface Props extends LinkProps {
  isLoading: boolean;
  addressHash: string;
}

const ContractDetailsVerificationButton = ({ isLoading, addressHash, ...rest }: Props) => {
  return (
    <Link
      href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: addressHash } }) }
      flexShrink={ 0 }
      asChild
      { ...rest }
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
