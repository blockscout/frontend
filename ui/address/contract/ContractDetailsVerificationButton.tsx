import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';

interface Props {
  isLoading: boolean;
  addressHash: string;
  isPartiallyVerified: boolean;
}

const ContractDetailsVerificationButton = ({ isLoading, addressHash, isPartiallyVerified }: Props) => {

  const href = config.features.opSuperchain.isEnabled ?
  // TODO @tom2drum adjust URL to Vera
    'https://vera.blockscout.com' :
    route({ pathname: '/address/[hash]/contract-verification', query: { hash: addressHash } });

  return (
    <Link
      href={ href }
      target={ config.features.opSuperchain.isEnabled ? '_blank' : undefined }
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
