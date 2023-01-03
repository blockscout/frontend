import { useRouter } from 'next/router';
import React from 'react';

import TokenTransfer from 'ui/shared/TokenTransfer/TokenTransfer';

const AddressTokenTransfers = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();

  const hash = router.query.id;
  return (
    <TokenTransfer
      resourceName="address_token_transfers"
      pathParams={{ id: hash?.toString() }}
      baseAddress={ typeof hash === 'string' ? hash : undefined }
      enableTimeIncrement
      scrollRef={ scrollRef }
    />
  );
};

export default AddressTokenTransfers;
