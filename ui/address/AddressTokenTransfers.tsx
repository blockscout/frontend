import castArray from 'lodash/castArray';
import { useRouter } from 'next/router';
import React from 'react';

import { QueryKeys } from 'types/client/queries';

import TokenTransfer from 'ui/shared/TokenTransfer/TokenTransfer';

const AddressTokenTransfers = () => {
  const router = useRouter();

  const hash = router.query.id;
  return (
    <TokenTransfer
      path={ `/node-api/addresses/${ hash }/token-transfers` }
      queryName={ QueryKeys.addressTokenTransfers }
      queryIds={ castArray(router.query.id) }
      baseAddress={ typeof hash === 'string' ? hash : undefined }
      enableTimeIncrement
    />
  );
};

export default AddressTokenTransfers;
