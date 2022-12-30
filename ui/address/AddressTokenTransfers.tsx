import { useRouter } from 'next/router';
import React from 'react';

import TokenTransfer from 'ui/shared/TokenTransfer/TokenTransfer';

const AddressTokenTransfers = () => {
  const router = useRouter();

  const hash = router.query.id;
  return (
    <TokenTransfer
      resourceName="address_token_transfers"
      pathParams={{ id: hash?.toString() }}
      baseAddress={ typeof hash === 'string' ? hash : undefined }
      enableTimeIncrement
    />
  );
};

export default AddressTokenTransfers;
