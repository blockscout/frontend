import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';
import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';

interface Props extends LinkProps {
  isLoading: boolean;
  addressHash: string;
}

const ContractDetailsVerificationButton = ({ isLoading, addressHash, ...rest }: Props) => {

  const href = config.features.opSuperchain.isEnabled ?
  // TODO @tom2drum adjust URL to Vera
    'https://vera.blockscout.com' :
    route({ pathname: '/address/[hash]/contract-verification', query: { hash: addressHash } });

  return (
    <Link
      href={ href }
      target={ config.features.opSuperchain.isEnabled ? '_blank' : undefined }
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
